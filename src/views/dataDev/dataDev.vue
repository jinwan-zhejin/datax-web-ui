<template>
  <div style="padding:10px 0;min-height:705px;">
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
