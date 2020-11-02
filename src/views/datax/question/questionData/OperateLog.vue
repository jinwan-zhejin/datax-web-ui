<template>
  <el-dialog
    title="处理记录"
    :visible.sync="operateLogVisible"
    :before-close="closeDialog"
    class="operate-log"
    :lock-scroll="false"
    width="500px"
    :close-on-click-modal="false"
    @open="openDialog"
  >
    <el-row>
      <p>处理人：{{ dealPeople }}</p>
      <p>处理结论：{{ dealComment }}</p>
      <p>处理时间：{{ dealTime | date('%Y-%m-%d %T') }}</p>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ElRow from 'element-ui/packages/row/src/row';

export default {
  name: '',
  components: { ElRow },
  props: ['operateLogVisible', 'isOperateLog'],
  data() {
    return {
      dealPeople: '',
      dealComment: '',
      dealTime: ''
    }
  },
  mounted: function() {

  },
  methods: {
    closeDialog() {
      this.$emit('operateLogBack');
    },
    openDialog() {
      console.log(this.isOperateLog)
      this.dealPeople = this.isOperateLog.dealPeople;
      this.dealComment = this.isOperateLog.dealComment;
      this.dealTime = this.isOperateLog.dealTime;
    }
  }
}
</script>

<style lang="scss">
    .operate-log{

    }
</style>
