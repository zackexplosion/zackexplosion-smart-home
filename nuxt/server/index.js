let http = require('http')
const app = require('express')()
http = http.Server(app)
const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const request = require('axios')
// const moment = require('moment')
const io = require('socket.io')(http, { origins: '*:*' })
const { loadNuxt, build } = require('nuxt')
const { SWITCHES, SENSORS } = require('./config')
const events = require('events')
const em = new events.EventEmitter()

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  // Listen the server
  http.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}
const initData = {
  sensors: {}
}
SENSORS.forEach(s => {
  initData['sensors'][s.name] = []
});

(async function readSensorsRunner() {
  var dataToUpdate = {}
  var sensorsData = []
  try {
    sensorsData = await readSensors()
  } catch (error) {
    console.error(error)
  }

  sensorsData.forEach(d => {
    if (initData['sensors'][d.name].length > 60) {
      initData['sensors'][d.name].shift()
    }
    initData['sensors'][d.name].push(d)
  })

  sensorsData.forEach(s => {
    dataToUpdate[s.name] = s
  })

  if (Object.keys(dataToUpdate).length > 0) {
    io.emit('updateSensor', dataToUpdate)
    em.emit('updateSensor', dataToUpdate)
  }

  setTimeout(readSensorsRunner, 5000)
})()

async function readSensors() {
  var results = []
  try {
    results = await Promise.all(SENSORS.map(s => {
      var url = s.api
      if (s.token) {
        url = url + `?token=${s.token}`
      }
      return request(url).then(res => {
        return {
          ...res.data,
          name: s.name,
          timestamp: new Date().getTime()
        }
      })
    }))
  } catch (error) {
    // console.error(error)
  }

  return results
}

async function getSwitchesStatus() {
  var switchesStatus = []
  try {
    const promises = await Promise.all(SWITCHES.map(s => {
      return request(s.api)
    }))

    promises.forEach((s, index) => {
      switchesStatus.push({
        name: SWITCHES[index].name,
        uptime: s.data.uptime,
        status: (s.data.isSwitchOn === 1)
      })
    })
  } catch (error) {
    console.error(error)
  }

  return switchesStatus
}

(async function switchesStatusRunner() {
  var status = {
    switchesStatus: []
  }
  try {
    const s = await getSwitchesStatus()
    status.switchesStatus = s
    io.emit('updateStatus', status)
  } catch (error) {
    console.error(error)
  }

  setTimeout(() => {
    switchesStatusRunner()
  }, 1000)
})()

em.on('updateSensor', function(data) {
  const bData = data['room-co2']
  const {
    co2ppm,
    temperature
  } = bData
  const s = SWITCHES.find(_ => _.name === 'inputFan')
  if (!s) return false

  if (co2ppm > 700 && temperature < 30 && !s.status) {
    s.on()
  } else if (co2ppm < 500 && s.status) {
    s.off()
  }
})

io.on('connection', async(socket) => {
  // console.log(socket.id, 'on connection')
  try {
    initData['switchesStatus'] = await getSwitchesStatus()
  } catch (error) {
    initData['switchesStatus'] = []
  }

  console.log('seding init data', initData)

  socket.emit('setInitData', initData)

  socket.on('changeSwitchStatus', _switch => {
    const s = SWITCHES.find(_ => {
      return _.name === _switch.name
    })

    if (!s) return
    // switch on/off
    (_switch.status) ? s.on() : s.off()
  })
})

start()
