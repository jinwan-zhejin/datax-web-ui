<template>
  <el-dialog
    title="历史版本查看"
    :visible.sync="HistoryVisible"
    width="60%"
    :before-close="closeDialog"
    @open="openDialog"
  >
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="数据元名称"
      />
      <el-table-column
        prop="versionDescription"
        show-overflow-tooltip
        label="变更原因"
      />
      <el-table-column
        prop="lastModifyTime"
        :formatter="this.$utils.dateFormat"
        show-overflow-tooltip
        label="更新时间"
      />
      <el-table-column
        prop="attrs[2].attrValue"
        show-overflow-tooltip
        label="数据元类型"
      >
        <template slot-scope="scope">
          <span v-text="scope.row.attrs[2].attrValue+scope.row.attrs[3].attrValue" />
        </template>
      </el-table-column>
      <el-table-column
        prop="attrs[5].attrValue"
        show-overflow-tooltip
        label="值域"
      />
      <el-table-column
        prop="attrs[6].attrValue"
        show-overflow-tooltip
        label="数据范围"
      />
      <el-table-column
        prop="attrs[7].attrValue"
        show-overflow-tooltip
        label="正则表达式"
      />
      <!--<el-table-column
                prop="lastModifyTime"
                label="定义">
            </el-table-column>-->
      <el-table-column
        prop="attrs[8].attrValue"
        label="备注"
      />
    </el-table>
    <el-pagination
      class="ar mt15"
      :current-page="currentPage"
      layout="total, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button type="info" size="small" @click="closeDialog">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'HistoryDetail',
  components: {},
  props: ['historyVisible', 'historyList'],
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageLength: 10,

      tableData: []
    }
  },
  mounted: function() {
  },
  methods: {
    openDialog() {
      console.log(this.historyList.id)
      const param = {
        start: (this.currentPage - 1) * 10,
        length: this.pageLength,
        dataElementId: this.historyList.id
      };
      this.$urlApi.dataStandard.getHistory(param).then((res) => {
        this.tableData = res.data;
        this.total = res.recordsFiltered;
        console.log(res.data)
      });
    },
    closeDialog() {
      this.tableData = [];
      this.$emit('HistoryBack');
    },
    handleSizeChange(cb) {
      this.pageLength = cb;
      this.openDialog()
    },
    handleCurrentChange(cb) {
      this.currentPage = cb;
      this.openDialog()
    }
  }
}

</script>

<style scoped lang="scss">

</style>
