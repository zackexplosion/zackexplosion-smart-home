const got = require('got')
const config = require('../config.js')
const SWITCHS = config.devices.filter(d => {
  return d.type == 'switch'
})

var switch_status = []

function parseSwitchResponse(_switch, data) {
  let isSwitchOn = (data.isSwitchOn == 1) ? true : false

  return {
    name: _switch.name,
    ...data,
    isSwitchOn
  }
}

function switchOn(name){
  let _switch = switch_status.find(_ => _.name === name)
  if(_switch.isSwitchOn) return
  controlSwitch({
    name,
    isSwitchOn: true
  })
}

function switchOff(name){
  let _switch = switch_status.find(_ => _.name === name)
  if(!_switch.isSwitchOn) return
  controlSwitch({
    name,
    isSwitchOn: false
  })
}

async function controlSwitch (s) {

  // find switch from list
  let _switch = SWITCHS.find(_ => _.name === s.name)

  // create action
  let action = (s.isSwitchOn) ? 'on' : 'off'

  let url = `http://${_switch.ip}/${action}?token=${_switch.token}`
  // make request
  let options = {
    json: true,
    timeout: 100
  }
  return got(url, options).then(res => {
    return parseSwitchResponse(_switch, res.body)
  })
}

async function getSwitchStatus(){
  let data = await Promise.all(SWITCHS.map(s => {
    return got(`http://${s.ip}/`, {
        json: true,
        timeout: 100
      })
      .then( res => {
        return parseSwitchResponse(s, res.body)
      })
      .catch(res => {
        return parseSwitchResponse(s, {
          isSwitchOn: false,
        })
      })
  }))
  if (switch_status.length == 0) {
    switch_status = data
  } else {
    switch_status = switch_status.map(s => {
      let d = data.find(_ => _.name == s.name)
      if(d) {
        return d
      } else {
        return s
      }
    })
  }

  // console.log(switch_status)
}

module.exports = io => {
  const switchMonitor = io.of('/switch')

  switchMonitor.on('connection', async socket => {
    try {
      if(switch_status.length == 0 ) {
        await getSwitchStatus()
      }
      socket.emit('initSwitchStatus', switch_status)
    } catch (error) {
      console.error(error.code)
    }

    socket.on('controlSwitch', async (_switch, done) => {
      try {
        let data = await controlSwitch(_switch)
        switch_status = switch_status.map(s => {
          if(s.name == data.name) {
            return data
          } else {
            return s
          }
        })
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
      await getSwitchStatus()
      switchMonitor.emit('updateSwitchStatus', switch_status)
    } catch (error) {
      console.error(error)
    }
  }, 1000)

  return {
    switchOn,
    switchOff
  }
}