<!--
 * @Date: 2021-02-05 17:23:18
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-05 17:27:58
 * @FilePath: \datax-web-ui\src\views\datax\jobInfo\components\jobDetailProEdit.vue
 * @Description: edit
-->

<template>
  <el-dialog :title="title" :visible="show" @close="handleClose">
    asd
  </el-dialog>
</template>

<script>
export default {
  name: 'JobDetailEdit',
  props: {
    title: { type: String, default: '' },
    show: { type: Boolean, default: false }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
