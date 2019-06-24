const path = require('path')
const glob = require("glob")

function hashPath (file) {
  let { name, ext } = path.parse(file)
  let _p = path.join(__dirname, '..', 'dist', `${name}-*${ext}`)
  console.log(_p)
  let files = glob.sync(_p, {})
  if (files.length == 1) {
    let { base } = path.parse(files[0])
    return '/' + base
  } else {
    throw 'asset-not-found'
  }
}

module.exports = app => {
  app.locals.hashPath = hashPath
}