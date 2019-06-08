const chartID = 'chart'
const socket = io('/monitor')
var chartInit = false
var render_data = {}

function renderTitle(data) {
  return `ROOM MONITOR <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature} c, ${moment(data.timestamp).format('LTS')}`
}

function renderLael(date) {
  return moment(date).format('mm:ss')
}

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
  }
  let c = Object.assign({}, render_data, {
    type: 'scatter'
  })
  Plotly.plot(chartID, [c],
  {
    title: renderTitle(data[0])
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

  // debugger

  Plotly.update(chartID, {
    y: [render_data.y],
    x: [render_data.x]
  }, {
    title: renderTitle(data)
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