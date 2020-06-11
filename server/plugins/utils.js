import Vue from 'vue'
import humanizeDuration from 'humanize-duration'

// filters
Vue.filter('humanizeDurationSeconds', function(value) {
  if (!value) return value
  return humanizeDuration(value * 1000)
})

Vue.filter('humanizeDuration', function(value) {
  if (!value) return value
  return humanizeDuration(value)
})

// web scoket
import io from 'socket.io-client'

Vue.prototype.$socket = io('/')
