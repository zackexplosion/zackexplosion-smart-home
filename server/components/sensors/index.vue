<template>
  <section>
    <h2>Sensors</h2>
    <el-table
      :data="sensorsArray"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="Name"
        width="150"
      />
      <el-table-column
        label="Uptime"
        width="250"
      >
        <template slot-scope="scope">
          {{ scope.row.uptime | humanizeDuration }}
        </template>
      </el-table-column>
      <el-table-column
        prop="temperature"
        label="溫度"
        width="100"
      />
      <el-table-column
        prop="humidity"
        label="濕度"
        width="100"
      />
      <el-table-column
        prop="co2ppm"
        label="CO2ppm"
        width="100"
      />
      <el-table-column
        prop=""
        label=""
      />
    </el-table>
  </section>
</template>

<script>

export default {
  data() {
    return {
      sensors: {},
      countSensorsUptimeInterval: null,
      sensorsUptimeInterval: 1000
    }
  },
  computed: {
    sensorsArray() {
      return Object.keys(this.sensors).map(k => {
        return this.sensors[k]
      })
    }
  },
  destroyed() {
    clearInterval(this.countSensorsUptimeInterval)
  },
  mounted() {
    this.$socket.on('setInitData', (data) => {
      const { sensorsStatus } = data
      if (!sensorsStatus) return

      this.sensors = {}
      sensorsStatus.forEach(s => {
        this.sensors[s.name] = s
      })
    })

    this.$socket.on('updateSensors', (sensors) => {
      this.sensors = Object.assign({}, {}, this.sensors)
      Object.keys(sensors).forEach(k => {
        this.sensors[k] = { ...sensors[k] }
      })
    })

    this.countSensorsUptimeInterval = setInterval(() => {
      this.countSensorsUptime()
    }, this.sensorsUptimeInterval)
  },
  methods: {
    countSensorsUptime() {
      this.sensors = Object.assign({}, {}, this.sensors)
      Object.keys(this.sensors).forEach(k => {
        var uptime = this.sensors[k].uptime + this.sensorsUptimeInterval
        this.sensors[k] = Object.assign({}, this.sensors[k], {
          uptime
        })
      })
    }
  }
}
</script>
