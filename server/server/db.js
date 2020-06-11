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

// mongoose.set('debug', true)

module.exports = new Promise((resolve, reject) => {
  console.log('create new db connection')
  mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/room-monitor`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE
  }).then(() => {
    return resolve(models)
  }, err => {
    reject(err)
  })
})

// const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')

// // Connection URL
// const url = 'mongodb://localhost:27017'

// // Database Name
// const dbName = 'myproject'

// // Create a new MongoClient
// const client = new MongoClient(url)

// // Use connect method to connect to the Server
// client.connect(function(err) {
//   assert.equal(null, err)
//   console.log('Connected successfully to server')

//   const db = client.db(dbName)

//   client.close()
// })
