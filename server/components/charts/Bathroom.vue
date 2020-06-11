<template>
  <el-row>
    <el-col :md="12">
      <apexchart
        ref="temperature_chart"
        type="line"
        :options="temperature_options"
        :series="t_series"
      />
    </el-col>
    <el-col :md="12">
      <apexchart
        ref="humidity_chart"
        type="line"
        :options="humidity_options"
        :series="h_series"
      />
    </el-col>
  </el-row>

</template>

<script>
import apexchart from 'vue-apexcharts'
import { createOptions } from './utils'
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
      temperature_options: createOptions({
        title: 'Bathroom temperature',
        ymax: 50
      }),
      humidity_options: createOptions({
        title: 'Bathroom humidity',
        ymax: 100
      }),
      t_series: [
        {
          name: '溫度',
          type: 'line',
          data: []
        }
      ],
      h_series: [
        {
          name: '濕度',
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
        var t_series_data = []
        var h_series_data = []
        newValue.forEach(n => {
          t_series_data.push({
            x: n.timestamp,
            y: n.temperature
          })

          h_series_data.push({
            x: n.timestamp,
            y: n.humidity
          })
        })

        this.$refs.temperature_chart.updateSeries([{
          data: t_series_data
        }], false, true)

        this.$refs.humidity_chart.updateSeries([{
          data: h_series_data
        }], false, true)
      }
    }
  }
}
</script>
