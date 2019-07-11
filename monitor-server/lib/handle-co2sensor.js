const config = require('../config.js')
const got = require('got')

let sensors_status
module.exports = ({
  onCO2SensorRecieve,
  io
  })=> {
  const sensorsIO = io.of('/sensors')

  // init status
  sensorsIO.on('connection', socket => {
    socket.emit('updateSensorsStatus', sensors_status)
  })

  async function getCO2PPMFromSensor() {
    const sensor = config.devices.find(d => d.type == 'co2sensor')
    try {
      const response = await got('http://' + sensor.ip, {
        json: true,
        timeout: 500
      })
      const co2ppm = parseInt(response.body.co2ppm)
      let last_record = {
        sensor: sensor.name,
        timestamp: new Date(),
        temperature: response.body.temperature,
        co2ppm,
      }
      onCO2SensorRecieve(last_record)
      sensor.uptime = response.body.uptime
      sensors_status = [sensor]

      // broadcast sensors_status
      sensorsIO.emit('updateSensorsStatus', sensors_status)
    } catch (error) {
      console.log(error.code)
    }
    setTimeout(getCO2PPMFromSensor, 1000)
  }

  getCO2PPMFromSensor()
}