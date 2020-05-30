<template>
  <el-table
    :data="switches"
    style="width: 100%"
  >
    <el-table-column
      prop="name"
      label="Name"
    />
    <el-table-column
      prop="uptime"
      label="Uptime"
    />
    <el-table-column
      label="status"
    >
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.status"
          @change="handleSwitchChange(scope.row)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      switches: [
        // {
        //   name: 'inputFan',
        //   uptime: 0,
        //   status: false
        // }
      ]
    }
  },
  mounted() {
    this.$socket.on('setInitData', (data) => {
      this.switches = data.switchesStatus
    })
  },
  methods: {
    handleSwitchChange(_switch) {
      this.$socket.emit('changeSwitchStatus', _switch)
    }
  }
}
</script>
