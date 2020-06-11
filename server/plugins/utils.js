import Vue from 'vue'
import humanizeDuration from 'humanize-duration'

// filters
Vue.filter('humanizeDurationSeconds', function(value) {
  if (!value) return value
  return humanizeDuration(value * 1000, {
    round: true
  })
})

Vue.filter('humanizeDuration', function(value) {
  if (!value) return value
  return humanizeDuration(value, {
    round: true
  })
})

// web scoket
import io from 'socket.io-client'

Vue.prototype.$socket = io('/')

import HighchartsVue from 'highcharts-vue'

Vue.use(HighchartsVue)
