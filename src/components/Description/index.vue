<!--
 * @Date: 2021-02-03 14:05:48
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-03 15:06:15
 * @FilePath: \datax-web-ui\src\components\Description\index.vue
 * @Description: 描述组件
-->

<template>
  <div class="context">
    <div class="title">
      <slot name="title" />
      <div class="action">
        <slot name="action" />
      </div>
    </div>
    <el-row :gutter="20">
      <slot name="context" />
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Description',
  props: {

  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.context {
  padding: 20px;
  .title {
    line-height: 32px;
    margin-bottom: 10px;
    .action {
      float: right;
      line-height: 32px;
    }
  }
}
</style>
