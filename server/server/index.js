let http = require('http')
const app = require('express')()
http = http.Server(app)
const isDev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
// const moment = require('moment')
const io = require('socket.io')(http, { origins: '*:*' })
const { loadNuxt, build } = require('nuxt')

const events = require('events')
const em = new events.EventEmitter()
require('./rules')(em)

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  // Render every route with Nuxt.js
  app.use(nuxt.render)

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt)
  }
  // waiting for database
  // const db = await require('./db')
  const db = {}
  require('./socketHandler')(em, io, db)
  // Listen the server
  http.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}
start()
