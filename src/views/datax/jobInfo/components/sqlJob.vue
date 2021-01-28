<template>
  <div class="app-container">
    <h1
      style="font-size: 21px;
    font-weight: 700;
    margin-right: 10px;"
    >添加 SQL任务</h1>
    <div class="main-content">

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="110px"
        class="input_from"
      >

        <el-form-item label="任务名称：" prop="jobDesc">
          <el-input
            v-model="temp.jobDesc"
            size="medium"
            placeholder="请输入任务描述"
          />
        </el-form-item>
        <el-form-item label="任务类型：" prop="glueType">
          {{ this.jobTypeLabel }}
        </el-form-item>
        <el-form-item label="执行器：" prop="jobGroup">
          <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
            <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-dialog
          title="提示"
          :visible.sync="showCronBox"
          width="60%"
          append-to-body
          class="cron_window"
        >
          <cron v-model="temp.jobCron" />
          <span slot="footer" class="dialog-footer">
            <el-button @click="showCronBox = false">关闭</el-button>
            <el-button
              type="primary"
              @click="showCronBox = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-form-item label="Cron：" prop="jobCron">
          <el-input
            v-model="temp.jobCron"
            auto-complete="off"
            placeholder="请输入Cron表达式"
          >
            <el-button
              v-if="!showCronBox"
              slot="append"
              icon="el-icon-turn-off"
              title="打开图形配置"
              @click="showCronBox = true"
            />
            <el-button
              v-else
              slot="append"
              icon="el-icon-open"
              title="关闭图形配置"
              @click="showCronBox = false"
            />
          </el-input>
        </el-form-item>

        <el-form-item label="数据源连接：" prop="datasourceId">
          <el-select v-model="temp.datasourceId" placeholder="请选择数据源连接">
            <el-option
              v-for="item in blockStrategies"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Schema：">
          <el-select v-model="temp.schema" placeholder="请选择schema">
            <el-option
              v-for="item in schemaList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="报警邮件：">
          <el-input
            v-model="temp.alarmEmail"
            placeholder="请输入报警邮件，多个用逗号分隔"
          />
        </el-form-item>

        <el-form-item label="失败重试次数：">
          <el-input-number
            v-model="temp.executorFailRetryCount"
            size="small"
            :min="0"
            :max="20"
          />
        </el-form-item>

        <el-form-item label="子任务：">
          <el-select
            v-model="temp.childJobId"
            multiple
            placeholder="子任务"
            value-key="id"
          >
            <el-option
              v-for="item in jobIdList"
              :key="item.id"
              :label="item.jobDesc"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="SQL脚本：">
          <el-radio v-model="radio" label="1">数据开发保存任务</el-radio>
          <el-radio v-model="radio" label="2">本地导入</el-radio>
          <el-radio v-model="radio" label="3">自定义</el-radio>
        </el-form-item>
        <el-form-item>
          <el-select
            v-if="radio === '1'"
            v-model="temp.SQLScript"
            placeholder="选择SQL脚本"
          >
            <el-option
              v-for="item in timeFormatTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-upload
            v-if="radio === '2'"
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="successFile"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <div class="scriptJson">
            <textarea
              ref="mycode"
              v-model="jsonContent"
              class="codesql"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="from_btn">
      <el-button size="small" @click="dialogFormVisible = false"> 取消 </el-button>
      <el-button size="small" type="primary" @click="createData()"> 确定 </el-button>
    </div>
  </div>
</template>

<script>
import * as executor from '@/api/datax-executor';
import * as job from '@/api/datax-job-info';
import waves from '@/directive/waves'; // waves directive
import Cron from '@/components/Cron';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import * as jobProjectApi from '@/api/datax-job-project';
import { isJSON } from '@/utils/validate';
import { getTableSchema } from '@/api/metadata-query';

import 'codemirror/theme/ambiance.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';

const CodeMirror = require('codemirror/lib/codemirror');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/sql/sql');
require('codemirror/addon/hint/show-hint');
require('codemirror/addon/hint/sql-hint');

