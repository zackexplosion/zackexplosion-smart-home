<template lang="html">
  <table id="switch-control" class="pure-table">
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
      <tr v-for="s, key in switchs">
        <td>{{key+1}}</td>
        <td>{{s.name}}</td>
        <td v-bind:class="{ 'switch-down': s.uptime === 0}">
          {{formatUptime(s.uptime)}}
        </td>
        <td>{{s.version}}</td>
        <td>
          <div v-if="s.uptime > 0" class="onoffswitch">
            <input
              type="checkbox"
              name="onoffswitch"
              class="onoffswitch-checkbox"
              :id="'onoffswitch-' + key"
              :checked="s.isSwitchOn"
              v-on:click="toggleSwitch($event, s)"
            >
            <label class="onoffswitch-label" :for="'onoffswitch-' + key">
                <span class="onoffswitch-inner"></span>
                <span class="onoffswitch-switch"></span>
            </label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const humanizeDuration = require('humanize-duration')
const socket = io('/switch')
export default {
  data() {
    return {
      switchs: [],
    }
  },
  methods: {
    addCount(name) {
      this.counter[name] ++
    },
    formatUptime(uptime) {
      return humanizeDuration(uptime)
    },
    toggleSwitch(e, _switch) {
      e.preventDefault()
      socket.emit('controlSwitch', {
        name: _switch.name,
        isSwitchOn: !_switch.isSwitchOn
      }, (error, data) => {
        if (error) {
          return alert(error)
        }
        _switch.isSwitchOn = data.isSwitchOn
      })
    }
  },
  created() {
    socket.on('initSwitchStatus', data => {
      this.switchs = data
    })

    socket.on('updateSwitchStatus', data => {
      // console.log(data)
      this.switchs = this.switchs.map(s => {
        let d = data.find(_ => _.name == s.name)
        s.uptime = d.uptime
        return s
      })
    })
  }
};
</script>

<style lang="sass">
#switch-control
  width: 100%
</style>
