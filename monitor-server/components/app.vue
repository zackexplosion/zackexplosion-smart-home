<template lang="html">
  <div>
    <Sensors />
    <Switches />
  </div>
</template>

<script>
import Switches from './switches.vue'
import Sensors from './sensors.vue'
export default {
  components: {
    Switches,
    Sensors
  }
}
</script>

<style lang="sass">

</style>
