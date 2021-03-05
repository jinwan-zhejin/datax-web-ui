<!--
 * @Date: 2021-02-03 14:13:21
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-05 11:38:36
 * @FilePath: \datax-web-ui\src\components\Description\components\items.vue
 * @Description: descrition
-->

<template>
  <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
    <span class="key">{{ keys }}：</span>
    <span class="value">{{ myValue }}</span>
  </el-col>
</template>

<script>
export default {
  name: 'DescriptionItems',
  // eslint-disable-next-line vue/require-prop-types
  props: ['keys', 'values'],
  computed: {
    myValue() {
      if (this.values === '' || this.values === undefined || this.values === null) {
        return '无'
      } else if (this.values === 'IMPORT') {
        return '引入任务'
      } else if (this.values === 'EXPORT') {
        return '导出任务'
      } else if (this.values === 'NORMAL') {
        return '普通任务'
      } else if (this.values === 'SQLJOB') {
        return 'SQL任务'
      } else if (this.values === 'DQCJOB') {
        return '质量任务'
      } else if (this.values === 'VJOB') {
        return '虚任务'
      } else {
        return this.values
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.detail_col {
  padding: 8px;

  .key {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
  }

  .value {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>
