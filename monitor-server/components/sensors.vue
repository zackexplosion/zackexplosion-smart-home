<template lang="html">
  <div v-if="sensors.length > 0">
    <h2>Sensors</h2>
    <table class="pure-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Uptime(active)</th>
          <th>Version</th>
          <th>Control</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="s, key in sensors">
          <td>{{key+1}}</td>
          <td>{{s.name}}</td>
          <td v-bind:class="{ 'switch-down': s.uptime === 0}">
            {{formatUptime(s.uptime)}}
          </td>
          <td>{{s.version}}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const humanizeDuration = require('humanize-duration')
const socket = io('/sensors')
export default {
  data() {
    return {
      sensors: [],
    }
  },
  methods: {
    formatUptime(uptime) {
      return humanizeDuration(uptime)
    }
  },
  created() {
    socket.on('updateSensorsStatus', data => {
      this.sensors = data
    })
  }
};
</script>

<style lang="sass">
.pure-table
  width: 100%
</style>
