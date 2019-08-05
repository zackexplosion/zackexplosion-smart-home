const io = require('socket.io-client')

const socket = io('http://localhost:4000', {})


socket.on('connect', () => {
  setInterval( () => {
    socket.emit('requestLatest')
  }, 1000)

  socket.on('responseLatest', data => {
    console.log(data)
  })
})