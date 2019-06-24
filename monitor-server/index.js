const express = require('express')
const app = express()
const moment = require('moment')
const path = require('path')
const got = require('got')
const config = require('./config.js')
const DB_HOST = process.env.DB_HOST || 'db'
const DB_PORT = process.env.DB_PORT || 27017
app.use(express.static(path.join(__dirname, 'dist')))

const mongoose = require('mongoose')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const IOmonitor = io.of('/monitor')

require(path.join(__dirname, 'lib', 'hashpath'))(app)
require(path.join(__dirname, 'lib', 'handle-switch'))(io)

// setup view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const Monitor = mongoose.model('Monitor', {
  sensor: String,
  temperature: Number,
  co2ppm: Number,
  timestamp: Date,
  // battery: Number
})

async function getLast(minutes = 10){
  let last = await Monitor.find({
    timestamp: {$gte: moment().subtract(minutes, 'minutes')}
  }).sort('-timestamp').exec()
  return last.map(r => {
    return {
      timestamp: r.timestamp,
      temperature: r.temperature,
      co2ppm: r.co2ppm,
      // battery: r.battery,
    }
  }).reverse()
}

IOmonitor.on('connection', async socket => {
  socket.emit('lastRecords', {
    data: await getLast(5),
    title: 'ROOM MONITOR, last 5 minutes'
  })
})

app.get('/', async function (req, res) {
  res.render('index')
})

async function getCO2PPMFromSensor() {
  const sensor = config.devices.find(d => d.type == 'co2sensor')
	try {
    const response = await got('http://' + sensor.ip, {json: true});
    const co2ppm = parseInt(response.body.co2ppm)
    let record = {
      sensor: sensor.name,
      timestamp: new Date(),
      temperature: response.body.temperature,
      co2ppm,
    }
    IOmonitor.emit('newRecord', record)
    record = await new Monitor(record).save()
	} catch (error) {
		console.log(error.code);
	}
  setTimeout(getCO2PPMFromSensor, 1000)
}

getCO2PPMFromSensor();

const PORT = parseInt(process.env.PORT) || 3000

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/room-monitor`, {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
}).then(() => {
  http.listen(PORT, function () {
    console.log(`Room Monitor app started on port ${PORT}`)
  })
}, err => {
  console.log(err)
})
