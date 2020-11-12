<!--
 * @Date: 2020-11-12 11:28:52
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-11-12 15:44:19
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\msgBox.vue
 * @Description: 消息展示框
-->
<template>
  <div>
    <el-dialog :visible="isShow" width="width" :title="title" :show-close="true" @close="execWhenClose">
      <el-form>
        <el-form-item>
          <slot name="content" />
        </el-form-item>
      </el-form>
      <el-divider />
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType.length > 1" type="primary" plain size="small" @click="execWhenClose">{{ dialogType[1] }}</el-button>
        <el-button type="primary" size="small" @click="submit">{{ dialogType[0] }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Msgbox',
  props: {
    /** 宽度 */
    width: { type: String, default: '' },
    isShow: { type: Boolean, default: false },
    title: { type: String, default: '' },
    callback: { type: Function, default: () => {} },
    type: { type: String, default: 'submit' }
  },
  data() {
    return {

    }
  },
  computed: {
    dialogType() {
      switch (this.type) {
        case 'submit':
          return ['提交', '取消']
        case 'info':
          return ['确认']
        case 'question':
          return ['确认', '取消']
        case 'update':
          return ['更新', '取消']
        case 'add':
          return ['添加', '取消']
        default:
          return ['提交', '取消']
      }
    }
  },
  methods: {
    /**
       * @description: 关闭
       */
    execWhenClose() {
      this.$emit('close')
    },
    /**
     * @description: 提交
     */
    submit() {
      this.$emit('submit', this.callback)
    }
  }
}
</script>

<style lang="scss" scoped>
>>>.el-dialog__body {
  padding-bottom: 12px;
}
</style>
