<template>
  <el-row class="container">
    <el-col :md="12">
      <Sensors />
      <Switches />
    </el-col>
    <el-col :md="12">
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
/* .container {
  max-width: 1024px;
  margin:0 auto;
} */
</style>
