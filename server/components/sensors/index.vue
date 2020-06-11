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
        width="350"
      >
        <template slot-scope="scope">
          {{ scope.row.uptime | humanizeDuration }}
        </template>
      </el-table-column>
      <el-table-column
        prop="temperature"
        label="溫度"
      />
      <el-table-column
        prop="humidity"
        label="濕度"
      />
      <el-table-column
        prop="co2ppm"
        label="CO2ppm"
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
      const { sensors } = data
      if (!sensors) return

      this.sensors = {}
      for (var key in sensors) {
        const _ = sensors[key]
        const s = _[_.length - 1]
        this.sensors[key] = s
      }
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
