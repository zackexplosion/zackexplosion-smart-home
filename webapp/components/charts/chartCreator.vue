<template>
  <div :id="renderTo" />
</template>
<script>
import { createChart } from './utils'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    dataName: {
      type: String,
      required: true
    },
    sensorKey: {
      type: String,
      required: true
    },
    dataKey: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  computed: {
    renderTo() {
      return 'chart-' + this.sensorKey + this.dataKey.toString()
    }
  },
  mounted() {
    this.$socket.on('setInitData', _ => {
      const data = _['sensors'][this.sensorKey]
      if (!data) {
        console.log(this.sensorKey, 'init data is not avaiable')
        return
      }

      var initData = data.map(c => {
        return [c[0], c[this.dataKey]]
      })

      this.chart = createChart({
        title: this.title,
        renderTo: this.renderTo,
        dataName: this.dataName || this.title,
        initData
      })
    })

    this.$socket.on('updateSensors', _ => {
      const data = _[this.sensorKey]
      if (!data) return

      this.chart.series[0].addPoint([
        data.timestamp,
        data[this.dataName]
      ], false, true)

      this.chart.series[1].addPoint([
        data.timestamp,
        data[this.dataName]
      ], true, true)
    })
  }
}
</script>
