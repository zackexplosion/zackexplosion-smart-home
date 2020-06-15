const {
  getSensorsStatus
} = require('../lib')

module.exports = function({ db, io, em }) {
  (async function getSensorsStatusRunner() {
    var dataToUpdate = {}
    var sensorsData = []
    try {
      sensorsData = await getSensorsStatus()
    } catch (error) {
      console.error(error)
    }

    var saveDataPromises = []
    for (var i in sensorsData) {
      const d = sensorsData[i]

      const s = db.SensorsLog.create({
        name: d.name,
        temperature: d.temperature || 0,
        humidity: d.humidity || 0,
        co2ppm: d.co2ppm || 0,
        timestamp: new Date()
      })
      saveDataPromises.push(s)
      dataToUpdate[d.name] = d
    }

    await Promise.all(saveDataPromises)

    if (Object.keys(dataToUpdate).length > 0) {
      io.emit('updateSensors', dataToUpdate)
      em.emit('updateSensors', dataToUpdate)
    }

    setTimeout(getSensorsStatusRunner, 5000)
  })()
}
