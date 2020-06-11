const DB_HOST = process.env.DB_HOST || 'db'
const DB_PORT = process.env.DB_PORT || 27017

const mongoose = require('mongoose')

const SensorsLog = mongoose.model('SensorsLog', {
  name: String,
  temperature: Number,
  humidity: Number,
  co2ppm: Number,
  timestamp: Date
})

var models = {
  SensorsLog
}
module.exports = new Promise((resolve, reject) => {
  console.log('create new db connection')
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/room-monitor`, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
  }).then(() => {
    return resolve(models)
  }, err => {
    reject(err)
  })
})

