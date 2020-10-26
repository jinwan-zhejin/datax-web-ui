<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">
            计算数据源
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
              <el-button slot="append" v-waves style="margin: 0px;padding: 10px 0px;" class="filter-item" type="goon" @click="fetchData">搜索</el-button>
            </el-input>
            <el-button class="filter-item" style="margin-left: 10px;" type="goon" size="small" icon="el-icon-plus" @click="handleCreate">
              添加
            </el-button>
            <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
              reviewer
            </el-checkbox> -->
          </div>
        </div>
      </el-card>
    </div>
    <div class="main">
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
    </div>
    <!-- 原对话框 -->
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
        <el-button type="goon" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button type="goon" @click="testDataSource()">
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
        <el-button type="goon" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- UI添加对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="70%" top="51px">
      <div slot="title" class="add_dialog_title">
        <span v-show="currentStep === 2">{{ sqlName }}连接设置</span>
        <span v-show="currentStep === 1">选择新连接类型</span>
      </div>
      <!-- 第一步选择连接类型 -->
      <div v-show="currentStep === 1" class="topSelect">
        <!-- <span>选择数据源:</span><el-input v-model="sqlName" style="width: 80%;float: right;" disabled /> -->
        <el-input v-model="input3" placeholder="请输入内容" class="input-with-select">
          <el-button slot="append" style="margin: 0px;padding: 8.5px 0px;" size="small" @click="searchSQL">搜索</el-button>
        </el-input>
      </div>
      <el-tabs
        v-show="currentStep === 1"
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="所有类型" name="first">
          <ul>
            <li v-for="item in allType" :id="item.type + item.name" :key="item.name" @click="getInfo" @dblclick="dbClickNext">
              <a>
                <img :src="item.url" :alt="item.name">
                <p>{{ item.name }}</p>
              </a>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
      <!-- 第二步表单 -->
      <!-- Hive连接设置表单 -->
      <div v-show="isHive" class="set">
        <p>基本信息</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="数据源名称:">
              <el-input v-model="HiveForm.datasourceName" />
            </el-form-item>
            <el-form-item label="数据源分组:">
              <el-input v-model="HiveForm.datasourceGroup" />
            </el-form-item>
            <el-form-item label="备注:">
              <el-input v-model="HiveForm.comments" />
            </el-form-item>
          </el-form>
        </div>
        <p>一般</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="JDBC URL:">
              <el-input v-model="HiveForm.jdbcUrl" disabled />
            </el-form-item>
            <el-form-item label="主机:">
              <el-input v-model="HiveForm.master" />
            </el-form-item>
            <el-form-item label="端口:">
              <el-input v-model="HiveForm.serverPort" />
            </el-form-item>
            <el-form-item label="数据库:">
              <el-input v-model="HiveForm.database" />
            </el-form-item>
          </el-form>
        </div>
        <p>认证</p>
        <div class="bgcForm">
          <el-form :model="HiveForm" label-width="100px">
            <el-form-item label="用户名:">
              <el-input v-model="HiveForm.username" />
            </el-form-item>
            <el-form-item label="密码:">
              <el-input v-model="HiveForm.password" type="password" />
              <el-checkbox v-model="checked">在本地保存密码</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-show="currentStep === 2"
          style="float: left"
          size="small"
          @click="testLink"
        >测试连接...</el-button>
        <el-button
          v-show="currentStep === 2"
          size="small"
          @click="lastStep"
        >上一步</el-button>
        <el-button v-show="currentStep === 1" type="goon" size="small" @click="nextStep">下一步</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button
          :disabled="isAddBan"
          @click="addData"
        >完 成</el-button>
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
      checked: false, // 是否保存本地密码
      sqlName: '',
      isAddBan: true,
      HiveForm: {},
      roleList: [
        {
          value: '123',
          label: '管理员'
        }
      ],
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
        { value: 'hive', label: 'hive' },
        { value: 'impala', label: 'impala' },
        { value: 'spark', label: 'spark' },
        { value: 'flink', label: 'flink' }
      ],
      jdbc: true,
      hbase: false,
      mongodb: false,
      dialogVisible: false,
      currentStep: 1,
      activeName: 'first',
      ruleForm: {
        datasourceName: '',
        userName: '',
        password: '',
        jdbcUrl: '',
        comments: '',
        datasource: '',
        zkAdress: '',
        database: ''
      },
      AdvancedForm: {},
      ServerForm: {},
      userForm: {},
      params: {
        comments: '',
        datasource: '',
        datasourceGroup: '',
        datasourceName: '',
        jdbcDriverClass: '',
        jdbcUrl: '',
        password: '',
        userName: ''
      },
      allType: [
        {
          name: 'Hive',
          url: require('@/assets/dataSourceIcon/hive_icon_big@2x.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Spark',
          url: require('@/assets/dataSourceIcon/spark.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Impala',
          url: require('@/assets/dataSourceIcon/Impala.png'),
          selected: 0,
          type: 'all'
        },
        {
          name: 'Flink',
          url: require('@/assets/dataSourceIcon/Flink.png'),
          selected: 0,
          type: 'all'
        }
      ],
      tabType: '',
      input3: '',
      typeArr: []
    }
  },
  // 计算属性
  computed: {
    isHive() {
      return (
        this.currentStep === 2 &&
        (this.sqlName === 'Hive' || this.sqlName === 'HBase')
      )
    }
  },
  watch: {
    sqlName: function(val) {
      console.log(val);
      console.log(this.params, '----------');
      if (val === 'MYSQL') {
        this.params.jdbcUrl = 'jdbc:mysql://{host}:{port}/{database}';
        console.log(this.params.jdbcUrl);
      } else if (val === 'oracle') {
        this.params.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}/{database}';
      } else if (val === 'postgresql') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val === 'greenplum') {
        this.params.jdbcUrl = 'jdbc:postgresql://{host}:{port}/{database}';
        this.ruleForm.driver = 'org.postgresql.Driver';
      } else if (val === 'sqlserver') {
        this.params.jdbcUrl =
          'jdbc:sqlserver://{host}:{port};DatabaseName={database}';
      } else if (val === 'clickhouse') {
        this.params.jdbcUrl = 'jdbc:clickhouse://{host}:{port}/{database}';
      } else if (val === 'hive') {
        this.params.jdbcUrl = 'jdbc:hive2://{host}:{port}/{database}';
      }
    },
    'HiveForm.master': {
      handler(val) {
        if (val) {
          this.HiveForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + val
        } else {
          this.HiveForm.jdbcUrl = ''
        }
      },
      deep: true
    },
    'HiveForm.serverPort': {
      handler(val) {
        if (val && this.HiveForm.master) {
          if (this.HiveForm.jdbcUrl.split('//')[1].split(':')[1]) {
            this.HiveForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.HiveForm.jdbcUrl.split('//')[1].split(':')[0] + ':' + val
          } else {
            this.HiveForm.jdbcUrl = this.HiveForm.jdbcUrl + ':' + val
          }
        } else if (!val && this.HiveForm.master) {
          this.HiveForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.HiveForm.jdbcUrl.split('//')[1].split(':')[0]
        }
      },
      deep: true
    },
    'HiveForm.database': {
      handler(val) {
        if (val && this.HiveForm.master && this.HiveForm.serverPort) {
          if (this.HiveForm.jdbcUrl.split('//')[1].split(':')[1].split('/')) {
            this.HiveForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.HiveForm.jdbcUrl.split('//')[1].split(':')[0] + ':' + this.HiveForm.serverPort + '/' + val
          } else {
            this.HiveForm.jdbcUrl = this.HiveForm.jdbcUrl + ':' + val
          }
        } else if (!val && this.HiveForm.master && this.HiveForm.serverPort) {
          this.HiveForm.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '://' + this.HiveForm.master + ':' + this.HiveForm.serverPort
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 元数据采集
    gatherMetadata(row) {
      this.$confirm('即将开始元数据采集, 是否继续?', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row);
          const param = {};
          param.id = row.id;
          console.log(param);
          meta.getDbMetadata(param).then((res) => {
            console.log(res);
            this.gathering = false;
            this.$message({
              type: 'success',
              message: '元数据采集成功'
            });
          });
          this.gathering = true;
          this.$message({
            type: 'info',
            message: '采集任务开始!'
          });
        })
        .catch(() => {
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
    // 列表数据查询获取
    fetchData() {
      this.listLoading = true
      datasourceApi.list(this.listQuery).then(response => {
        console.log(response)
        const { records } = response
        const { total } = response
        this.total = total
        // let computeds = ['mysql', 'hive', 'impala', 'spark', 'flink']
        // this.list = records.filter(e => e.datasource in computeds)
        this.list = records.filter(e => (e.datasource === 'hive' || e.datasource === 'impala' || e.datasource === 'spark' || e.datasource === 'flink'))
        console.log(this.list)
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
    handleCreate() {
      this.dialogVisible = true;
    },
    searchSQL() {
      for (let i = 0; i < this.typeArr.length; i++) {
        console.log(this.typeArr[i].name.indexOf(this.input3))
        if (this.typeArr[i].name.toLowerCase().indexOf(this.input3.toLowerCase()) === 0) {
          document.getElementById(this.typeArr[i].type + this.typeArr[i].name).style.display = 'block'
        } else {
          document.getElementById(this.typeArr[i].type + this.typeArr[i].name).style.display = 'none'
        }
      }
    },
    // tabs标签页方法
    handleClick(tab, event) {
      console.log(tab.label);
      console.log(tab.index);
      if (tab.index === '0') {
        this.lastSelect = ''
        this.currentSelect = ''
        this.sqlName = ''
        for (let i = 0; i < this.allType.length; i++) {
          document.getElementById(this.allType[i].type + this.allType[i].name).style.backgroundColor = '#fff'
        }
        this.tabType = 'all'
        this.typeArr = this.iconTXT
      }
    },
    // 获取点击当前数据源名称方法
    getInfo(e) {
      this.sqlName = e.path[1].textContent.trim()
      console.log(this.sqlName)
      if (this.sqlName !== this.lastSelect) {
        this.currentSelect = this.sqlName
        if (this.lastSelect !== '') {
          document.getElementById(this.tabType + this.lastSelect).style.backgroundColor = '#fff'
          console.log(document.getElementById(this.tabType + this.lastSelect), '-------------')
        }
        document.getElementById(this.tabType + this.currentSelect).style.backgroundColor = '#C4CFFF'
        this.lastSelect = this.sqlName
      }
      console.log(this.sqlName)
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      this.currentStep = 1;
      console.log(this.currentStep, '1111111111111111111111');
      this.MySQLForm = {}
      this.OracleForm = {}
      this.MdbForm = {}
      this.sqlName = ''
      for (let i = 0; i < this.allType.length; i++) {
        document.getElementById(this.allType[i].type + this.allType[i].name).style.backgroundColor = '#fff'
      }
    },
    // 下一步
    nextStep() {
      if (this.currentStep < 2) {
        if (this.sqlName !== '') {
          this.currentStep++;
        } else {
          this.$message.warning('请选择数据源类型');
        }
      }
      console.log(this.currentStep);
    },
    // 上一步
    lastStep() {
      console.log(this.currentStep);
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    // 双击下一步
    dbClickNext() {
      // window.clearTimeout(time) // 首先清除计时器
      if (this.currentStep < 2) {
        if (this.sqlName !== '') {
          this.currentStep++
        } else {
          this.$message.warning('请选择数据源类型')
        }
      }
      console.log(this.currentStep)
      console.log('双击下一步')
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
    // 添加数据源
    addData() {
      const obj = {}
      if (this.sqlName === 'Hive') {
        obj.datasourceName = this.HiveForm.datasourceName;
        obj.datasource = this.sqlName.toLowerCase();
        obj.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '2://' + this.HiveForm.master + ':' + this.HiveForm.serverPort + '/' + this.HiveForm.database;
        obj.userName = this.HiveForm.username;
        obj.password = this.HiveForm.password;
        obj.datasourceGroup = this.HiveForm.datasourceGroup;
        obj.comments = this.HiveForm.comments;
        obj.jdbcDriverClass = 'org.apache.hive.jdbc.HiveDriver';
      }
      datasourceApi.created(obj).then(() => {
        this.fetchData();
        this.dialogVisible = false;
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        });
      });
    },
    // 测试连接
    testLink() {
      const test = {}
      if (this.sqlName === 'Hive') {
        test.datasourceName = this.HiveForm.datasourceName;
        test.datasource = this.sqlName.toLowerCase();
        test.jdbcUrl = 'jdbc:' + this.sqlName.toLowerCase() + '2://' + this.HiveForm.master + ':' + this.HiveForm.serverPort + '/' + this.HiveForm.database;
        test.jdbcUsername = this.HiveForm.username;
        test.jdbcPassword = this.HiveForm.password;
        test.datasourceGroup = this.HiveForm.datasourceGroup;
        test.comments = this.HiveForm.comments;
        test.jdbcDriverClass = 'org.apache.hive.jdbc.HiveDriver';
      }
      datasourceApi.test(test).then(response => {
        if (response.data === false) {
          this.$notify({
            title: '失败',
            message: response.data.msg,
            type: 'fail',
            duration: 2000
          })
        } else {
          this.isAddBan = false
          this.$notify({
            title: '成功',
            message: '测试连接成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 编辑测试连接
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          datasourceApi.test(this.temp).then(response => {
            if (response.data === false) {
              this.$notify({
                title: '失败',
                message: response.data.msg,
                type: 'fail',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '成功',
                message: '测试连接成功',
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
              title: '成功',
              message: '编辑数据成功',
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
          title: '成功',
          message: '删除成功',
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
.add_dialog_title {
  font-size: 24px !important;
  font-family: PingFangHK-Medium, PingFangHK !important;
}
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
            background-color: #3D5FFF;
          }
        }
      }
    }
  }
  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 20px;
  }

  .el-tabs {
    margin-top: 20px;
    .el-tab-pane {
      ul {
        overflow: hidden;
        li {
          list-style: none;
          float: left;
          width: 12.5%;
          a {
            text-align: center;
            img {
              display: block;
              margin: 0 auto;
              margin-top: 10px;
              width: 64px;
            }
            p {
              height: 40px;
              font-size: 14px;
              font-family: PingFangHK-Regular, PingFangHK;
              font-weight: 400;
              color: #333333;
              line-height: 20px;
              margin-top: 10px;
            }
          }
          p {
            font-size: 16px;
            margin-top: 20px;
          }
        }
        li:hover {
          background-color: #e9e9f5 !important;
        }
        li:active {
          background-color: #C4CFFF;
        }
        li:visited {
          background-color: #C4CFFF;
        }
      }
    }
  }

  .topSelect {
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    .el-input {
      .el-input__inner {
        height: 32px;
      }
      .el-button {
        .el-button--default {
          color: #ffffff;
        }
      }
    }
  }
  .set {
    p {
      font-size: 18px;
      margin: 20px 0px 16px 0;
      font-family: PingFangHK-Medium, PingFangHK;
    }
    .bgcForm {
      background-color: #f5f6fa;
      padding: 24px 16px;
      overflow: hidden;
    }
  }

  .el-dialog__header {
    font-size: 24px;
    .p_tit {
      font-size: 16px;
      color: #cccccc;
      margin-top: 20px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
    .bgcForm {
      .el-form {
        overflow: hidden;
        border-radius: 6px;
        width: 60%;
        margin: 0px auto;
      }
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #f3f3f3;
    padding: 20px;
  }
}
</style>
