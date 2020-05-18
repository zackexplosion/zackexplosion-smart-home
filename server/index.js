const request = require('axios')
const moment = require('moment')
const express = require('express')

const app = express()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9527');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})

const http = require('http').Server(app)
const io = require('socket.io')(http, { origins: '*:*'})

var tmpData = []
io.on('connection', socket => {
  console.log(socket.id, 'on connection')
  socket.emit('setInitData', tmpData)
  // socket.on('getInitData', _ => {
  //   socket.emit('setInitData', tmpData)
  // })
})


async function getSensor () {
  try {
    const res = await request('http://10.1.1.3/?token=YEEEEEEE')
    console.log(res.data)

    io.emit('sensorUpdate', res.data)

    tmpData.push({...res.data, timestamp: new Date().getTime()})

    if(tmpData.length >= 60) {
      tmpData.shift()
    }
  } catch (error) {

  }

  setTimeout(getSensor, 5000)
}

getSensor()


const PORT = parseInt(process.env.PORT) || 3000
http.listen(PORT, function () {
  console.log(`Room Monitor app started on port ${PORT}`)
})