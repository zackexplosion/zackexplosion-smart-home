<template>
  <div>
    <Chart
      title="room-temperature"
      sensor-key="room-co2"
      data-name="temperature"
      :data-key="1"
    />
    <Chart
      title="room-co2"
      sensor-key="room-co2"
      data-name="co2ppm"
      :data-key="2"
    />
  </div>
</template>
<script>
import Chart from './chartCreator'
export default {
  components: {
    Chart
  },
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>
