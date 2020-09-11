<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
.el-popover {
  .el-slider__marks-text {
    width: 40px;
  }
  p {
    margin: 0px;
    padding: 14px 0px;
    cursor: pointer;
    i {
      margin: 0px 20px;
    }
  }
  p:hover {
    cursor: pointer;
    background-color: rgb(235, 232, 232);
  }
}
</style>
