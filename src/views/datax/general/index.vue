<template>
  <div class="general">
    <div class="top">
      <el-button type="primary">关联个性化规则</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
      />
      <el-table-column
        prop="ruleName"
        align="center"
        label="规则名称"
        width="180"
      />
      <el-table-column
        prop="ruleCode"
        align="center"
        label="规则编码"
        width="180"
      />
      <el-table-column
        prop="ruleDesc"
        align="center"
        label="规则描述"
      />
      <el-table-column
        align="center"
        prop="inRule"
        wdith="100"
        label="个性化规则"
      />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          ruleName: '检验主要字段是否为空',
          ruleCode: 'A001',
          ruleDesc: '检验每张表的必要属性是否为空，若为空则不规范',
          inRule: ''
        },
        {
          ruleName: '检验主要字段是否为空',
          ruleCode: 'A002',
          ruleDesc: '检验每张表的必要属性是否为空，若为空则不规范',
          inRule: ''
        },
        {
          ruleName: '检验主要字段是否为空',
          ruleCode: 'A003',
          ruleDesc: '检验每张表的必要属性是否为空，若为空则不规范',
          inRule: ''
        }
      ],
      currentPage4: 4
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>

<style lang="scss">
.general {
  padding: 30px;
  .top {
    height: 30px;
    line-height: 30px;
    margin-bottom: 20px;
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
