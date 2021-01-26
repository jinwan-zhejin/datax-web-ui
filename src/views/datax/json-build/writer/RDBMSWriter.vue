<template>
  <div>
    <el-form
      label-position="top"
      label-width="120px"
      :model="writerForm"
      :rules="rules"
      class="form-label-class"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据源" prop="datasourceId">
            <el-select
              v-model="datasourceId"
              filterable
              @change="wDsChange"
            >
              <!-- <el-option
                v-for="item in wDsList"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              /> -->
              <el-option
                v-for="item in dataSourceCompute"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="dataSource==='postgresql' || dataSource==='greenplum' || dataSource==='oracle' ||dataSource==='sqlserver'" label="Schema：" prop="tableSchema">
            <el-select v-model="writerForm.tableSchema" allow-create default-first-option filterable @change="schemaChange">
              <el-option
                v-for="item in schemaList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据库表名" prop="tableName">
            <el-select
              v-model="fromTableName"
              allow-create
              default-first-option
              filterable
              :disabled="writerForm.ifCreateTable"
              @change="wTbChange"
            >
              <el-option
                v-for="item in wTbList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-input v-show="writerForm.ifCreateTable" v-model="writerForm.tableName" style="width: 200px;" :placeholder="readerForm.tableName" />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="字段">
            <el-checkbox v-model="writerForm.checkAll" :indeterminate="writerForm.isIndeterminate" @change="wHandleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;" />
            <el-checkbox-group v-model="writerForm.columns" @change="wHandleCheckedChange">
              <el-checkbox v-for="c in fromColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="$store.state.taskAdmin.tabType !== 'IMPORT'">
          <el-form-item label="前置SQL">
            <el-input v-model="writerForm.preSql" placeholder="前置SQL在insert之前执行" />
          </el-form-item>
        </el-col>
        <el-col v-if="$store.state.taskAdmin.tabType !== 'IMPORT'">
          <el-form-item label="后置SQL">
            <el-input v-model="writerForm.postSql" placeholder="多个SQL用;分隔" />
          </el-form-item>
        </el-col>
        <el-col v-if="$store.state.taskAdmin.tabType === 'IMPORT'">
          <el-form-item label="新增分区">
            <el-radio-group v-model="writerForm.partition">
              <el-radio :label="0">分区</el-radio>
              <el-radio :label="1">非分区</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="$store.state.taskAdmin.tabType === 'IMPORT' && writerForm.partition === 0">
          <el-form-item label="分区字段">
            <el-select v-model="writerForm.partitionText" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import Bus from '../busWriter'
export default {
  name: 'RDBMSWriter',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 200,
        ascs: 'datasource_name',
        projectId: ''
      },
      datasourceId: '',
      wDsList: [],
      schemaList: [],
      fromTableName: '',
      fromColumnList: [],
      wTbList: [],
      dataSource: '',
      createTableName: '',
      writerForm: {
        datasourceId: undefined,
        tableName: '',
        columns: [],
        checkAll: false,
        isIndeterminate: true,
        preSql: '',
        postSql: '',
        ifCreateTable: false,
        tableSchema: ''
      },
      readerForm: {},
      rules: {
        datasourceId: [{ required: true, message: 'this is required', trigger: 'change' }],
        tableName: [{ required: true, message: 'this is required', trigger: 'change' }],
        tableSchema: [{ required: true, message: 'this is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    dataSourceCompute() {
      if (this.$store.state.taskAdmin.tabType === 'NORMAL') {
        return this.wDsList
      } else if (this.$store.state.taskAdmin.tabType === 'EXPORT') {
        return this.wDsList.filter(item => {
          return item.datasource !== 'impala' && item.datasource !== 'hive'
        })
      } else {
        return this.wDsList.filter(item => {
          return item.datasource === 'impala' || item.datasource === 'hive'
        })
      }
    }
  },
  watch: {
    'writerForm.datasourceId': function(oldVal, newVal) {
      if (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') {
        this.getSchema()
      }
      this.getTables('rdbmsWriter')
    },
    'writerForm.columns'(val) {
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.writerForm.columns);
    }
  },
  created() {
    this.getJdbcDs()
    this.readerForm = this.$parent.getReaderData();
  },
  methods: {
    // 获取可用数据源
    getJdbcDs() {
      this.loading = true
      this.jdbcDsQuery.projectId = this.$store.state.taskAdmin.projectId
      jdbcDsList(this.jdbcDsQuery).then(response => {
        const { records } = response
        this.wDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsWriter') {
        let obj = {}
        if (this.dataSource === 'postgresql' || this.dataSource === 'greenplum' || this.dataSource === 'oracle' || this.dataSource === 'sqlserver') {
          obj = {
            datasourceId: this.writerForm.datasourceId,
            tableSchema: this.writerForm.tableSchema
          }
        } else {
          obj = {
            datasourceId: this.writerForm.datasourceId
          }
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.wTbList = response
        })
      }
    },
    getSchema() {
      const obj = {
        datasourceId: this.writerForm.datasourceId
      }
      dsQueryApi.getTableSchema(obj).then(response => {
        this.schemaList = response
      })
    },
    // schema 切换
    schemaChange(e) {
      this.writerForm.tableSchema = e
      // 获取可用表
      this.getTables('rdbmsWriter')
    },
    wDsChange(e) {
      this.datasourceId = e;
      this.$store.commit('SET_WRITER_DATASOURCE_ID', e)
      // 清空
      this.writerForm.tableName = ''
      this.writerForm.datasourceId = e
      this.wDsList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource
        }
      })
      Bus.dataSourceId = e
      this.$emit('selectDataSource', this.dataSource)
    },
    // 获取表字段
    getColumns() {
      const obj = {
        datasourceId: this.writerForm.datasourceId,
        tableName: this.writerForm.tableName
      }
      dsQueryApi.getColumns(obj).then(response => {
        this.fromColumnList = response
        this.writerForm.columns = response
        this.writerForm.checkAll = true
        this.writerForm.isIndeterminate = false
      })
    },
    // 表切换
    wTbChange(t) {
      this.writerForm.tableName = t
      this.fromColumnList = []
      this.writerForm.columns = []
      this.getColumns('writer')
      this.$store.commit('SET_WRITER_TABLENAME', t)
    },
    wHandleCheckAllChange(val) {
      this.writerForm.columns = val ? this.fromColumnList : []
      this.writerForm.isIndeterminate = false
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.writerForm.columns);
    },
    wHandleCheckedChange(value) {
      const checkedCount = value.length
      this.writerForm.checkAll = checkedCount === this.fromColumnList.length
      this.writerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.fromColumnList.length
      this.$store.commit('SET_SELECT_WRITERCOLUMN', value);
    },
    getData() {
      if (Bus.dataSourceId) {
        this.writerForm.datasourceId = Bus.dataSourceId
      }
      return this.writerForm
    },
    getReaderData() {
      return this.$parent.getReaderData()
    },
    getTableName() {
      return this.fromTableName
    },
    createTable() {
      const obj = {
        datasourceId: this.writerForm.datasourceId,
        tableName: this.createTableName
      }
      dsQueryApi.createTable(obj).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Create Table Successfully',
          type: 'success',
          duration: 2000
        })
      }).catch(() => console.log('promise catch err'))
    }
  }
}
</script>
<style lang="scss" scoped>
.form-label-class {
  >>> .el-form-item__label {
    font-family: PingFangHK-Regular, PingFangHK;
  }
}
.el-form {
  background: white;
  padding: 20px;
}
</style>
