<template>
  <Bathroom :data="bathroomThChartData" />
</template>
<script>
import Bathroom from './Bathroom.vue'
const dataKey = 'bathroom-TH'

function getData(data) {
  return data['sensors'][dataKey]
}
export default {
  components: {
    Bathroom
  },
  data() {
    return {
      bathroomThChartData: []
    }
  },
  mounted() {
    this.$socket.on('setInitData', _ => {
      // console.log('setInitData', data)
      const data = getData(_)
      // console.log(data)
      this.bathroomThChartData = data
    })

    this.$socket.on('updateSensor', (data) => {
      const d = data[dataKey]
      if (this.bathroomThChartData.length > 100) {
        this.bathroomThChartData.shift()
      }
      this.bathroomThChartData.push({
        temperature: d.temperature,
        humidity: d.humidity,
        timestamp: d.timestamp
      })
    })
  }
}
</script>
