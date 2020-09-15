<template>
  <el-container>
    <el-aside width="25%" class="contentLeft">
      <div class="dataBase">
        <el-select style="width:100%" v-model="dataBaseid" clearable placeholder="请选择数据库">
          <el-option
            v-for="item in dataBaseList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          style="margin-top:10px;width:100%;"
          v-model="tableId"
          clearable
          placeholder="请选择表"
        >
          <el-option v-for="item in tableList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div class="table">
        <span>
          查看表结构
          <em>({{tableList.length}} in {{dataBaseid}})</em>
        </span>
        <el-select
          style="margin-top:10px;width:100%"
          v-model="tableId"
          clearable
          placeholder="请选择表"
          @change="selectTable"
        >
          <el-option v-for="item in tableList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
      <div>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1" >
            <template slot="title">
              <p class="tableName">{{tableName}}</p>
            </template>
            <div style="max-height:360px;overflow:scroll;">
              <div v-for="(item) in columnList" :key="item">{{item}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside>
    <el-main style="padding:0 10px;height:100%;">
      <CodeMirror :sqlHeight='sqlHeight' :tableList='tableList' :columnList='columnList' @querysql='runQuery' />
      <div class="dragBar">
        <span
          @mousedown="dragging = true"
          @mouseup="dragging = false"
          @mousemove="setTableHeight"
        >==</span>
      </div>
      <TableDetail ref="table" :tableHeight='tableHeight' />
    </el-main>
  </el-container>
</template>
<script>
import { list } from "@/api/datax-jdbcDatasource";
import { getTables, getColumns } from "@/api/metadata-query";
import CodeMirror from "./codeMirrror";
import TableDetail from "./tableDetail";
export default {
  name: "DataDevContent",
  components: {
    CodeMirror,
    TableDetail,
  },
  data() {
    return {
      activeNames: [],
      dataBaseList: [],
      tableList: [],
      columnList: [],
      dataBaseid: "",
      tableId: "",
      tableName: "",
      dragging: false, //是否拖拽,
      sqlHeight: 200,
      tableHeight:300
    };
  },
  methods: {
    //获取数据库列表
    getDataBaseList() {
      list({ current: 1, size: 100000 }).then((res) => {
        this.dataBaseList = res.records;
        this.dataBaseid = res.records[0].id;
        this.getTablesList();
      });
    },

    //获取表
    getTablesList() {
      getTables({ datasourceId: this.dataBaseid }).then((res) => {
        this.tableList = res;
      });
    },
    //获取字段
    getClo() {
      getColumns({
        datasourceId: this.dataBaseid,
        tableName: this.tableName,
      }).then((res) => {
        this.columnList = res;
      });
    },
    //选择表
    selectTable(val) {
      this.tableName = val;
      this.getClo();
    },
    //拖拽设置表格高度
    setTableHeight(e) {
      const _this = this;
      if (this.dragging) {
        const top = e.target.offsetTop; //获取鼠标距离父元素顶的高度
        const height = e.target.parentNode.parentNode.offsetHeight;
        console.log(top, height);
        const sqlHeightRate = (top / height).toFixed(2);
        const tableHeightRate = 1 - sqlHeightRate;
        // this.sqlHeight = sqlHeightRate * height;
        // this.tableHeight = tableHeightRate * height;
      }
    },
    //执行sql
    runQuery() {
      this.$refs.table.initData()
    }
  },
  created() {
    this.getDataBaseList();
  },
  watch: {
    dataBaseid() {
      this.getTablesList();
    },
  },
};
</script>
<style scoped>
.contentLeft {
  background: white;
  padding: 0 2px 0 15px;
}
.dataBase,
.table {
  padding: 0 0 20px;
  width: 100%;
  border-bottom: 1px solid rgb(245, 241, 241);
}
.dragBar {
  color: #cfd8dc;
  text-align: center;
}
.dragBar span {
  cursor: row-resize;
}
.tableName {
  color: green;
  font-weight: bolder;
  font-size: 20px;
}
</style>