export default {
  name: 'SqlJob',
  components: {
    Pagination,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Cron
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  props: ['jobType', 'jobTypeLabel'],
  data() {
    const validateIncParam = (rule, value, callback) => {
      if (!value) {
        callback(new Error('Increment parameters is required'));
      }
      callback();
    };
    const validatePartitionParam = (rule, value, callback) => {
      if (!this.partitionField) {
        callback(new Error('Partition parameters is required'));
      }
      callback();
    };
    return {
      firstTime: true,
      schemaList: [],
      jsonContent: '',
      fileList: [],
      radio: '1',
      projectIds: '',
      list: null,
      listLoading: true,
      total: 0,
      // jobTypeLabel: '',
      listQuery: {
        current: 1,
        size: 10000,
        jobGroup: 0,
        projectIds: '',
        triggerStatus: -1,
        jobDesc: '',
        glueType: ''
      },
      showCronBox: false,
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: true,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        jobGroup: [
          {
            required: true,
            message: 'jobGroup is required',
            trigger: 'change'
          }
        ],
        executorRouteStrategy: [
          {
            required: true,
            message: 'executorRouteStrategy is required',
            trigger: 'change'
          }
        ],
        executorBlockStrategy: [
          {
            required: true,
            message: 'executorBlockStrategy is required',
            trigger: 'change'
          }
        ],
        glueType: [
          { required: true, message: 'jobType is required', trigger: 'change' }
        ],
        projectId: [
          {
            required: true,
            message: 'projectId is required',
            trigger: 'change'
          }
        ],
        jobDesc: [
          { required: true, message: 'jobDesc is required', trigger: 'blur' }
        ],
        jobProject: [
          {
            required: true,
            message: 'jobProject is required',
            trigger: 'blur'
          }
        ],
        jobCron: [
          { required: true, message: 'jobCron is required', trigger: 'blur' }
        ],
        incStartId: [{ trigger: 'blur', validator: validateIncParam }],
        replaceParam: [{ trigger: 'blur', validator: validateIncParam }],
        primaryKey: [{ trigger: 'blur', validator: validateIncParam }],
        incStartTime: [{ trigger: 'change', validator: validateIncParam }],
        replaceParamType: [{ trigger: 'change', validator: validateIncParam }],
        partitionField: [
          { trigger: 'blur', validator: validatePartitionParam }
        ],
        datasourceId: [{ trigger: 'change', validator: validateIncParam }],
        readerTable: [{ trigger: 'blur', validator: validateIncParam }]
      },
      temp: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        executorRouteStrategy: 'FIRST',
        executorBlockStrategy: 'SERIAL_EXECUTION',
        childJobId: '',
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: 'sqlJobHandler',
        glueType: 'BEAN',
        glueSource: '',
        jobJson: '',
        executorParam: '',
        replaceParam: '',
        replaceParamType: 'Timestamp',
        jvmParam: '',
        incStartTime: '',
        partitionInfo: '',
        incrementType: 0,
        incStartId: '',
        primaryKey: '',
        projectId: '',
        datasourceId: '',
        readerTable: ''
      },
      resetTemp() {
        this.temp = this.$options.data().temp;
        this.jobJson = '';
        this.glueSource = '';
        this.timeOffset = 0;
        this.timeFormatType = 'yyyy-MM-dd';
        this.partitionField = '';
      },
      executorList: '',
      jobIdList: '',
      jobProjectList: '',
      dataSourceList: '',
      blockStrategies: [],
      routeStrategies: [
        { value: 'FIRST', label: '第一个' },
        { value: 'LAST', label: '最后一个' },
        { value: 'ROUND', label: '轮询' },
        { value: 'RANDOM', label: '随机' },
        { value: 'CONSISTENT_HASH', label: '一致性HASH' },
        { value: 'LEAST_FREQUENTLY_USED', label: '最不经常使用' },
        { value: 'LEAST_RECENTLY_USED', label: '最近最久未使用' },
        { value: 'FAILOVER', label: '故障转移' },
        { value: 'BUSYOVER', label: '忙碌转移' }
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      glueTypes: [
        // { value: 'BEAN', label: 'DataX任务' },
        { value: 'GLUE_SHELL', label: 'Shell任务' }
        // { value: 'GLUE_PYTHON', label: 'Python任务' },
        // { value: 'GLUE_POWERSHELL', label: 'PowerShell任务' }
      ],
      incrementTypes: [
        { value: 0, label: '无' },
        { value: 1, label: '主键自增' },
        { value: 2, label: '时间自增' },
        { value: 3, label: 'HIVE分区' }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      glueSource: '',
      timeOffset: 0,
      timeFormatType: 'yyyy-MM-dd',
      partitionField: '',
      timeFormatTypes: [
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'yyyyMMdd', label: 'yyyyMMdd' },
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' }
      ],
      replaceFormatTypes: [
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'HH:mm:ss', label: 'HH:mm:ss' },
        { value: 'yyyy/MM/dd HH:mm:ss', label: 'yyyy/MM/dd HH:mm:ss' },
        { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss' },
        { value: 'Timestamp', label: '时间戳' }
      ],
      statusList: [
        { value: 500, label: '失败' },
        { value: 502, label: '失败(超时)' },
        { value: 200, label: '成功' },
        { value: 0, label: '无' }
      ]
    };
  },

  computed: {
    datasourceIdSchema() {
      return this.temp.datasourceId;
    }
  },

  watch: {
    datasourceIdSchema() {
      this.getSchemaList();
    }
  },
  created() {
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList(),
    this.fetchSourceData();
  },

  mounted() {
    this.mountCodeMirror();
  },

  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getExecutor() {
      job.getExecutorList().then((response) => {
        const { content } = response;
        this.executorList = content;
      });
    },
    getJobIdList() {
      job.getJobIdList().then((response) => {
        const { content } = response;
        this.jobIdList = content;
      });
    },
    getJobProject() {
      jobProjectApi.getJobProjectList().then((response) => {
        this.jobProjectList = response;
      });
    },
    getDataSourceList() {
      datasourceApi.getDataSourceList().then((response) => {
        this.dataSourceList = response;
      });
    },
    async fetchData() {
      this.listLoading = true;

      this.listQuery.projectIds = this.$store.state.taskAdmin.projectId
      const response = await job.getList(this.listQuery);

      const { content } = response;
      this.total = content.recordsTotal;
      this.list = content.data;
      this.listLoading = false;

      const firstElement = content?.data[0] || {};
      const a = {};

      a.title = firstElement.jobDesc;
      a.name = firstElement.jobDesc;
      a.content = firstElement;
      if (!this.firstTime) {
        this.$store.commit('ADD_TASKDETAIL', a)
      } else {
        this.firstTime = false;
      }
      this.$store.commit('SET_TASKLIST', this.list)
    },
    incStartTimeFormat(vData) {},
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      // if (!isJSON(this.jobJson)) {
      //   this.$notify({
      //     title: "Fail",
      //     message: "json格式错误",
      //     type: "error",
      //     duration: 2000,
      //   });
      //   return;
      // }
      this.jobJson = this.$options.editor.getValue() || '';
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.childJobId) {
            const auth = [];
            for (const i in this.temp.childJobId) {
              auth.push(this.temp.childJobId[i].id);
            }
            this.temp.childJobId = auth.toString();
          }

          job
            .getDataSourceDetail(this.temp.datasourceId)
            .then((res) => {
              console.log('dafa', res);
              const jsonObj = Object.assign({ sqlScript: this.jobJson }, { jobDatasource: res });
              this.jobJson = JSON.stringify(jsonObj, null, 2);
            })
            .then(() => {
              this.temp.jobJson = this.jobJson;
              this.temp.glueSource = this.glueSource;
              this.temp.projectId = this.$store.state.taskAdmin.projectId;
              if (this.partitionField) {
                this.temp.partitionInfo =
                  this.partitionField +
                  ',' +
                  this.timeOffset +
                  ',' +
                  this.timeFormatType;
              }

              this.temp.jobType = this.$store.state.taskAdmin.tabType;
              job.createJob(this.temp).then((res) => {
                this.fetchData()
                this.$store.commit('SET_TAB_TYPE', '');
                this.$store.commit('SET_TASKDETAIL_ID', res.content);
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '新建成功',
                  type: 'success',
                  duration: 2000
                });
              });
            });
        }
      });
    },
    handlerUpdate(row) {
      this.resetTemp();
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.jobJson) this.jobJson = JSON.parse(this.temp.jobJson);
      this.glueSource = this.temp.glueSource;
      const arrchildSet = [];
      const arrJobIdList = [];
      if (this.jobIdList) {
        for (const n in this.jobIdList) {
          if (this.jobIdList[n].id !== this.temp.id) {
            arrJobIdList.push(this.jobIdList[n]);
          }
        }
        this.JobIdList = arrJobIdList;
      }

      if (this.temp.childJobId) {
        const arrString = this.temp.childJobId.split(',');
        for (const i in arrString) {
          for (const n in this.jobIdList) {
            if (this.jobIdList[n].id === parseInt(arrString[i])) {
              arrchildSet.push(this.jobIdList[n]);
            }
          }
        }
        this.temp.childJobId = arrchildSet;
      }
      if (this.temp.partitionInfo) {
        const partition = this.temp.partitionInfo.split(',');
        this.partitionField = partition[0];
        this.timeOffset = partition[1];
        this.timeFormatType = partition[2];
      }
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.temp.jobJson =
        typeof this.jobJson !== 'string'
          ? JSON.stringify(this.jobJson)
          : this.jobJson;
      if (this.temp.glueType === 'BEAN' && !isJSON(this.temp.jobJson)) {
        this.$notify({
          title: 'Fail',
          message: 'json格式错误',
          type: 'error',
          duration: 2000
        });
        return;
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.childJobId) {
            const auth = [];
            for (const i in this.temp.childJobId) {
              auth.push(this.temp.childJobId[i].id);
            }
            this.temp.childJobId = auth.toString();
          }
          this.temp.executorHandler =
            this.temp.glueType === 'BEAN' ? 'executorJobHandler' : '';
          this.temp.glueSource = this.glueSource;
          if (this.partitionField) {
            this.temp.partitionInfo =
              this.partitionField +
              ',' +
              this.timeOffset +
              ',' +
              this.timeFormatType;
          }
          job.updateJob(this.temp).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            });
          });
        }
      });
    },
    handlerDelete(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        job.removeJob(row.id).then((response) => {
          this.fetchData();
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          });
        });
      });

      // const index = this.list.indexOf(row)
    },
    handlerExecute(row) {
      this.$confirm('确定执行吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {};
        param.jobId = row.id;
        param.executorParam = row.executorParam;
        job.triggerJob(param).then((response) => {
          this.$notify({
            title: 'Success',
            message: 'Execute Successfully',
            type: 'success',
            duration: 2000
          });
        });
      });
    },
    // 查看日志
    handlerViewLog(row) {
      this.$router.push({
        path: '/datax/log/jobLog',
        query: { jobId: row.id }
      });
    },
    handlerStart(row) {
      job.startJob(row.id).then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Start Successfully',
          type: 'success',
          duration: 2000
        });
      });
    },
    handlerStop(row) {
      job.stopJob(row.id).then((response) => {
        this.$notify({
          title: 'Success',
          message: 'Start Successfully',
          type: 'success',
          duration: 2000
        });
      });
    },
    changeSwitch(row) {
      row.triggerStatus === 1 ? this.handlerStart(row) : this.handlerStop(row);
    },
    nextTriggerTime(row) {
      job.nextTriggerTime(row.jobCron).then((response) => {
        const { content } = response;
        this.triggerNextTimes = content.join('<br>');
      });
    },
    loadById(row) {
      executor.loadById(row.jobGroup).then((response) => {
        this.registerNode = [];
        const { content } = response;
        this.registerNode.push(content);
      });
    },

    // 上传文件
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    successFile(response, file, fileList) {
      const _this = this;
      // FileReader读取文件内容
      const reader = new FileReader();
      reader.readAsText(file.raw, 'UTF-8');
      reader.onload = function(e) {
        // urlData就是对应的文件内容
        const urlData = this.result;
        _this.jsonContent = urlData;
        _this.$options.editor.getDoc().setValue(urlData);
      };
    },

    // 数据源列表
    fetchSourceData() {
      datasourceApi.getDataSourceList().then((response) => {
        const { records } = response;
        const { total } = response;
        this.blockStrategies = response;
      });
    },
    // schema列表
    async getSchemaList() {
      const schemaList = await getTableSchema({
        datasourceId: this.temp.datasourceId
      });
      console.log(schemaList);
      this.schemaList = schemaList;
    },

    // 初始化sql编辑器
    mountCodeMirror() {
      const mime = 'text/x-sql';
      const theme = 'ambiance'; // 设置主题，不设置的会使用默认主题
      const _this = this;
      this.$options.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime, // 选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        gutters: ['CodeMirror-linenumbers'],
        // theme: theme,
        // autofocus: true,
        // extraKeys: { Ctrl: 'delCharBefore' }, // 自定义快捷键
        hintOptions: {
          // 自定义提示选项,
          completeSingle: false
          // tables: _this.tips,
        },
        configureMouse() {
          console.log(window.getSelection());
          return {
            unit: 'word'
          };
        }
      });
    }
  },

  editor: null
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.scriptJson {
  margin-top: 20px;
}

/* .input_from >>> .el-form-item {
  margin-bottom: 8px;
} */

.input_from >>> .el-form-item__error {
  padding-top: 0;
  top: 90%;
}
.from_btn {
  text-align: right;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid rgb(233, 230, 230);
}

.main-content {
  width: 100%;
  margin-top: 20px;
}

.main-content >>> .el-select {
  width: 100%;
}
</style>

<style>
.CodeMirror {
  /* border: 1px solid #d9d9d9; */
  border-left: none;
}
.CodeMirror-linenumbers {
  background: rgb(255, 255, 255);
}
</style>
