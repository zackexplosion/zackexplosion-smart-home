const {
  getSwitchesStatus
} = require('../lib')
module.exports = function({ db, io, em }) {
  (async function switchesStatusRunner() {
    var status = {
      switchesStatus: []
    }
    try {
      const s = await getSwitchesStatus()
      status.switchesStatus = s
      io.emit('updateSwitchStatus', status)
    } catch (error) {
      console.error(error)
    }

    setTimeout(() => {
      switchesStatusRunner()
    }, 1000)
  })()
}
