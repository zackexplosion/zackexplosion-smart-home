const request = require('axios')
const { SENSORS } = require('../config')
module.exports = async function getSensorsStatus() {
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
        var { uptime } = res.data
        switch (s.uptimeFormat) {
          case 's':
            uptime = uptime * 1000
            break
        }
        results.push({
          ...res.data,
          name: s.name,
          uptime,
          timestamp: new Date().getTime()
        })
      })
    }))
  } catch (error) {
    console.error(error.address, error.code)
  }

  return results
}
