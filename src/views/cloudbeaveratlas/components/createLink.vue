<!--
 * @Date: 2020-09-24 15:33:23
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-28 10:56:10
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\createLink.vue
 * @Description: 子组件
-->

<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="openWin" width="800px" :show-close="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="数据源" prop="datasource">
          <el-select
            v-model="temp.datasource"
            placeholder="数据源"
            style="width: 200px"
            @change="selectDataSource(temp.datasource)"
          >
            <el-option
              v-for="item in dataSources"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源名称" prop="datasourceName">
          <el-input v-model="temp.datasourceName" placeholder="数据源名称" style="width: 40%" />
        </el-form-item>
        <el-form-item label="数据源分组" prop="datasourceGroup">
          <el-input v-model="temp.datasourceGroup" placeholder="数据源分组" style="width: 40%" />
        </el-form-item>
        <el-form-item v-if="jdbc" label="用户名">
          <el-input v-model="temp.jdbcUsername" placeholder="用户名" style="width: 40%" />
        </el-form-item>
        <el-form-item v-if="visible" v-show="jdbc" label="密码">
          <el-input v-model="temp.jdbcPassword" type="password" placeholder="密码" style="width: 40%">
            <i
              slot="suffix"
              title="显示密码"
              style="cursor:pointer"
              class="el-icon-view"
              @click="changePass('show')"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-show="jdbc" v-else label="密码">
          <el-input v-model="temp.jdbcPassword" type="text" placeholder="密码" style="width: 40%">
            <i
              slot="suffix"
              title="隐藏密码"
              style="cursor:pointer"
              class="el-icon-check"
              @click="changePass('hide')"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-if="jdbc" label="jdbc url" prop="jdbcUrl">
          <el-input
            v-model="temp.jdbcUrl"
            :autosize="{ minRows: 3, maxRows: 6}"
            type="textarea"
            placeholder="jdbc url"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="mongodb" label="地址" prop="jdbcUrl">
          <el-input
            v-model="temp.jdbcUrl"
            :autosize="{ minRows: 3, maxRows: 6}"
            type="textarea"
            placeholder="127.0.0.1:27017"
            style="width: 60%"
          />
        </el-form-item>
        <el-form-item v-if="jdbc" label="jdbc驱动类" prop="jdbcDriverClass">
          <el-input v-model="temp.jdbcDriverClass" placeholder="jdbc驱动类" style="width: 60%" />
        </el-form-item>
        <el-form-item v-if="hbase" label="ZK地址" prop="zkAdress">
          <el-input v-model="temp.zkAdress" placeholder="127.0.0.1:2181" style="width: 60%" />
        </el-form-item>
        <el-form-item v-if="mongodb" label="数据库名称" prop="databaseName">
          <el-input v-model="temp.databaseName" placeholder="数据库名称" style="width: 60%" />
        </el-form-item>
        <el-form-item label="注释">
          <el-input
            v-model="temp.comments"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Please input"
            style="width: 60%"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWin()">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button type="primary" @click="testDataSource()">测试连接</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import * as datasourceApi from '@/api/datax-jdbcDatasource'

export default {
  name: 'CreateNewLink',
  props: ['openWin'],
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      pluginTypeOptions: ['reader', 'writer'],
      dialogPluginVisible: false,
      pluginData: [],
      dialogStatus: 'create',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        datasourceName: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        jdbcUsername: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        jdbcPassword: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        jdbcUrl: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        jdbcDriverClass: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        datasource: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        zkAdress: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ],
        databaseName: [
          { required: true, message: 'this is required', trigger: 'blur' }
        ]
      },
      temp: {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        jdbcUsername: '',
        jdbcPassword: '',
        jdbcUrl: '',
        jdbcDriverClass: '',
        comments: '',
        datasource: '',
        zkAdress: '',
        databaseName: ''
      },
      visible: true,
      dataSources: [
        { value: 'mysql', label: 'mysql' },
        { value: 'oracle', label: 'oracle' },
        { value: 'postgresql', label: 'postgresql' },
        { value: 'sqlserver', label: 'sqlserver' },
        { value: 'hive', label: 'hive' },
        { value: 'hbase', label: 'hbase' },
        { value: 'mongodb', label: 'mongodb' },
        { value: 'clickhouse', label: 'clickhouse' }
      ],
      jdbc: true,
      hbase: false,
      mongodb: false
    };
  },
  methods: {
    // 测试连接
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.test(this.temp).then((response) => {
            if (response.data === false) {
              this.$notify({
                title: 'Fail',
                message: response.data.msg,
                type: 'fail',
                duration: 2000
              });
            } else {
              this.$notify({
                title: 'Success',
                message: 'Tested Successfully',
                type: 'success',
                duration: 2000
              });
            }
          });
        }
      });
    },
    // 新建连接
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.created(this.temp).then(() => {
            this.fetchData()
            this.closeWin()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      datasourceApi.list(this.listQuery).then(response => {
        const { records } = response
        const { total } = response
        this.total = total
        this.list = records
        this.listLoading = false
      })
    },
    selectDataSource(datasource) {
      if (datasource === 'mysql') {
        this.temp.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'com.mysql.jdbc.Driver'
      } else if (datasource === 'oracle') {
        this.temp.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'oracle.jdbc.OracleDriver'
      } else if (datasource === 'postgresql') {
        this.temp.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'org.postgresql.Driver'
      } else if (datasource === 'sqlserver') {
        this.temp.jdbcUrl = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}'
        this.temp.jdbcDriverClass = 'com.microsoft.sqlserver.jdbc.SQLServerDriver'
      } else if (datasource === 'clickhouse') {
        this.temp.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'ru.yandex.clickhouse.ClickHouseDriver'
      } else if (datasource === 'hive') {
        this.temp.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'org.apache.hive.jdbc.HiveDriver'
        this.hbase = this.mongodb = false
        this.jdbc = true
      }
      this.getShowStrategy(datasource)
    },
    getShowStrategy(datasource) {
      if (datasource === 'hbase') {
        this.jdbc = this.mongodb = false
        this.hbase = true
      } else if (datasource === 'mongodb') {
        this.jdbc = this.hbase = false
        this.mongodb = true
        this.temp.jdbcUrl = 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]'
      } else {
        this.hbase = this.mongodb = false
        this.jdbc = true
      }
    },
    // 关闭窗口
    closeWin() {
      this.$emit('close')
    }
  }

};
</script>
<style scoped>
</style>
