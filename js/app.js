import { catchClause } from "../../../Library/Caches/typescript/3.5/node_modules/@types/babel-types";

const chartID = 'chart'
const socket = io('/monitor')
const labelFormater = 'HH:mm:ss'
var chartInit = false
var render_data = {}

function renderTitle(data) {
  return `ROOM MONITOR <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature}℃, ${moment(data.timestamp).format('LTS')}`
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

socket.on('lastRecords', data => {
  render_data = {
    // y: [
    //   data.map(d => { return d.co2ppm}),
    //   data.map(d => { return d.temperature})
    // ],
    y: data.map(d => { return d.co2ppm}),
    x: data.map(d => {
      return renderLael(d.timestamp)
    }),
    // x: [0, 1, 2, 3]
  }
  let c = Object.assign({}, render_data, {
    type: 'scatter'
  })

  Plotly.plot(chartID, [c],
  {
    title: renderTitle(data[0]),
    xaxis: { tickvals }
  },
  {
    responsive: true
  })
  chartInit = true
})

socket.on('newRecord', data => {
  if (!chartInit) {
    return false
  }

  // console.log(data)

  let label = renderLael(data.timestamp)

  // remove last data
  render_data.y.shift()
  render_data.x.shift()

  // render_data.y.push([
  //   data.co2ppm,
  //   data.temperature
  // ])
  render_data.y.push(data.co2ppm)
  render_data.x.push(label)

  // var tickvals = [
  //   moment().add(2, 'minutes').format(labelFormater)
  // ]
  // var period = 5
  // for (let index = 1; index <= 60/period; index++) {
  //   // let m = moment(new Date()).subtract(index * period, 'minutes')
  //   let m = moment().subtract(index * period, 'minutes').format(labelFormater)
  //   tickvals.push(m)
  // }
  // // debugger

  // tickvals.reverse()
  tickvals.shift()
  tickvals.push(renderLael(label))

  console.log('render_data.x', render_data.x)
  console.log('tickvals', tickvals)

  Plotly.update(chartID, {
    y: [render_data.y],
    x: [render_data.x]
  }, {
    title: renderTitle(data),
    xaxis: { tickvals }
  })

  // Plotly.animate(chartID, {
  //   data: [{y: [render_data.y]}],
  //   traces: [0],
  //   layout: {
  //     title: renderTitle(data)
  //   }
  // }, {
  //   transition: {
  //     duration: 500,
  //     easing: 'cubic-in-out'
  //   },
	//   frame: {
	// 	  duration: 500
	//   }
  // })
})