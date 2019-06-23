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

socket.on('lastRecords', ({ data, title }) => {

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

// const chartID = 'chart'
// const socket = io('/monitor')
// const labelFormater = 'HH:mm'
// var chartInit = false
// var render_data = {}

// function renderTitle(data) {
//   return `ROOM MONITOR, lastest 5 mins <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature}℃, ${moment(data.timestamp).format('LTS')}`
// }

// function renderLael(date) {
//   return moment(date).format(labelFormater)
// }

// var tickvals = [
//   moment().add(5, 'minutes').format(labelFormater)
// ]
// var period = 5
// for (let index = 1; index <= 60/period; index++) {
//   let m = moment().subtract(index * period, 'minutes').format(labelFormater)
//   tickvals.push(m)
// }
// tickvals = tickvals.reverse()

// socket.on('lastRecords', socket => {
//   const { data } = socket
//   render_data = {
//     y: data.map(d => { return d.co2ppm}),
//     // x: data.map(d => {
//     //   return renderLael(d.timestamp)
//     // }),
//   }
//   let c = Object.assign({}, render_data, {
//     type: 'scatter'
//   })

//   Plotly.plot(chartID, [c],
//   {
//     title: renderTitle(data[0]),
//     xaxis: { tickvals }
//   },
//   {
//     responsive: true
//   })
//   chartInit = true
// })

// socket.on('newRecord', data => {
//   if (!chartInit) {
//     return false
//   }

//   // remove last data
//   render_data.y.shift()
//   // render_data.x.shift()

//   let label = renderLael(data.timestamp)
//   render_data.y.push(data.co2ppm)
//   // render_data.x.push(label)

//   let diff = moment().diff(moment(tickvals[tickvals.length-1]), 'minutes')
//   console.log('moment()', moment(tickvals[tickvals.length-1]))
//   console.log('diff', diff)
//   if ( diff >= 15 ) {
//     let last = tickvals.shift()
//     tickvals.push(renderLael(label))
//   }

//   // console.log('render_data.x', render_data.x)
//   // console.log('tickvals', tickvals)

//   Plotly.update(chartID, {
//     y: [render_data.y],
//     // x: [render_data.x]
//   }, {
//     title: renderTitle(data),
//     // xaxis: { tickvals }
//   })
document.getElementById('switch-on').addEventListener('click', e => {
  socket.emit('switch-on')
})

document.getElementById('switch-off').addEventListener('click', e => {
  socket.emit('switch-off')
})