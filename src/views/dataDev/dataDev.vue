<template>
  <div style="margin:30px;min-height:705px;border-radius: 0px 0px 8px 8px;">
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
