const chartID = 'chart'
const socket = io('/monitor')
var ctx = document.getElementById('chart')
var chart
var chartInit = false
var render_data = {}

function renderTitle(data) {
  return `ROOM MONITOR <br /> CO2: ${data.co2ppm} PPM, TEMP: ${data.temperature} c, ${moment(data.timestamp).format('LTS')}`
}

function renderLael(date) {
  return moment(date).format('mm:ss')
}

socket.on('lastRecords', data => {
  var lineChartData = {
    labels: data.map(d => { return renderLael(d.timestamp)}),
    datasets: [{
      label: 'CO2 PPM',
      data: data.map(d => { return d.co2ppm}),
      yAxisID: 'y-axis-1',
    }, {
      label: 'temperature',
      data: data.map(d => { return d.temperature}),
      yAxisID: 'y-axis-2',
    }]
  }
  chart = new Chart(ctx, {
    type: 'line',
    data: lineChartData,
    options: {
      responsive: true,
      // hoverMode: 'index',
      // stacked: false,
      title: {
        display: true,
        text: 'Chart.js Line Chart - Multi Axis'
      },
      scales: {
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
        }, {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'y-axis-2',

          // grid line settings
          // gridLines: {
          //   drawOnChartArea: false, // only want the grid lines for one axis to show up
          // },
        }],
      }
    }
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
  // render_data.y.shift()
  // render_data.x.shift()
  // render_data.y.push(data.co2ppm)
  // render_data.x.push(label)

  // debugger

  // Plotly.update(chartID, {
  //   y: [render_data.y],
  //   x: [render_data.x]
  // }, {
  //   title: renderTitle(data)
  // })

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