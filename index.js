const {
  SWITCH_ACCESS_TOKEN,
  DEFAULT_SENSOR_IP,
  SWITCH_ACCESS_TOKEN
} = process.env
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

// setup view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const Monitor = mongoose.model('Monitor', {
  timestamp: Date,
  temperature: Number,
  co2ppm: Number,
  battery: Number
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
      battery: r.battery,
    }
  }).reverse()
}

async function switchOn (target_switch) {
  try {
    const response = await got(`http://${target_switch}/on?token=${SWITCH_ACCESS_TOKEN}`, {json: true});
    console.log(response.body)
  } catch (error) {
    console.log(error);
  }
}

function switchOff (target_switch) {
  return got(`http://${target_switch}/on?token=${SWITCH_ACCESS_TOKEN}`, {json: true});
}

IOmonitor.on('connection', async socket => {
  socket.emit('lastRecords', {
    data: await getLast(5),
    title: 'ROOM MONITOR, last 5 minutes'
  })

  socket.on('switch-on', async data => {
    try {
      await switchOn(data)
    } catch (error) {
      console.log(error);
    }
  })

  socket.on('switch-off', async data => {
    try {
      await switchOff(data)
    } catch (error) {
      console.log(error);
    }
  })
})

app.get('/', async function (req, res) {
  res.render('index')
})


const got = require('got')

async function getCO2PPMFromSensor(sensor = DEFAULT_SENSOR_IP) {
	try {
    const response = await got('http://' + sensor, {json: true});
    const co2ppm = parseInt(response.body.co2ppm)
    let record = {
      timestamp: new Date(),
      temperature: response.body.temperature,
      co2ppm,
    }
    IOmonitor.emit('newRecord', record)
    record = await new Monitor(record).save()

    if(co2ppm >= 800){
      switchOn()
    } else {
      switchOff()
    }
	} catch (error) {
		console.log(error);
	}
  setTimeout(getCO2PPMFromSensor, 1000)
}

getCO2PPMFromSensor();



// if (process.env.NODE_ENV !== 'production') {
//   setInterval(async () => {
//     let last = await Monitor.findOne({}).sort('-timestamp')
//     IOmonitor.emit('newRecord', last)
//   }, 1000)
// }

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
