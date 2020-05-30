<template>
  <Bathroom :data="bathroomThChartData" />
</template>
<script>
import Bathroom from './Bathroom.vue'
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
    this.$socket.on('setInitData', (data) => {
      console.log('setInitData', data)
      this.bathroomThChartData = data.bathroom.map((d) => {
        return {
          temperature: d.temperature,
          humidity: d.humidity,
          x: d.timestamp
        }
      })
    })

    this.$socket.on('sensorUpdate', (data) => {
      const d = data.bathroom
      if (this.bathroomThChartData.length > 100) {
        this.bathroomThChartData.shift()
      }
      this.bathroomThChartData.push({
        temperature: d.temperature,
        humidity: d.humidity,
        x: d.timestamp
      })
      // console.log('sensorUpdate', data)
    })
  }
}
</script>
