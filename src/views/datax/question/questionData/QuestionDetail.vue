<template>
  <el-dialog
    title="问题数据记录"
    :visible.sync="questionDetailVisible"
    :before-close="closeDialog"
    class="question-detail"
    :lock-scroll="false"
    width="760px"
    :close-on-click-modal="false"
    @open="openDialog"
  >
    <el-table v-loading="isLoadingTable" stripe class="tb-edit" :data="tableData" style="width: 100%" height="320">
      <template v-for="(col ,index) in cols">
        <el-table-column
          :show-overflow-tooltip="true"
          :label="col.label"
          :prop="col.label"
        >
          <template slot-scope="scope">
            <span v-text="scope.row[scope.column.property].value" /><br>
            <span v-if="scope.row[scope.column.property].errorMsgs" style="color: #F67F89" v-text="scope.row[scope.column.property].errorMsgs" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      class="ar mt15"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next,jumper"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
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
  props: ['questionDetailVisible', 'isQuestionDetail'],
  data() {
    return {
      cols: [],
      tableData: [],
      isLoadingTable: false,

      currentPage: 1,
      total: 0,
      pageLength: 10
    }
  },
  watch: {
    isQuestionDetail: { // 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {

      },
      deep: true
    }
  },
  mounted: function() {

  },
  methods: {
    closeDialog() {
      this.cols = [];
      this.tableData = [];
      this.$emit('questionDetailBack');
    },
    handleCurrentChange(cb) {
      this.currentPage = cb;
      this.getData()
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    handleSizeChange(cb) {
      this.pageLength = cb;
      this.getData()
    },
    openDialog() {
      this.getData()
    },
    getData() {
      const params = {
        id: this.isQuestionDetail.id,
        start: (this.currentPage - 1) * 10,
        length: this.pageLength
      };
      this.isLoadingTable = true;
      this.$urlApi.dataQuality.problemDetail(params).then((res) => {
        this.isLoadingTable = false;
        const heads = [];
        for (const item in res.tableHead) {
          heads.push(
            { label: res.tableHead[item], prop: res.tableHead[item] + '.value', errorMsgs: res.tableHead[item] + '.errorMsgs' }
          )
        }
        this.cols = heads;
        this.tableData = res.data;
        this.total = res.recordsFiltered
      })
    }
  }
}
</script>

<style lang="scss">
    .question-detail{
        .el-table td, .el-table .el-table th{
            padding: 6px 0;
        }
    }
</style>
