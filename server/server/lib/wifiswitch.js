const request = require('axios')
module.exports = class WifiSwitch {
  constructor(options) {
    this.name = options.name
    this.api = options.api
    this.token = options.token
  }

  on() {
    const url = `${this.api}/on?token=${this.token}`
    return request(url)
  }

  off() {
    const url = `${this.api}/off?token=${this.token}`
    return request(url)
  }
}
