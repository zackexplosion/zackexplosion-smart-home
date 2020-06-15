const { SWITCHES } = require('./config')
module.exports = (em) => {
  var lastCO2ppm = 100000

  // handle input fan
  em.on('updateSensors', function(data) {
    const bData = data['room-co2']
    const oData = data['outdoor-TH']
    if (!bData || !oData) return
    const {
      co2ppm
    } = bData

    const s = SWITCHES.find(_ => _.name === 'inputFan')
    if (!s) return false
    // console.log('lastCO2ppm', lastCO2ppm)
    // console.log('co2ppm', co2ppm)
    // console.log('oData.temperature', oData.temperature)

    if (co2ppm >= 800 && oData.temperature <= 30 && !s.status) {
      s.on()
    } else if (co2ppm < 650 && s.status) {
      // s.off()
    }

    lastCO2ppm = co2ppm
  })

  // handle output fan
  em.on('updateSensors', function(data) {
    const bathroomData = data['bathroom-TH']
    const outdoorData = data['outdoor-TH']
    if (!bathroomData || !outdoorData) return

    const s = SWITCHES.find(_ => _.name === 'outputFan')

    if (bathroomData.humidity > 70) {
      s.on()
    } else {
      // s.off()
    }
  })
}
