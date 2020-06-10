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
    console.log('sensorsData', sensorsData)
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
    await Promise.all(SENSORS.map(s => {
      var url = s.api
      if (s.token) {
        url = url + `?token=${s.token}`
      }
      return request({
        url,
        timeout: 1000
      }).then(res => {
        results.push({
          ...res.data,
          name: s.name,
          timestamp: new Date().getTime()
        })
      })
    }))
  } catch (error) {
    console.error(error.address, error.code)
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

var lastCO2ppm = 100000
em.on('updateSensor', function(data) {
  // console.log(data)
  const bData = data['room-co2']
  const oData = data['outdoor-TH']
  const bathroomData = data['bathroom-TH']
  if (!bData || !oData) return
  const {
    co2ppm
  } = bData

  const s = SWITCHES.find(_ => _.name === 'inputFan')
  if (!s) return false
  console.log('lastCO2ppm', lastCO2ppm)
  console.log('co2ppm', co2ppm)
  console.log('oData.temperature', oData.temperature)

  if (lastCO2ppm >= co2ppm && oData.temperature <= 30 && !s.status) {
    s.on()
  } else if (co2ppm < 500 && s.status) {
    s.off()
  }

  lastCO2ppm = co2ppm

  const s2 = SWITCHES.find(_ => _.name === 'outputFan')

  if (bathroomData.humidity > 70) {
    s2.on()
  } else {
    s2.off()
  }
})

io.on('connection', async(socket) => {
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
