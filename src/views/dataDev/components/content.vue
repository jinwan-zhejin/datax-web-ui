<template>
  <el-container>
    <el-main style="padding:0px;height:100%;">
      <!--
        <div class="selected">
            <el-select style="color: #f0f0f2" v-model="sourceName" clearable filterable placeholder="请选择" @change="handleChange">
                <el-option v-for="item in options" :key="item.id" :label="item.datasourceName" :value="item.id" />
            </el-select>
            <el-select style="margin-left: -5px" v-model="sqlName" clearable placeholder="请选择" @change="handleChangeSQL" filterable>
                <el-option v-for="item in options1" :key="item" :label="item" :value="item" />
            </el-select>
        </div>
        -->
      <CodeMirror :sql-height="sqlHeight" :table-list="tableList" :column-list="columnList" @querysql="runQuery" />

      <TableDetail ref="table" />

    </el-main>
  </el-container>
</template>

<script>
import {
  list
} from '@/api/datax-jdbcDatasource';
import {
  getTables,
  getTableColumns,
  getTableSchema,
  getTableList,
  getTableListWithComment
} from '@/api/metadata-query';
import CodeMirror from './codeMirrror';
import TableDetail from './tableDetail';
export default {
  name: 'DataDevContent',
  components: {
    CodeMirror,
    TableDetail,
    name: 'DataDevContent'
  },
  props: ['dblparams', 'parentlist', 'clist', 'tlist'],

  data() {
    return {
      activeNames: [],
      dataBaseList: [],
      tableList: [],
      SchemaList: [],
      columnList: [],
      dataBaseid: '',
      schemaId: '',
      tableName: '',
      dragging: false, // 是否拖拽,
      sqlHeight: 200,
      tableHeight: 300,
      tableId: '',
      tableNameWithComment: '',
      sourceName: '', // 数据源名
      sqlName: '', // 数据库名
      options: [],
      options1: [],
      datasourceWidth: 100,
      queryDsInfo: {}
    };
  },
  watch: {

    dataBaseid() {
      this.getSchema();
    },
    parentlist(val) {
      if (val.length > 0) {
        this.options = val
      }
    },
    clist(val) {
      console.log(val, 'clist')
      this.columnList = val
    },
    tlist(val) {
      console.log(val, 'tlist')
      this.tableList = val
    }
  },
  created() {
    this.getDataBaseList();
    console.log(this.parentlist)
  },
  methods: {
    setQueryParams(qp) {
      this.queryDsInfo = qp;
    },

    handleChangeSQL(value) {
      console.log(value)
      this.datasourcewidth = value.length
    },
    handleChange(value) {
      console.log(value)
      getTableSchema({
        datasourceId: value
      }).then((res) => {
        console.log(res)
        this.options1 = res
      }).catch(err => {
        console.log(err);
        this.options1 = []
        this.sqlName = ''
      })
    },
    // 获取数据库列表
    getDataBaseList() {
      list({
        current: 1,
        size: 100000
      }).then((res) => {
        this.dataBaseList = res.records;
        this.dataBaseid = res.records[0].id;
        this.getSchema();
      });
    },

    // 获取schema
    getSchema() {
      getTableSchema({
        datasourceId: this.dataBaseid
      }).then((res) => {
        this.SchemaList = res;
      }).catch(err => {
        console.log(err);
      });
    },

    // getTableList
    getTableList() {
      // getTableList({ id: this.dataBaseid, schema: this.schemaId })
      //   .then(res => {
      //     console.log('res', res);
      //     this.tableList = res;
      //   })
      getTableListWithComment({
        id: this.dataBaseid,
        schema: this.schemaId
      })
        .then(res => {
          console.log('res', res);
          this.tableList = res;
        })
    },
    // 获取字段
    getClo() {
      getTableColumns({
        // getColumns({
        datasourceId: this.dataBaseid,
        tableName: this.tableName,
        schema: this.schemaId
      }).then((res) => {
        console.log(res)
        this.columnList = res.datas;
      });
    },
    // 选择表
    selectTable(val) {
      this.tableNameWithComment = val
      this.tableName = val.split(' ')[0];
      this.getClo();
      this.activeNames = ['1']
    },
    // 拖拽设置表格高度
    setTableHeight(e) {
      const _this = this;
      if (this.dragging) {
        const top = e.target.offsetTop; // 获取鼠标距离父元素顶的高度
        const height = e.target.parentNode.parentNode.offsetHeight;
        console.log(top, height);
        const sqlHeightRate = (top / height).toFixed(2);
        const tableHeightRate = 1 - sqlHeightRate;
        // this.sqlHeight = sqlHeightRate * height;
        // this.tableHeight = tableHeightRate * height;
      }
    },
    // 执行sql
    runQuery(val) {
      console.log(val, '子传父');
      console.log(this.queryDsInfo)
      this.$refs.table.queryData(this.queryDsInfo, val.code, {})
    },
    previewData(params) {
      this.$refs.table.initData(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.contentLeft {
    background: white;
    padding: 0 15px 0 15px;
    min-height: 630px;
    border-right: 1px solid #F0EDED;
}

.dataBase {
    margin-top: 20px;
}

.selected {
    width: 100%;
    height: 32px;
    // line-height: 8px;
    background-color: #f0f0f2;

}

.dataBase,
.table {
    padding: 0px;
    width: 100%;
    /* border-bottom: 1px solid rgb(245, 241, 241); */
}

.dragBar {
    display: none;
    color: #cfd8dc;
    text-align: center;
}

.dragBar span {
    cursor: row-resize;
}

.tableName {
    color: green;
    font-weight: bolder;
    font-size: 16px;
}

.P-tit {
    padding: 10px 0px;
}

.disnone::-webkit-scrollbar {
    display: none;
}

.el-form .el-select {
    width: 100%;
}
</style>
