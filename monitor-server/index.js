const express = require('express')
const app = express()
const moment = require('moment')
const path = require('path')
const DB_HOST = process.env.DB_HOST || 'db'
const DB_PORT = process.env.DB_PORT || 27017
app.use(express.static(path.join(__dirname, 'dist')))

const mongoose = require('mongoose')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const IOmonitor = io.of('/monitor')

require(path.join(__dirname, 'lib', 'hashpath'))(app)
const {
  switchOn,
  switchOff
} = require(path.join(__dirname, 'lib', 'handle-switch'))(io)

require(path.join(__dirname, 'lib', 'handle-humidity'))({io})


const CO2_AIR_INPUT_OPEN_ON = 800
const CO2_AIR_INPUT_CLOSE_ON = 600

async function onCO2SensorRecieve(record) {
  IOmonitor.emit('newRecord', record)
  await new Monitor(record).save()


  const {
    co2ppm
  } = record
  console.log('co2ppm', co2ppm)
  if (co2ppm >= CO2_AIR_INPUT_OPEN_ON) {
    switchOn('Switch2')
  } else if(co2ppm <= CO2_AIR_INPUT_CLOSE_ON) {
    switchOff('Switch2')
  }
}

require(path.join(__dirname, 'lib', 'handle-co2sensor'))({
  onCO2SensorRecieve,
  io
})

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
