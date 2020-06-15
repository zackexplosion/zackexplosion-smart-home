var lib = {}
require('fs').readdirSync(__dirname).forEach(function(file) {
  const name = file.split('.').shift()
  lib[name] = require('./' + file)
})

module.exports = lib
