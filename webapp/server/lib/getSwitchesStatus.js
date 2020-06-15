const request = require('axios')
const { SWITCHES } = require('../config')
module.exports = async function getSwitchesStatus() {
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
