<template>
  <div class="app-container">
    <el-form label-position="right" label-width="120px" :model="readerForm" :rules="rules">
      <el-form-item label="数据库源：" prop="datasourceId">
        <el-select v-model="readerForm.datasourceId" filterable style="width: 300px" @change="rDsChange">
          <el-option
            v-for="item in rDsList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-show="dataSource==='postgresql' || dataSource==='greenplum' || dataSource==='oracle' ||dataSource==='sqlserver'" label="Schema：" prop="tableSchema">
        <el-select v-model="readerForm.tableSchema" allow-create default-first-option filterable style="width: 300px" @change="schemaChange">
          <el-option
            v-for="item in schemaList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库表名：" prop="tableName">
        <el-select v-model="readerForm.tableName" allow-create default-first-option filterable style="width: 300px" @change="rTbChange">
          <el-option v-for="item in rTbList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加规则字段">
        <el-table
          :data="tableData1"
          border
          style="width: 80%;"
        >
          <el-table-column
            prop="columnName"
            align="center"
            label="字段名称"
          >
            <template v-slot:default="row">
              <el-select v-if="row.row.status" v-model="readerForm.columnName" filterable label="请选择字段">
                <el-option v-for="item in rColumnList" :key="item" :label="item" :value="item" />
              </el-select>
              <span v-else>{{ row.row.columnName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ruleCode"
            align="center"
            label="规则编码"
          >
            <template v-slot:default="row">
              <el-select v-if="row.row.status" v-model="readerForm.rules" filterable multiple label="请选择规则编码">
                <el-option v-for="item in rColumnList" :key="item" :label="item" :value="item" />
              </el-select>
              <span v-else>{{ row.row.ruleCode }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120"
          >
            <template slot="header">
              <span>操作<i style="marginLeft: 20px;cursor: pointer;color: skyblue;" class="el-icon-plus" @click="addRow" /></span>
            </template>
            <template v-slot:default="row">
              <i style="cursor: pointer;marginRight: 20px" class="el-icon-edit" @click="editRow(row)" />
              <i style="cursor: pointer;" class="el-icon-delete" @click="delRow(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="SQL语句：">
        <el-input v-model="readerForm.querySql" :autosize="{ minRows: 3, maxRows: 20}" type="textarea" placeholder="sql查询，一般用于多表关联查询时才用" style="width: 42%" />
        <el-button type="primary" @click.prevent="getColumns('reader')">解析字段</el-button>
      </el-form-item>
      <el-form-item label="切分字段：">
        <el-input v-model="readerForm.splitPk" placeholder="切分主键" style="width: 13%" />
      </el-form-item>
      <el-form-item label="表所有字段：">
        <el-checkbox
          v-model="readerForm.checkAll"
          :indeterminate="readerForm.isIndeterminate"
          @change="rHandleCheckAllChange"
        >全选
        </el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="readerForm.columns" @change="rHandleCheckedChange">
          <el-checkbox v-for="c in rColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="where条件：" prop="where">
        <el-input v-model="readerForm.where" placeholder="where条件，不需要再加where" type="textarea" style="width: 42%" />
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import Bus from '../busReader'

export default {
  name: 'RDBMSReader',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 200,
        ascs: 'datasource_name'
      },
      tableData1: [
        // {
        //   columnName: '123',
        //   ruleCode: 'a001'
        // }
      ],
      rDsList: [],
      rTbList: [],
      schemaList: [],
      rColumnList: [],
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
        tableSchema: ''
      },
      rules: {
        datasourceId: [{ required: true, message: 'this is required', trigger: 'change' }],
        tableName: [{ required: true, message: 'this is required', trigger: 'change' }],
        tableSchema: [{ required: true, message: 'this is required', trigger: 'change' }]
      }
    }
  },
  watch: {
    'readerForm.datasourceId': function(oldVal, newVal) {
      if (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') {
        this.getSchema()
      }
      this.getTables('rdbmsReader')
    }
  },
  created() {
    this.getJdbcDs()
  },
  methods: {
    // 添加行
    addRow() {
      this.tableData1.map(item => {
        if (item.status) {
          item.columnName = this.readerForm.columnName
          item.ruleCode = this.readerForm.rules
          item.status = 0
        }
        return item
      })
      this.tableData1.push({
        id: Date.parse(new Date()),
        columnName: '',
        ruleCode: '',
        status: 1
      })
      console.log(this.tableData1)
    },
    // 编辑行
    editRow(row) {
      this.tableData1.map(item => {
        if (item.status) {
          item.status = 0
        }
        if (item === row.row) {
          item.columnName = this.readerForm.columnName
          item.ruleCode = this.readerForm.rules
          item.status = 1
        }
        return item
      })
      console.log(row.row)
    },
    // 删除行
    delRow(row) {
      console.log(row.row)
      const index = this.tableData1.indexOf(row.row)
      this.tableData1.splice(index, 1)
    },
    // 获取可用数据源
    getJdbcDs(type) {
      this.loading = true
      jdbcDsList(this.jdbcDsQuery).then(response => {
        const { records } = response
        this.rDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {}
        if (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') {
          obj = {
            datasourceId: this.readerForm.datasourceId,
            tableSchema: this.readerForm.tableSchema
          }
        } else {
          obj = {
            datasourceId: this.readerForm.datasourceId
          }
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          if (response) {
            this.rTbList = response
          }
        })
      }
    },
    getSchema() {
      const obj = {
        datasourceId: this.readerForm.datasourceId
      }
      dsQueryApi.getTableSchema(obj).then(response => {
        this.schemaList = response
      })
    },
    // schema 切换
    schemaChange(e) {
      this.readerForm.tableSchema = e
      // 获取可用表
      this.getTables('rdbmsReader')
    },
    // reader 数据源切换
    rDsChange(e) {
      // 清空
      this.readerForm.tableName = ''
      this.readerForm.datasourceId = e
      this.rDsList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource
        }
      })
      Bus.dataSourceId = e
      this.$emit('selectDataSource', this.dataSource)
    },
    getTableColumns() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        tableName: this.readerForm.tableName
      }
      dsQueryApi.getColumns(obj).then(response => {
        this.rColumnList = response
        this.readerForm.columns = response
        this.readerForm.checkAll = true
        this.readerForm.isIndeterminate = false
      })
    },
    getColumnsByQuerySql() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        querySql: this.readerForm.querySql
      }
      dsQueryApi.getColumnsByQuerySql(obj).then(response => {
        this.rColumnList = response
        this.readerForm.columns = response
        this.readerForm.checkAll = true
        this.readerForm.isIndeterminate = false
      })
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        if (this.readerForm.querySql !== '') {
          this.getColumnsByQuerySql()
        } else {
          this.getTableColumns()
        }
      }
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t
      this.rColumnList = []
      this.readerForm.columns = []
      this.getColumns('reader')
    },
    rHandleCheckAllChange(val) {
      this.readerForm.columns = val ? this.rColumnList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.rColumnList.length
      this.readerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.rColumnList.length
    },
    getData() {
      if (Bus.dataSourceId) {
        this.readerForm.datasourceId = Bus.dataSourceId
      }
      return this.readerForm
    }
  }
}
</script>
