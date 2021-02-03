<!--
 * @Date: 2021-02-03 14:13:21
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-03 15:36:58
 * @FilePath: \datax-web-ui\src\components\Description\components\items.vue
 * @Description: descrition
-->

<template>
  <el-col class="detail_col" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
    <span class="key">{{ keys }}：</span>
    <span class="value">{{ values }}</span>
  </el-col>
</template>

<script>
export default {
  name: 'DescriptionItems',
  // eslint-disable-next-line vue/require-prop-types
  props: ['keys', 'values']
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
