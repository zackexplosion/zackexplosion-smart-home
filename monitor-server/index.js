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
const web_io = io.of('/web')

const { VALID_SENSOR_ID_LIST } = require('./config')

require(path.join(__dirname, 'lib', 'hashpath'))(app)

// setup view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const Monitor = mongoose.model('Sensors', {
  sensor: String,
  temperature: Number,
  humidity: Number,
  timestamp: Date,
})

io.on('connection', socket => {
  socket.on('add_record', async data => {
    const ID = data.sensor_id
    if (VALID_SENSOR_ID_LIST.includes(ID)) {
      let record = await Monitor.create({
        sensor: ID,
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: new Date()
      })
      console.log(record)
    } else {
      console.log('invalid token')
    }
  })
  // socket.emit('hello', 'hello')

  socket.on('requestLatest', async () => {
    // await Monitor.find({sensor})
    let data = VALID_SENSOR_ID_LIST.map(async s => {
      return Monitor.findOne({sensor: s}).sort('-timestamp')
    })

    data = await Promise.all(data)
    // console.log(data)
    socket.emit('responseLatest', data)
  })

  socket.on('requestHistory', async () => {
    // await Monitor.find({sensor})
    let data = VALID_SENSOR_ID_LIST.map(async s => {
      return Monitor.find({sensor: s}).sort('-timestamp').limit(600)
    })

    data = await Promise.all(data)
    // console.log(data)
    socket.emit('responseHistory', data)
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
