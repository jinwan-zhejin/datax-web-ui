<template>
  <div class="app-container">
    <el-form
      class="input_from"
      label-position="right"
      label-width="120px"
      :model="readerForm"
      :rules="rules"
      ref="readerFrom"
    >
      <el-form-item label="数据库源：" prop="datasourceId">
        <el-select
          v-model="datasourceId"
          filterable
          @change="rDsChange"
        >
          <el-option
            v-for="item in $store.state.taskAdmin.dataSourceList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-show="
          dataSource === 'postgresql' ||
            dataSource === 'greenplum' ||
            dataSource === 'oracle' ||
            dataSource === 'sqlserver'
        "
        label="Schema："
        prop="tableSchema"
      >
        <el-select
          v-model="readerForm.tableSchema"
          allow-create
          default-first-option
          filterable
          
          @change="schemaChange"
        >
          <el-option
            v-for="item in schemaList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库表名：" prop="tableName">
        <el-select
          v-model="readerForm.tableName"
          allow-create
          default-first-option
          filterable
          
          @change="rTbChange"
        >
          <el-option
            v-for="item in rTbList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="添加规则字段：">
        <div style="border:1px solid #f3f3f3;width:100%;">
          <el-table
            :data="tableData1"
            :header-cell-style="{
              background: '#F8F8FA',
              'font-size': '12px',
              'font-family': 'PingFangHK-Medium, PingFangHK',
              'font-weight': '500',
              'color': '#333333',
              'padding':0,
              'padding-left':'25px',
              'text-align':'left'
            }"
            :header-row-style="{'height':'40px','padding':0}"
            style="width: 100%"
          >
            <el-table-column prop="columnName" align="center" label="字段名称">
              <template v-slot:default="row">
                <el-select
                  v-if="row.row.status"
                  v-model="row.row.columnName"
                  filterable
                  placeholder="请选择字段"
                >
                  <el-option
                    v-for="item in rColumnList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <span v-else>{{ row.row.columnName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rules" align="center" label="规则名称">
              <template v-slot:default="row">
                <el-select
                  v-if="row.row.status"
                  v-model="row.row.ruleId"
                  clearable
                  filterable
                  multiple
                  placeholder="请选择规则名称"
                >
                  <el-option
                    v-for="item in nameList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
                
                <p v-for="(my, index) in row.row.ruleId" v-else :key="index">
                  {{ my }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot="header">
                <span>操作</span>
              </template>
              <template v-slot:default="row">
                <!-- <i
                  style="cursor: pointer; margin-right: 10px;color:rgba(61, 95, 255, 1);"
                  class="el-icon-edit"
                  @click="editRow(row)"
                /> -->
                <i
                  style="cursor: pointer;color:red;"
                  class="el-icon-delete"
                  @click="delRow(row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="addRow_btn" @click="addRow"><span><i class="el-icon-plus" /> 添加规则字段</span></div>
      </el-form-item>
     
      <el-form-item label="切分字段：">
        <el-input
          v-model="readerForm.splitPk"
          placeholder="切分主键"
        />
      </el-form-item>
      <el-form-item label="表所有字段：">
        <el-checkbox
          v-model="readerForm.checkAll"
          :indeterminate="readerForm.isIndeterminate"
          @change="rHandleCheckAllChange"
        >全选
        </el-checkbox>
        <div style="margin: 15px 0" />
        <el-checkbox-group
          v-model="readerForm.columns"
          @change="rHandleCheckedChange"
        >
          <el-checkbox v-for="c in rColumnList" :key="c" :label="c">{{
            c
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="where条件：" prop="where">
        <el-input v-model="readerForm.where" placeholder="where条件，不需要再加where" type="textarea" style="width: 42%" />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query';
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource';
import Bus from '../busReader';

export default {
  name: 'RDBMSReader',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 200,
        ascs: 'datasource_name'
      },
      datasourceId:'',
      datasourceName:'',
      arr: [],
      tableData1: [],
      rDsList: [],
      rTbList: [],
      schemaList: [],
      rColumnList: [],
      nameList: [],
      loading: false,
      active: 1,
      customFields: '',
      customType: '',
      customValue: '',
      dataSource: '',
      readerForm: {
        datasourceId: undefined,
        tableName: '',
        columns: [],
        where: '',
        querySql: '',
        checkAll: false,
        isIndeterminate: true,
        splitPk: '',
        tableSchema: '',
        rule: []
      },
      rules: {
        datasourceId: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        // tableSchema: [
        //   { required: true, message: 'this is required', trigger: 'change' }
        // ]
      }
    };
  },
  watch: {
    'readerForm.datasourceId': function(oldVal, newVal) {
      if (
        this.dataSource === 'postgresql' ||
        this.dataSource === 'greenplum' ||
        this.dataSource === 'oracle' ||
        this.dataSource === 'sqlserver'
      ) {
        this.getSchema();
      }
      this.getTables('rdbmsReader');
    },
    'readerForm.rule': function(oldVal, newVal) {
      console.log(newVal);
    },

    tableData1:{ //深度监听规则字段表格，表格内容变化时，直接改变readerForm参数
      handler(newVal) {

        let arr = JSON.parse(JSON.stringify(newVal));
        arr.forEach(ele => {
          let codeArr = []
          ele.ruleId.forEach(code => {
            codeArr.push({code})
          })
          ele.ruleId = codeArr;
        });

        this.readerForm.rule = arr;
      },
      deep: true
    }

  },
  created() {
    this.getJdbcDs();
  },
  methods: {
    // 添加行
    addRow() {
      // this.tableData1.map((item) => {
      //   if (item.status) {
          // console.log('this.readerForm', this.readerForm);
          // console.log('item',item)
          // item.columnName = this.readerForm.columnName;
          // for (let i = 0; i < this.nameList.length; i++) {
          //   for (let j = 0; j < this.readerForm.rule.length; j++) {
          //     if (this.nameList[i].code === this.readerForm.rule[j]) {
          //       const obj = {};
          //       obj.name = this.nameList[i].name;
          //       obj.code = this.nameList[i].code;
          //       item.ruleId.push(obj);
          //     }
          //   }
          // }
          // this.readerForm.columnName = '';
        //   item.status = 0;
        // }
      //   return item;
      // });

      this.tableData1.push({
        columnName: '',
        ruleId: [],
        status: 1
      });
    },
    // 编辑行
    editRow(row) {
      console.log('row',row);
      this.tableData1.map((item) => {
        if (item.status) {
          item.status = 0;
        }
        // if (item === row.row) {
        //   this.readerForm.columnName = item.columnName;
        //   this.readerForm.rule = item.ruleId;
        //   item.status = 1;
        // }
        return item;
      });
      this.readerForm.rule = this.tableData1;
    },
    // 删除行
    delRow(row) {
      const index = this.tableData1.indexOf(row.row);
      this.tableData1.splice(index, 1);
      this.readerForm.rule = this.tableData1;
      console.log('this.readerForm.rule',this.readerForm.rule);
    },

    // 获取可用数据源
    getJdbcDs(type) {
      this.loading = true;
      this.jdbcDsQuery.projectId = this.$store.state.taskAdmin.projectId;
      jdbcDsList(this.jdbcDsQuery).then((response) => {
        const { records } = response;
        this.rDsList = records;
        this.loading = false;
      });
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {};
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            datasourceId: this.readerForm.datasourceId,
            tableSchema: this.readerForm.tableSchema
          };
        } else {
          obj = {
            datasourceId: this.readerForm.datasourceId
          };
        }
        // 组装
        dsQueryApi.getTables(obj).then((response) => {
          if (response) {
            this.rTbList = response;
          }
        });
      }
    },
    getSchema() {
      const obj = {
        datasourceId: this.readerForm.datasourceId
      };
      dsQueryApi.getTableSchema(obj).then((response) => {
        this.schemaList = response;
      });
    },
    // schema 切换
    schemaChange(e) {
      this.readerForm.tableSchema = e;
      // 获取可用表
      this.getTables('rdbmsReader');
    },
    // reader 数据源切换
    rDsChange(e) {
      this.datasourceId = e;
      this.rDsList = this.$store.state.taskAdmin.dataSourceList;
      // 清空
      this.readerForm.tableName = '';
      this.readerForm.datasourceId = e;
      this.rDsList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource;
          this.datasourceName = item.datasourceName;
        }
      });
      Bus.dataSourceId = e;
      this.$emit('selectDataSource', this.dataSource);
    },
    getTableColumns() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        tableName: this.readerForm.tableName
      };
      dsQueryApi.getColumns(obj).then((response) => {
        this.rColumnList = response;
        this.readerForm.columns = response;
        this.readerForm.checkAll = true;
        this.readerForm.isIndeterminate = false;
      });
    },
    // 获取规则名称
    getNameList() {
      dsQueryApi
        .getAllName()
        .then((res) => {
          console.log(res);
          this.nameList = [];
          if (res.code === 200) {
            for (let i = 0; i < res.content.data.length; i++) {
              const obj = {};
              obj.code = res.content.data[i].code;
              obj.name = res.content.data[i].name;
              this.nameList.push(obj);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getColumnsByQuerySql() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        querySql: this.readerForm.querySql
      };
      dsQueryApi.getColumnsByQuerySql(obj).then((response) => {
        this.rColumnList = response;
        this.readerForm.columns = response;
        this.readerForm.checkAll = true;
        this.readerForm.isIndeterminate = false;
      });
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        if (this.readerForm.querySql !== '') {
          this.getColumnsByQuerySql();
        } else {
          this.getTableColumns();
        }
        this.getNameList();
      }
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t;
      this.rColumnList = [];
      this.readerForm.columns = [];
      this.getColumns('reader');
    },
    rHandleCheckAllChange(val) {
      this.readerForm.columns = val ? this.rColumnList : [];
      this.readerForm.isIndeterminate = false;
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length;
      this.readerForm.checkAll = checkedCount === this.rColumnList.length;
      this.readerForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rColumnList.length;
    },
    getData() {
      if (Bus.dataSourceId) {
        this.readerForm.datasourceId = Bus.dataSourceId;
      }
      return this.readerForm;
    }
  }
};
</script>

<style scoped>
.input_from >>> .el-form-item {
  margin-bottom: 15px;
}
.addRow_btn {
  color: rgba(61, 95, 255, 1);
  text-align: center;
  width: 100%;
  cursor: pointer;
  /* background: red; */
  border: 1px solid #F3F3F3;;
  border-top: 0;
}
</style>
