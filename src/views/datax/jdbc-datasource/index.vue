<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">
            普通数据源
          </div>
          <div class="right">
            <el-input
              v-model="listQuery.datasourceName"
              clearable
              placeholder="数据源名称"
              style="width: 268px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            >
              <el-button slot="append" v-waves style="margin: 0px;padding: 10px 0px;" class="filter-item" type="primary" @click="fetchData">搜索</el-button>
            </el-input>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="showAdd">
              添加
            </el-button>
            <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
              reviewer
            </el-checkbox> -->
          </div>
        </div>
      </el-card>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :header-cell-style="{background:'#FAFAFC'}"
      fit
      highlight-current-row
    >
      <!-- <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column> -->
      <el-table-column label="数据源" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.datasource }}</template>
      </el-table-column>
      <el-table-column label="数据源名称" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.datasourceName }}</template>
      </el-table-column>
      <el-table-column label="数据源分组" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.datasourceGroup }}
        </template>
      </el-table-column>
      <el-table-column label="jdbc连接串" width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.jdbcUrl ? scope.row.jdbcUrl:'-' }}</template>
      </el-table-column>
      <el-table-column label="ZK地址" width="200" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ scope.row.zkAdress ? scope.row.zkAdress:'-' }}</template>
      </el-table-column>
      <el-table-column label="数据库名" width="120" align="center" :show-overflow-tooltip="true">-->
        <template slot-scope="scope">{{ scope.row.database ? scope.row.database:'-' }}</template>-->
      </el-table-column>
      <el-table-column label="备注" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.comments }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <a style="color: #3D5FFF;margin: 0px 10px;" @click="handleUpdate(row)">编辑</a>
          <span style="width: 1px;height: 12px;background: #E6E6E8;display: inline-block;" />
          <a style="color: #FE4646;margin: 0px 10px;" @click="handleDelete(row)">删除</a>
          <span style="width: 1px;height: 12px;background: #E6E6E8;display: inline-block;" />
          <a style="color: #3D5FFF;margin: 0px 10px;" :disabled="gathering" @click="gatherMetadata(row)">元数据采集</a>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      style="float: right"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      layout="total, prev, pager, next, sizes"
      @pagination="fetchData"
    />
    <!-- 原添加编辑对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="数据源" prop="datasource">
          <el-select
            v-model="temp.datasource"
            placeholder="数据源"
            style="width: 200px"
            @change="selectDataSource(temp.datasource)"
          >
            <el-option v-for="item in dataSources" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数据源名称" prop="datasourceName">
          <el-input v-model="temp.datasourceName" placeholder="数据源名称" style="width: 40%" />
        </el-form-item>
        <el-form-item label="数据源分组" prop="datasourceGroup">
          <el-input v-model="temp.datasourceGroup" placeholder="数据源分组" style="width: 40%" />
        </el-form-item>
        <el-form-item v-if="jdbc" label="用户名">
          <el-input v-model="temp.userName" placeholder="用户名" style="width: 40%" />
        </el-form-item>
        <el-form-item v-if="visible" v-show="jdbc" label="密码">
          <el-input v-model="temp.password" type="password" placeholder="密码" style="width: 40%">
            <i slot="suffix" title="显示密码" style="cursor:pointer" class="el-icon-view" @click="changePass('show')" />
          </el-input>
        </el-form-item>
        <el-form-item v-show="jdbc" v-else label="密码">
          <el-input v-model="temp.password" type="text" placeholder="密码" style="width: 40%">
            <i slot="suffix" title="隐藏密码" style="cursor:pointer" class="el-icon-check" @click="changePass('hide')" />
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
        <el-form-item v-if="mongodb" label="数据库名称" prop="database">
          <el-input v-model="temp.database" placeholder="数据库名称" style="width: 60%" />
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
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button type="primary" @click="testDataSource()">
          测试连接
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPluginVisible" title="Reading statistics">
      <el-table :data="pluginData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- UI添加对话框 -->
    <el-dialog :visible.sync="dialogVisible">
      <div slot="title">
        <span>{{ diaTit }}</span>
      </div>
      <!-- 第一步选择连接类型 -->
      <el-tabs v-show="currentStep === 1" v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="所有类型" name="first">
          <ul>
            <li>
              <a>
                <img src="@/assets/松鼠png/athena_icon_big@2x.png" alt="">
                <p>Athena</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/azure_icon_big@2x.png" alt="">
                <p>Azure Sql server</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/dremio_icon_big@2x.png" alt="">
                <p>Dremio</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/db2_zos_icon_big@2x.png" alt="">
                <p>DB2</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/informix_icon_big@2x.png" alt="">
                <p>Informix</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/mysql_icon_big@2x.png" alt="">
                <p>Mysql</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/edb_icon_big@2x.png" alt="">
                <p>EDB</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="常用类型" name="second">
          <ul>
            <li>
              <a>
                <img src="@/assets/松鼠png/mysql_icon_big@2x.png" alt="">
                <p>Mysql</p>
              </a>
            </li>
            <li>
              <a>
                <img src="@/assets/松鼠png/edb_icon_big@2x.png" alt="">
                <p>EDB</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="SQL" name="third">
          <ul>
            <li>
              <a>
                <img src="@/assets/松鼠png/mysql_icon_big@2x.png" alt="">
                <p>Mysql</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="分析型" name="fourth">
          <ul>
            <li>
              <a>
                <img src="@/assets/松鼠png/athena_icon_big@2x.png" alt="">
                <p>Athena</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- 第二步表单 -->
      <el-form v-show="currentStep === 2" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="主机" prop="master">
          <el-input v-model="ruleForm.master" />
        </el-form-item>
        <el-form-item label="数据库架构" prop="sql">
          <el-input v-model="ruleForm.sql" />
        </el-form-item>
        <el-form-item label="认证" prop="authentication">
          <el-select v-model="ruleForm.authentication" placeholder="请选择">
            <el-option label="master" value="master" />
            <el-option label="master1" value="master1" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" />
        </el-form-item>
        <el-form-item label="驱动名称" prop="driver">
          <el-input v-model="ruleForm.driver" />
        </el-form-item>
        <el-form-item>
          <el-button>编辑驱动名称</el-button>
        </el-form-item>
      </el-form>
      <!-- 连接设置表单 -->
      <div v-show="currentStep === 3" class="set">
        <p>Server</p>
        <el-form :model="ServerForm" label-width="100px" class="bgcForm">
          <el-form-item label="服务器地址:" prop="master">
            <el-input v-model="ServerForm.serverUrl" />
          </el-form-item>
          <el-form-item label="端口:" prop="sql">
            <el-input v-model="ServerForm.port" />
          </el-form-item>
          <el-form-item label="数据库:" prop="username">
            <el-input v-model="ServerForm.sql" />
          </el-form-item>
        </el-form>
        <p>认证</p>
        <el-form :model="userForm" label-width="100px" class="bgcForm">
          <el-form-item label="用户名:">
            <el-input v-model="userForm.username" />
          </el-form-item>
          <el-form-item label="密码:">
            <el-input v-model="userForm.password" />
          </el-form-item>
        </el-form>
        <p>Advanced</p>
        <el-form :model="AdvancedForm" label-width="100px" class="bgcForm">
          <el-form-item label="服务器时区:">
            <el-input v-model="AdvancedForm.serverTime" />
          </el-form-item>
          <el-form-item label="本地客户端:">
            <el-input v-model="AdvancedForm.client" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="currentStep === 2" style="float: left;">测试连接...</el-button>
        <el-button :disabled="currentStep === 1" @click="lastStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
        <el-button @click="cancel">取 消</el-button>
        <el-button :disabled="currentStep === 3" @click="dialogVisible = false">完 成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as datasourceApi from '@/api/datax-jdbcDatasource'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import * as meta from '@/api/metadata-query'

