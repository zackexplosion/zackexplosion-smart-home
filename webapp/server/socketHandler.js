const moment = require('moment')
const { SWITCHES, SENSORS } = require('./config')
const {
  getSensorsStatus,
  getSwitchesStatus,
  initdataFactory
} = require('./lib')

module.exports = async({ em, io, db }) => {
  var initData = {
    sensors: {}
  }
  try {
    for (const i in SENSORS) {
      const s = SENSORS[i]
      const data = await db.SensorsLog.find({
        name: s.name,
        timestamp: {
          '$gte': moment().subtract(25, 'hours')
        }
      }).exec()

      initData['sensors'][s.name] = data.map(initdataFactory)
    }
  } catch (error) {
    console.error(error)
  }

  io.on('connection', async(socket) => {
    try {
      initData['switchesStatus'] = await getSwitchesStatus()
      initData['sensorsStatus'] = await getSensorsStatus()
    } catch (error) {
      initData['switchesStatus'] = []
    }

    console.log('seding init data')

    socket.emit('setInitData', initData)

    socket.on('changeSwitchStatus', _switch => {
      const s = SWITCHES.find(_ => {
        return _.name === _switch.name
      })

      if (!s) return
      // switch on/off
      (_switch.status) ? s.on() : s.off()
    })

    // socket.on('disconnect', _ => {
    //   initData = null
    // })
  })
}
