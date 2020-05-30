<template>
  <div class="container">
    <Charts />
    <Switches />
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