export default {
  name: 'JdbcDatasource',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      gathering: false,
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        datasourceName: [{ required: true, message: 'this is required', trigger: 'blur' }],
        userName: [{ required: true, message: 'this is required', trigger: 'blur' }],
        password: [{ required: true, message: 'this is required', trigger: 'blur' }],
        jdbcUrl: [{ required: true, message: 'this is required', trigger: 'blur' }],
        datasource: [{ required: true, message: 'this is required', trigger: 'change' }],
        zkAdress: [{ required: true, message: 'this is required', trigger: 'blur' }],
        database: [{ required: true, message: 'this is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        userName: '',
        password: '',
        jdbcUrl: '',
        comments: '',
        datasource: '',
        zkAdress: '',
        database: ''
      },
      visible: true,
      dataSources: [
        { value: 'MYSQL', label: 'MYSQL' },
        { value: 'oracle', label: 'oracle' },
        { value: 'postgresql', label: 'postgresql' },
        { value: 'greenplum', label: 'greenplum' },
        { value: 'sqlserver', label: 'sqlserver' },
        { value: 'hive', label: 'hive' },
        { value: 'hbase', label: 'hbase' },
        { value: 'mongodb', label: 'mongodb' },
        { value: 'clickhouse', label: 'clickhouse' }
      ],
      jdbc: true,
      hbase: false,
      mongodb: false,
      dialogVisible: false,
      diaTit: '选中新连接类型',
      currentStep: 1,
      activeName: 'first',
      ruleForm: {},
      AdvancedForm: {},
      ServerForm: {},
      userForm: {},
      rules: {
        master: [
          { required: true, message: '请输入主机名称', trigger: 'blur' }
        ],
        authentication: [
          { required: true, message: '请选择认证', trigger: 'blur' }
        ],
        sql: [
          { required: true, message: '请输入数据库/架构名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        driver: [
          { required: true, message: '请输入驱动名称', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    currentStep: function(val) {
      if (val === 1) {
        console.log(val, this.diaTit)
        this.diaTit = '选中新连接类型'
      } else if (val === 2) {
        this.diaTit = '通用JDBC连接设置'
        console.log(val, this.diaTit)
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    gatherMetadata(row) {
      this.$confirm('即将开始元数据采集, 是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        const param = {}
        param.id = row.id
        console.log(param)
        meta.getDbMetadata(param).then(res => {
          console.log(res)
          this.gathering = false
          this.$message({
            type: 'success',
            message: '元数据采集成功'
          })
        })
        this.gathering = true
        this.$message({
          type: 'info',
          message: '采集任务开始!'
        });
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '已取消元数据采集'
        });
      });
    },
    selectDataSource(datasource) {
      if (datasource === 'MYSQL') {
        this.temp.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}'
      } else if (datasource === 'oracle') {
        this.temp.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}'
      } else if (datasource === 'postgresql') {
        this.temp.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'org.postgresql.Driver'
      } else if (datasource === 'greenplum') {
        this.temp.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}'
        this.temp.jdbcDriverClass = 'org.postgresql.Driver'
      } else if (datasource === 'sqlserver') {
        this.temp.jdbcUrl = 'jdbc:sqlserver://{host}:{port};DatabaseName={database}'
      } else if (datasource === 'clickhouse') {
        this.temp.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}'
      } else if (datasource === 'hive') {
        this.temp.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}'
        this.hbase = this.mongodb = false
        this.jdbc = true
      }
      this.getShowStrategy(datasource)
    },
    fetchData() {
      this.listLoading = true
      datasourceApi.list(this.listQuery).then(response => {
        const { records } = response
        const { total } = response
        this.total = total
        const bdsource = ['hive', 'impala', 'spark', 'flink']
        this.list = records.filter(function(e) {
          if (!bdsource.includes(e.datasource)) {
            return true
          }
        })
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        userName: '',
        password: '',
        jdbcUrl: '',
        jdbcDriverClass: '',
        comments: ''
      }
    },
    // 显示添加对话框
    showAdd() {
      this.dialogVisible = true
    },
    // tabs标签页方法
    handleClick(tab, event) {
      console.log(tab, event);
    },
    cancel() {
      this.dialogVisible = false
      this.currentStep = 1
      this.ruleForm = {}
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
      console.log(this.currentStep)
    },
    lastStep() {
      console.log(this.currentStep)
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.created(this.temp).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
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
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.test(this.temp).then(response => {
            if (response.data === false) {
              this.$notify({
                title: 'Fail',
                message: response.data.msg,
                type: 'fail',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Success',
                message: 'Tested Successfully',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.getShowStrategy(row.datasource)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          datasourceApi.updated(tempData).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
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
    handleDelete(row) {
      console.log('删除')
      const idList = []
      idList.push(row.id)
      // 拼成 idList=xx
      // 多个比较麻烦，这里不处理
      datasourceApi.deleted({ idList: row.id }).then(response => {
        this.fetchData()
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      // const index = this.list.indexOf(row)
    },
    handleFetchPv(id) {
      datasourceApi.fetched(id).then(response => {
        this.pluginData = response
        this.dialogPvVisible = true
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    changePass(value) {
      this.visible = !(value === 'show')
    }
  }
}
</script>

<style lang="scss">
.app-container {
  .filter-container {
    overflow: hidden;
    // line-height: 56px;
    background-color: #ffffff;
    padding: 0px;
    // border-radius: 5px 5px 0px 0px;
    // box-shadow:0 2px 12px 0 rgba(0,0,0,.3);
    .el-card {
      .left {
        float: left;
        width: 120px;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .right {
        float: right;
        margin-right: 20px;
        .el-input {
          overflow: hidden;
          .el-input__inner {
            float: left;
            width: 200px;
            height: 35px;
            line-height: 35px;
            padding-right: 15px;
          }
          .el-input-group__append {
            float: left;
            width: 60px;
            padding: 0px 15px;
            text-align: center;
            color: #fff;
            background-color: #409EFF;
          }
        }
      }
    }
  }
  .el-table {
    margin-top: 10px;
  }
  .pagination-container {
    background-color: #f5f6fa;
  }
  .el-dialog {
    .el-dialog__header {
      border-bottom: 1px solid #F3F3F3;
      padding-bottom: 20px;
      span {
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
      }
    }
    .el-tabs {
      .el-tab-pane {
        ul {
          overflow: hidden;
          li {
            list-style: none;
            width: 20%;
            float: left;
            a {
              text-align: center;
              img {
                margin-top: 10px;
                display: block;
                width: 80%;
              }
              p {
                font-size: 16px;
                margin-top: 20px;
              }
            }
          }
        }
      }
    }
    .set {
      p {
        font-size: 20px;
        margin: 20px 0px;
      }
      .bgcForm {
        background-color: #f5f6fa;
        padding: 20px;
      }
    }
    .el-dialog__footer {
      border-top: 1px solid #F3F3F3;
      padding: 20px;
    }
  }
}
</style>
