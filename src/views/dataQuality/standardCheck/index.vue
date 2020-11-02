<template>
  <section class="standard-check-section main-outer">
    <el-row class="common-condition ar mb15" />
    <el-row class="main-inner">
      <el-tabs v-model="tabType" type="border-card" :tab-position="tabPosition" @tab-click="tabClick">
        <el-tab-pane :key="1" label="待审核标准" name="check-standard">
          <CheckStandardTab :check-standard-visible="checkStandardVisible" />
        </el-tab-pane>
        <el-tab-pane :key="2" label="已审核标准" name="checked-standard">
          <CheckedStandardTab :checked-standard-visible="checkedStandardVisible" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </section>
</template>

<script>
import ElInput from 'element-ui/packages/input/src/input';
import CheckStandardTab from './CheckStandardTab';
import CheckedStandardTab from './CheckedStandardTab';

export default {
  name: 'StandardCheck',
  components: {
    CheckStandardTab,
    CheckedStandardTab
  },
  data() {
    return {
      tabType: 'check-standard',
      tabPosition: 'top',
      checkStandardVisible: '',
      checkedStandardVisible: ''
    }
  },
  methods: {
    tabClick: function(tab) {
      switch (tab.name) {
        case 'check-standard':
          const tempDate1 = new Date();
          this.checkStandardVisible = tempDate1.toTimeString();
          break;
        case 'checked-standard':
          const tempDate2 = new Date();
          this.checkedStandardVisible = tempDate2.toTimeString();
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="scss">
    .standard-check-section {
        .el-tabs__item {
            height: 42px;
        }
        .el-tabs--border-card {
            border: 0;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            -o-box-shadow: none;
            box-shadow: none;
        }
        .el-tabs--border-card > .el-tabs__header {
            background: transparent;
        }
        .el-tabs--border-card > .el-tabs__header .el-tabs__item {
            margin: 0 -1px -2px;
            background: #F9F9FA;
            border-width: 2px 1px 1px 1px;
            border-style: solid;
            border-color: #E1E5EC;
        }
        .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item.is-active {
            border-top: 2px solid #F67F89;
            background: #fff;
        }
    }
</style>
