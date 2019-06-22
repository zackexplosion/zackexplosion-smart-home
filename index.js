const { TOKEN } = process.env
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

let IOmonitor = io.of('/monitor')

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

IOmonitor.on('connection', async socket => {
  socket.emit('lastRecords', {
    data: await getLast(5),
    title: 'ROOM MONITOR, last 5 minutes'
  })
})

app.get('/', async function (req, res) {
  res.render('index')
})

// app.get('/last', async function (req, res) {
//   const limit = req.query.limit || 600
//   return res.json(await getLast(limit))
// })

// recorder
// app.get('/zawarudo', async function (req, res) {

//   if ( req.query.token == TOKEN) {
//     let record = {
//       timestamp: new Date(),
//       temperature: req.query.t,
//       co2ppm: req.query.c,
//       battery: req.query.battery,
//     }
//     new Monitor(record).save()
//     IOmonitor.emit('newRecord', record)
//   }
//   res.send('')
// })

if (process.env.NODE_ENV !== 'production') {
  setInterval(async () => {
    let last = await Monitor.findOne({}).sort('-timestamp')
    IOmonitor.emit('newRecord', last)
  }, 1000)
}

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
