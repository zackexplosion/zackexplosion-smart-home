<template>
  <div class="container">
    <h1>Wryyyyy</h1>
    <Switches />
    <Charts />
  </div>
</template>

<script>
import Charts from '~/components/charts'
import Switches from '~/components/switches'
export default {
  components: {
    Switches,
    Charts
  }
}
</script>

<style scoped>
.container {
  max-width: 1024px;
  margin:0 auto;
}
</style>
