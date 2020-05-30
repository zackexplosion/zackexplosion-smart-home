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
        labels: [
          '01 Jan 2001',
          '02 Jan 2001',
          '03 Jan 2001',
          '04 Jan 2001',
          '05 Jan 2001',
          '06 Jan 2001',
          '07 Jan 2001',
          '08 Jan 2001',
          '09 Jan 2001',
          '10 Jan 2001',
          '11 Jan 2001',
          '12 Jan 2001'
        ],
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
      options: {
        chart: {
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          type: 'datetime',
          range: 777600000
        },
        yaxis: {
          max: 100
        }
        // xaxis: {
        //   categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        // }
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
      ],
      series: []
    }
  },
  watch: {
    data: {
      deep: true,
      handler(newValue, oldValue) {
        var hData = []
        var tData = []
        newValue.forEach(n => {
          hData.push(n.temprature)
          tData.push(n.humidity)
        })
        // this.$refs.chart.updateSeries([{
        //   name: 'Website Blog',
        //   type: 'column',
        //   data: hData
        // },
        // {
        //   name: 'Social Media',
        //   type: 'line',
        //   data: tData
        // }])
      }
    }
  }
}
</script>
