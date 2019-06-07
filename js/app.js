const config = {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'CO2PPM',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1
  }]
  },
  options: {
    maintainAspectRatio: false,
    responsive: false,
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      xAxes: [{
        display: true,
      }],
      yAxes: [{
        display: true,
        // scaleLabel: {
        //   display: true,
        //   labelString: 'PPM'
        // }
        ticks: {
          min: 400
        }
      }]
    }
  }
}

var ctx = document.getElementById('chart').getContext('2d')
var chart = new Chart(ctx, config)

const socket = io('/monitor')

socket.on('newRecord', data => {
  // console.log(data)
  let label = moment(data.timestamp).format('LTS')
  chart.data.labels.push(label)
  chart.data.datasets[0].data.push(data.co2ppm)
  chart.update()
})