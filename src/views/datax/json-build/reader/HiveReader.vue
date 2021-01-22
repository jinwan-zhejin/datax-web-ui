<template>
  <div>
    <el-form label-position="left" label-width="120px" :model="readerForm" :rules="rules" :class="[$store.state.taskAdmin.readerAllowEdit?'':'form-label-class']">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据源：" prop="datasourceId">
            <el-select v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.datasourceId" filterable @change="rDsChange">
              <!-- <el-option
                v-for="item in rDsList"
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
            <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(finder(readerForm.datasourceId, dataSourceCompute, 'id', 'datasourceName')) }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表：" prop="tableName">
            <el-select v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.tableName" filterable @change="rTbChange">
              <el-option v-for="item in rTbList" :key="item" :label="item" :value="item" />
            </el-select>
            <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(readerForm.tableName) }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="path：" prop="path">
        <el-input v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.path" :autosize="{ minRows: 2, maxRows: 20}" type="textarea" placeholder="要读取的文件路径，如果要读取多个文件，可以使用正则表达式'*'" />
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(readerForm.path) }}</span>
      </el-form-item>
      <el-form-item label="defaultFS：" prop="defaultFS">
        <el-input v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.defaultFS" placeholder="Hadoop hdfs文件系统namenode节点地址" />
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(readerForm.defaultFS) }}</span>
      </el-form-item>
      <el-form-item label="fileType：" prop="fileType">
        <el-select v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.fileType" placeholder="文件的类型">
          <el-option v-for="item in fileTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(finder(readerForm.fileType, fileTypes, 'value', 'label')) }}</span>
      </el-form-item>
      <el-form-item label="fieldDelimiter：" prop="fieldDelimiter">
        <el-input v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.fieldDelimiter" placeholder="读取的字段分隔符" />
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(readerForm.fieldDelimiter) }}</span>
      </el-form-item>
      <el-form-item label="skipHeader：">
        <el-select v-show="$store.state.taskAdmin.readerAllowEdit" v-model="readerForm.skipHeader" placeholder="是否跳过表头">
          <el-option v-for="item in skipHeaderTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-show="!$store.state.taskAdmin.readerAllowEdit">{{ dashOrValue(finder(readerForm.skipHeader, skipHeaderTypes, 'value', 'label')) }}</span>
      </el-form-item>
      <el-form-item label="字段：">
        <el-checkbox
          v-model="readerForm.checkAll"
          :disabled="!$store.state.taskAdmin.readerAllowEdit"
          :indeterminate="readerForm.isIndeterminate"
          @change="rHandleCheckAllChange"
        >全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="readerForm.columns" :disabled="!$store.state.taskAdmin.readerAllowEdit" @change="rHandleCheckedChange">
          <el-checkbox v-for="c in rColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import Bus from '../busReader'
import { finder, dashOrValue } from '../private'

export default {
  name: 'HiveReader',
  data() {
    return {
      jdbcDsQuery: {
        current: 1,
        size: 200
      },
      rDsList: [],
      rTbList: [],
      rColumnList: [],
      loading: false,
      active: 1,
      customFields: '',
      customType: '',
      customValue: '',
      dataSource: '',
      readerForm: {
        datasourceId: '',
        tableName: '',
        columns: [],
        checkAll: false,
        isIndeterminate: true,
        path: '',
        defaultFS: '',
        fileType: '',
        fieldDelimiter: '',
        skipHeader: ''
      },
      rules: {
        path: [{ required: true, message: 'this is required', trigger: 'blur' }],
        defaultFS: [{ required: true, message: 'this is required', trigger: 'blur' }],
        fileType: [{ required: true, message: 'this is required', trigger: 'change' }],
        datasourceId: [{ required: true, message: 'this is required', trigger: 'blur' }],
        tableName: [{ required: true, message: 'this is required', trigger: 'blur' }]
      },
      fileTypes: [
        { value: 'text', label: 'text' },
        { value: 'orc', label: 'orc' },
        { value: 'rc', label: 'rc' },
        { value: 'seq', label: 'seq' },
        { value: 'csv', label: 'csv' }
      ],
      skipHeaderTypes: [
        { value: 'true', label: '读取跳过表头' },
        { value: 'false', label: '读取包含表头' }
      ]
    }
  },
  computed: {
    dataSourceCompute() {
      if (this.$store.state.taskAdmin.tabType === 'NORMAL') {
        return this.rDsList
      } else if (this.$store.state.taskAdmin.tabType === 'IMPORT') {
        return this.rDsList.filter(item => {
          return item.datasource !== 'impala' && item.datasource !== 'hive'
        })
      } else {
        return this.rDsList.filter(item => {
          return item.datasource === 'impala' || item.datasource === 'hive'
        })
      }
    }
  },
  watch: {
    'readerForm.datasourceId': function(oldVal, newVal) {
      this.getTables('hiveReader')
    }
  },
  created() {
    this.getJdbcDs()
  },
  methods: {
    // 获取可用数据源
    getJdbcDs(type) {
      this.loading = true
      this.jdbcDsQuery.projectId = this.$store.state.taskAdmin.projectId

      jdbcDsList(this.jdbcDsQuery).then(response => {
        const { records } = response
        this.rDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables(type) {
      if (type === 'hiveReader') {
        const obj = {
          datasourceId: this.readerForm.datasourceId
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.rTbList = response
        })
      }
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
      // 获取可用表
      this.getTables('reader')
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
        this.$store.commit('SET_READER_COLUMNS', response);
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
        this.getTableColumns()
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
    },
    finder(item, sets, attr, distAttr) {
      return finder(item, sets, attr, distAttr)
    },
    dashOrValue(val) {
      return dashOrValue(val)
    }
  }
}
</script>
<style scoped>
.app-container{
  padding: 0;
}
</style>
<style lang="scss" scoped>
.form-label-class {
  >>>.el-form-item__label {
    font-weight: 500;
    color: #999999;
    font-family: PingFangHK-Regular, PingFangHK;
  }
}
</style>
