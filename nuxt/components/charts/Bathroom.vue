<template>
  <apexchart
    ref="chart"
    type="line"
    :options="options2"
    :series="series2"
  />
</template>

<script>
import apexchart from 'vue-apexcharts'
export default {
  components: {
    apexchart
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options2: {
        chart: {
          height: 350,
          type: 'line',
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: 'Traffic Sources'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: [],
        xaxis: {
          type: 'datetime'
        },
        yaxis: [
          {
            title: {
              text: 'Website Blog'
            }
          },
          {
            opposite: true,
            title: {
              text: 'Social Media'
            }
          }
        ]
      },
      series2: [
        {
          name: 'Website Blog',
          type: 'column',
          data: []
        },
        {
          name: 'Social Media',
          type: 'line',
          data: []
        }
      ]
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newValue, oldValue) {
        var hData = []
        var tData = []
        var labels = []
        newValue.forEach(n => {
          // debugger
          // hData.push(n.temprature)
          const y = n.timestamp / 1000
          hData.push({
            x: n.temperature,
            y
          })
          tData.push({
            x: n.humidity,
            y
          })
          labels.push(n.timestamp)
        })

        this.$refs.chart.updateOptions({
          ...this.options2.chart
          // labels
        })
        const d = [{
          name: 'Website Blog',
          type: 'column',
          data: hData
        },
        {
          name: 'Social Media',
          type: 'line',
          data: tData
        }]

        // console.log(d)
        this.$refs.chart.updateSeries(d)
      }
    }
  }
}
</script>
