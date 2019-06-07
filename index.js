const { TOKEN } = process.env
const express = require('express')
const app = express()
const morgan = require('morgan')
const path = require('path')

const DB_HOST = process.env.DB_HOST || 'db'
const DB_PORT = process.env.DB_PORT || 27017
app.use(morgan('combined'))
app.use(express.static(path.join(__dirname, 'dist')))

const mongoose = require('mongoose')
mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/room-monitor`, {useNewUrlParser: true})

const http = require('http').Server(app)
const io = require('socket.io')(http)

require(path.join(__dirname, 'lib', 'hashpath'))(app)

// setup view engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

const Monitor = mongoose.model('Monitor', {
  timestamp: Date,
  temperature: Number,
  co2ppm: Number
})

let IOmonitor = io.of('/monitor')

async function getLast(){
  let last = await Monitor.find().sort('-timestamp').limit(10).exec()
  return last.map(r => {
    return {
      timestamp: r.timestamp,
      temperature: r.temperature,
      co2ppm: r.co2ppm
    }
  })
}

app.get('/', async function (req, res) {
  res.render('index')
})

app.get('/last', async function (req, res) {
  return res.json(await getLast())
})

// recorder
app.get('/zawarudo', async function (req, res) {

  if ( req.query.token == TOKEN) {
    let record = {
      timestamp: new Date(),
      temperature: req.query.t,
      co2ppm: req.query.c,
    }
    new Monitor(record).save()
    IOmonitor.emit('newRecord', record)
  }
  res.send('')
})
if (process.env.NODE_ENV !== 'production') {
  let lastDate
  setInterval(async () => {
    let last = await getLast()

    if (lastDate !== last[0].timestamp) {
      IOmonitor.emit('newRecord', last[0])
      lastDate = last[0].timestamp
    }

  }, 1000)
}

const PORT = parseInt(process.env.PORT) || 3000
http.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})