const chartID = 'chart'
const socket = io('/monitor')
const labelFormater = 'HH:mm'
var chartInit = false
var render_data = {}

function renderTitle(data) {
  return `${data.title || ''} <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature}℃, ${moment(data.timestamp).format('LTS')}`
}

function renderLael(date) {
  return moment(date).format(labelFormater)
}

var tickvals = [
  moment().add(5, 'minutes').format(labelFormater)
]
var period = 5
for (let index = 1; index <= 60/period; index++) {
  let m = moment().subtract(index * period, 'minutes').format(labelFormater)
  tickvals.push(m)
}
tickvals = tickvals.reverse()

var rendered = false
socket.on('lastRecords', ({ data, title }) => {
  if(rendered) return

  render_data = {
    y: data.map(d => { return d.co2ppm}),
  }
  let c = Object.assign({}, render_data, {
    type: 'scatter'
  })

  Plotly.plot(chartID, [c],
  {
    title: renderTitle({
      ...data[0],
      title
    }),
    xaxis: { tickvals }
  },
  {
    responsive: true
  })

  rendered = true
  socket.on('newRecord', data => {
    // remove last data
    render_data.y.shift()
    render_data.y.push(data.co2ppm)
    Plotly.update(chartID, {
      y: [render_data.y],
    }, {
      title: renderTitle({...data, title}),
    })
  })
})
import Vue from 'vue'
import App from '../components/app.vue'

new Vue({
  render: h => h(App),
}).$mount('#app')