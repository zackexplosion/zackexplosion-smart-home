const { TOKEN } = process.env
const express = require('express')
const app = express();
const morgan = require('morgan')
app.use(morgan('combined'))

const mongoose = require('mongoose')
mongoose.connect('mongodb://db:27017/room-monitor', {useNewUrlParser: true})

const Monitor = mongoose.model('Monitor', {
  timestamp: Date,
  temperature: Number,
  co2ppm: Number
})
app.get('/', async function (req, res) {
  
})

app.get('/zawarudo', async function (req, res) {

  if ( req.query.token == TOKEN) {
    new Monitor({
      timestamp: new Date(),
      temperature: req.query.t,
      co2ppm: req.query.c,
    }).save()
  }
  res.send('')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})