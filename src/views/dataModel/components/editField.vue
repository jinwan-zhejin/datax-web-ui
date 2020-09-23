<template>
  <el-tabs type="border-card">
    <el-tab-pane label="基本信息">
      <el-form label-position="left" label-width="80px" :model="GeneralFrom">
        <el-form-item label="表中文名">
          <el-input v-model="GeneralFrom.name"></el-input>
        </el-form-item>
        <el-form-item label="表英文名">
          <el-input v-model="GeneralFrom.code"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Commord">
          <el-input v-model="GeneralFrom.commord"></el-input>
        </el-form-item> -->
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="列">
      <el-button type="info" @click='createFields()'>新增字段</el-button>
      <el-table
        :data="tableData"
        class="tb-edit"
        style="width: 100%"
        highlight-current-row
        @row-click="handleCurrentChange"
      >

        <el-table-column label="字段名" width="180">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.name"
              placeholder="请输入字段名"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="字段中文名" width="180">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.info"
              placeholder="请输入字段中文名"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.info}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="数据类型">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.type"
              placeholder="请输入数据类型"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isPrimarykey" label="是否主键">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model="scope.row.isPrimarykey"
              placeholder="请输入是否主键"
              @change="handleEdit(scope.$index, scope.row)"
            ></el-input>
            <span>{{scope.row.isPrimarykey}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="sql预览">角色管理</el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "EditField",
  props:['tableData'],
  data() {
    return {
      GeneralFrom: {
        name: "",
        code: "",
        commord: "",
      },
      // tableData: [
      //   {
      //     date: "2016-05-02",
      //     name: "王小虎",
      //     address: "上海市",
      //   },
      // ],
    };
  },
  methods: {
    handleCurrentChange(row, event, column) {
      console.log("改变", row, event, column);
    },
    handleEdit(index, row) {
      console.log("修改", index, row);
    },
    handleDelete(index, row) {
      console.log("删除", index, row);
      this.$emit('deleteFidlds', index)
    },
    createFields(){
      this.$emit('createFields');
    }
  },
};
</script>


<style  scoped>
.tb-edit .el-input {
  display: none;
}

.tb-edit .current-row .el-input {
  display: block;
}

.tb-edit .current-row .el-input + span {
  display: none;
}
</style>
