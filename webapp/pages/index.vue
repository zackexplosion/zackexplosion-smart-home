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
import { Loading } from 'element-ui'
export default {
  components: {
    Switches,
    Sensors,
    Charts
  },
  mounted() {
    const loadingInstance = Loading.service({})
    this.$socket.on('setInitData', (data) => {
      loadingInstance.close()
    })
  }
}
</script>

<style scoped>
/* .container {
  max-width: 1024px;
  margin:0 auto;
} */
</style>
