<!--
 * @Date: 2021-02-05 17:23:18
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-05 18:01:40
 * @FilePath: \datax-web-ui\src\views\datax\jobInfo\components\editDialog\jobDetailProEdit.vue
 * @Description: edit
-->

<template>
  <el-dialog :title="title" :visible="show" @close="handleClose">
    <el-tabs v-model="tabActive" :tab-position="'top'" @tab-click="handleTabClick">
      <el-tab-pane label="基础信息" name="basic">基础信息</el-tab-pane>
      <el-tab-pane label="源表配置" name="source">源表配置</el-tab-pane>
      <el-tab-pane label="目标表配置" name="dest">目标表配置</el-tab-pane>
      <el-tab-pane label="字段映射" name="mapping">字段映射</el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button
        v-if="isEditable"
        type="primary"
        @click="handleSubmit"
      >
        确定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'JobDetailProEdit',
  props: {
    title: { type: String, default: '' },
    show: { type: Boolean, default: false }
  },
  data() {
    return {
      /** 有某一项为编辑状态 */
      isEditable: false,
      tabActive: 'basic'
    }
  },
  methods: {
    /**
     * @description: 关闭
     */
    handleClose() {
      this.$emit('close')
    },
    /**
     * @description: 提交更新
     */
    handleUpdate() {
      console.log('handleUpdate()');
    },
    /**
     * @description: tab点击事件
     */
    handleTabClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #f0f0f0;
}
</style>
