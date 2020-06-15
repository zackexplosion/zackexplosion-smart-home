<template>
  <el-row class="container">
    <el-col>
      <Sensors />
      <Switches />
    </el-col>
    <el-col>
      <Charts />
    </el-col>
  </el-row>
</template>

<script>
import Charts from '~/components/charts'
import Sensors from '~/components/sensors'
import Switches from '~/components/switches'
export default {
  components: {
    Switches,
    Sensors,
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
