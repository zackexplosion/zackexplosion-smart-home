const got = require('got')
const config = require('../config.js')
const SWITCHS = config.devices.filter(d => {
  return d.type == 'switch'
})

function parseSwitchResponse(_switch, data) {
  let isSwitchOn = (data.isSwitchOn == 1) ? true : false

  return {
    name: _switch.name,
    ...data,
    isSwitchOn
  }
}

async function controlSwitch (s) {

  // find switch from list
  let _switch = SWITCHS.find(_ => _.name === s.name)

  // create action
  let action = (s.isSwitchOn) ? 'on' : 'off'

  let url = `http://${_switch.ip}/${action}?token=${_switch.token}`
  console.log(url)
  // make request
  return got(url, {json: true}).then(res => {
    return parseSwitchResponse(_switch, res.body)
  })
}

async function getSwitchStatus(){
  let data = await Promise.all(SWITCHS.map(s => {
    return got(`http://${s.ip}/`, {
      json: true,
      timeout: 100
    })
      .then( res => { return parseSwitchResponse(s, res.body)})
      .catch(res => {
        return parseSwitchResponse(s, {
          isSwitchOn: false,
          uptime: 0
        })
      })
  }))
  return data
}

module.exports = io => {
  const switchMonitor = io.of('/switch')

  switchMonitor.on('connection', async socket => {
    try {
      socket.emit('initSwitchStatus', await getSwitchStatus())
    } catch (error) {
      console.error(error.code)
    }

    socket.on('controlSwitch', async (_switch, done) => {
      try {
        let data = await controlSwitch(_switch)
        return done(null, data)
      } catch (error) {
        console.log(error.code)
        return done(error)
      }
    })
  })

  // sync status every X seconds
  setInterval(async () => {
    try {
      let data = await getSwitchStatus()
      switchMonitor.emit('updateSwitchStatus', data.map(d => {
        return {
          name: d.name,
          uptime: d.uptime
        }
      }))
    } catch (error) {
      console.error(error)
    }
  }, 1000)
}