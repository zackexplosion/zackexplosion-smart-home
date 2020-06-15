const WifiSwitch = require('./classes/wifiswitch')
const SENSORS = [
  {
    name: 'YOUR NAME',
    api: 'YOUR IP',
    token: 'YOUR TOKEN'
  }
]

const SWITCHES = [
  new WifiSwitch({
    name: 'YOUR NAME',
    api: 'YOUR IP',
    token: 'YOUR TOKEN'
  })
]
module.exports = {
  SENSORS, SWITCHES
}
