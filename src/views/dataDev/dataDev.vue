<template>
  <div style="min-height:500px;">
    <HeaderTabs />
    <!-- <DataDevContent /> -->
  </div>
</template>

<script>
import HeaderTabs from './components/headerTabs'
import DataDevContent from './components/content'
export default {
  name: 'DataDev',
  components: {
    HeaderTabs,
    DataDevContent
  }
}
</script>

<style scoped>

</style>
