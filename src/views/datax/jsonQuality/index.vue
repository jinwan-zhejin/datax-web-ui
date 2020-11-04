<template>
  <div class="app-container">
    <div class="build-container">
      <div
        style="
          width: 100%;
          border-bottom: 1px solid rgba(240, 240, 242, 1);
          margin-bottom: 20px;
          padding: 20px 0;
        "
      >
        <div style="width: 80%; margin: 0 auto">
          <el-steps :active="active">
            <el-step title="新建任务" description="">1</el-step>
            <el-step title="添加质量规则" description="">2</el-step>
            <el-step title="选择结果数据存放位置" description="">3</el-step>
            <el-step title="字段映射" description="">4</el-step>
            <el-step title="构建" description="">5</el-step>
          </el-steps>
        </div>
      </div>

      <div class="main_content">
      <div v-show="active === 0" class="step0">
         <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="110px"
        >
          
              <el-form-item label="执行器" prop="jobGroup">
                <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
                  <el-option
                    v-for="item in executorList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
           
              <el-form-item label="任务名称" prop="jobDesc">
                <el-input
                  v-model="temp.jobDesc"
                  size="medium"
                  placeholder="请输入任务描述"
                />
              </el-form-item>
  
          
            
              <el-form-item label="路由策略" prop="executorRouteStrategy">
                <el-select
                  v-model="temp.executorRouteStrategy"
                  placeholder="请选择路由策略"
                >
                  <el-option
                    v-for="item in routeStrategies"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
           
           
              <el-dialog
                title="提示"
                :visible.sync="showCronBox"
                width="60%"
                append-to-body
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
              <el-form-item label="Cron" prop="jobCron">
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
            
          
            
              <el-form-item label="阻塞处理" prop="executorBlockStrategy">
                <el-select
                  v-model="temp.executorBlockStrategy"
                  placeholder="请选择阻塞处理策略"
                >
                  <el-option
                    v-for="item in blockStrategies"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
           
            
              <el-form-item label="报警邮件">
                <el-input
                  v-model="temp.alarmEmail"
                  placeholder="请输入报警邮件，多个用逗号分隔"
                />
              </el-form-item>
            
              <!-- <el-form-item label="质量任务" prop="glueType">
                <el-select v-model="temp.glueType" placeholder="任务脚本类型">
                  <el-option
                    v-for="item in glueTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item> -->
           
              
              <el-form-item label="子任务">
                <el-select
                  v-model="temp.childJobIdArr"
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

              <el-form-item label="JVM启动参数">
                <el-input
                  v-model="temp.jvmParam"
                  placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError"
                />
              </el-form-item>

              <el-form-item label="超时时间(分钟)">
                <el-input-number
                  v-model="temp.executorTimeout"
                  :min="0"
                  :max="120"
                  size="small"
                />
              </el-form-item>

              <el-form-item label="失败重试次数">
                <el-input-number
                  v-model="temp.executorFailRetryCount"
                  :min="0"
                  :max="20"
                  size="small"
                />
              </el-form-item>
            
        </el-form>
      </div>

      <div v-show="active === 1" class="step1">
        <Reader ref="reader" />
      </div>
      <div v-show="active === 2" class="step2">
        <Writer ref="writer" />
      </div>
      <div v-show="active === 3" class="step3">
        <Mapper ref="mapper" />
      </div>
      <div v-show="active === 4" class="step4">
        <el-button type="primary" @click="buildJson">构建</el-button>
      <div style="margin-bottom: 20px" />
        <json-editor
          v-show="active === 4"
          ref="jsonEditor"
          v-model="configJson"
        />
      </div>

      </div>

      <div class="from_footer">
        <el-button
          :disabled="active === 0"
          style="margin-top: 12px"
          @click="last"
          size="small"
        >上一步</el-button>
        <el-button
          v-show="showNext"
          type="primary"
          style="margin-top: 12px; margin-bottom: 12px"
          @click="next"
          size="small"
        >下一步</el-button>
        <el-button
          v-show="showSubmit"
          :disabled="isBan"
          type="primary"
          style="margin-top: 12px; margin-bottom: 12px"
          @click="next"
          size="small"
        >提 交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as dataxJsonApi from '@/api/datax-json';
import * as jobTemplate from '@/api/datax-job-template';
import * as job from '@/api/datax-job-info';
import Pagination from '@/components/Pagination';
import JsonEditor from '@/components/JsonEditor';
import * as jobProjectApi from '@/api/datax-job-project';
import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';
import Reader from './reader';
import Writer from './writer';
import clip from '@/utils/clipboard';
import Mapper from './mapper';
import { isJSON } from '@/utils/validate';
import Cron from '@/components/Cron';

export default {
  name: 'JsonBuild',
  components: {
    Reader,
    Writer,
    Pagination,
    JsonEditor,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Mapper,
    Cron
  },
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
      configJson: '',
      isBan: false,
      active: 0,
      jobTemplate: '',
      radio: '使用模板',
      dialogFormVisible: false,
      executorList: '',
      jobProjectList: '',
      jobIdList: '',
      showSubmit: false,
      showNext: true,
      jobTemplateSelectDrawer: false,
      list: null,
      currentRow: null,
      listLoading: true,
      showCronBox: false,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        jobGroup: 0,
        triggerStatus: -1,
        jobDesc: '',
        executorHandler: '',
        userId: 0
      },
      blockStrategies: [
        { value: 'SERIAL_EXECUTION', label: '单机串行' },
        { value: 'DISCARD_LATER', label: '丢弃后续调度' },
        { value: 'COVER_EARLY', label: '覆盖之前调度' }
      ],
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
      incrementTypes: [
        { value: 0, label: '无' },
        { value: 1, label: '主键自增' },
        { value: 2, label: '时间自增' },
        { value: 3, label: 'HIVE分区' },
        { value: 4, label: 'HIVE分区自增' },
        { value: 5, label: 'MongoDB主键增量' }
      ],
      glueTypes: [
        { value: 'BEAN', label: 'DataX任务' },
        { value: 'GLUE_SHELL', label: 'Shell任务' },
        { value: 'GLUE_PYTHON', label: 'Python任务' },
        { value: 'GLUE_POWERSHELL', label: 'PowerShell任务' }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      isUse: true,
      glueSource: '',
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
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: '',
        childJobIdArr: [],
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: 'executorJobHandler',
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
        projectId: this.$store.state.taskAdmin.projectId,
        datasourceId: '',
        readerTable: ''
      }
    };
  },
  watch: {
    radio: function(newValue) {
      console.log(newValue);
      if (newValue === '使用模板') {
        this.isUse = true;
        this.isBan = false;
        this.handleJobTemplateSelectDrawer();
        this.dialogFormVisible = false;
      } else {
        this.isUse = false;
        this.isBan = true;
        this.dialogFormVisible = true;
      }
    }
  },
  created() {
    // this.getJdbcDs()
    this.getExecutor();
    this.getJobProject();
    this.getJobIdList();
  },
  methods: {
    noUse() {
      this.dialogFormVisible = true;
      console.log(123);
    },
    handleClose() {
      this.dialogFormVisible = false;
    },
    // 补充请求
    getExecutor() {
      job.getExecutorList().then((response) => {
        const { content } = response;
        this.executorList = content;
      });
    },
    getJobProject() {
      jobProjectApi.getJobProjectList().then((response) => {
        this.jobProjectList = response;
      });
    },
    getJobIdList() {
      job.getJobIdList().then((response) => {
        const { content } = response;
        this.jobIdList = content;
      });
    },
    next() {
      const fromColumnList = this.$refs.reader.getData().columns;
      const toColumnsList = this.$refs.writer.getData().columns;
      // const fromTableName = this.$refs.reader.getData().tableName
      // 第一步 reader 判断是否已选字段
      if (this.active === 1) {
        this.showNext = true;
        this.showSubmit = false;
        // 实现第一步骤读取的表和字段直接带到第二步骤
        // this.$refs.writer.sendTableNameAndColumns(fromTableName, fromColumnList)
        // 取子组件的数据
        // console.info(this.$refs.reader.getData())
        this.active++;
      } else {
        // 将第一步和第二步得到的字段名字发送到第三步
        if (this.active === 2) {
          this.showNext = true;
          this.showSubmit = false;
          this.$refs.mapper.sendColumns(fromColumnList, toColumnsList);
          this.$refs.mapper.sendRuleSettings();
        }
        if (this.active === 3) {
          this.showNext = false;
          this.showSubmit = true;
          this.jobTemplateSelectDrawer = true;
          const readerColumns = this.$refs.mapper.getLColumns();
          const writerColumns = this.$refs.mapper.getRColumns();
          var tmps = JSON.parse(JSON.stringify(readerColumns)).sort();
          for (var i = 0; i < tmps.length - 1; i++) {
            if (tmps[i] === tmps[i + 1]) {
              this.$message('源端有相同字段【' + tmps[i] + '】，请注意修改');
              throw new Error('源端有相同字段【' + tmps[i] + '】，请注意修改');
            }
          }
          var tmps1 = JSON.parse(JSON.stringify(writerColumns)).sort();
          for (i = 0; i < tmps1.length - 1; i++) {
            if (tmps1[i] === tmps1[i + 1]) {
              this.$message(
                '目标端含有相同字段【' + tmps1[i] + '】，请注意修改'
              );
              throw new Error(
                '目标端含有相同字段【' + tmps1[i] + '】，请注意修改'
              );
            }
          }
        }
        if (this.active === 4) {
          this.showNext = true;
          this.showSubmit = false;
          this.temp.jobJson = this.configJson;
          this.temp.jobType = this.$store.state.taskAdmin.tabType;

          const str = ''
          this.temp.childJobIdArr.forEach(child => {
            str += `${child.id},`
          })

          this.temp.childJobId = str;
          job.createJob(this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            });
            // 切回第一步
            this.active = 1;

            this.$store.dispatch('getTaskList', true)
            this.$store.commit('SET_TAB_TYPE','')
          });
        } else {
          this.active++;
        }
      }
    },
    last() {
      if (this.active >= 1) {
        this.showNext = true;
        this.showSubmit = false;
        this.active--;
      } else if (this.active === 3) {
        this.showNext = false;
        this.showSubmit = true;
      } else {
        this.showNext = true;
        this.showSubmit = false;
      }
    },
    // 构建json
    buildJson() {
      const readerData = this.$refs.reader.getData();
      const writeData = this.$refs.writer.getData();
      const readerColumns = this.$refs.mapper.getLColumns();
      const writerColumns = this.$refs.mapper.getRColumns();
      const transformer = this.$refs.mapper.getRules();
      const hiveReader = {
        readerPath: readerData.path,
        readerDefaultFS: readerData.defaultFS,
        readerFileType: readerData.fileType,
        readerFieldDelimiter: readerData.fieldDelimiter,
        readerSkipHeader: readerData.skipHeader
      };
      const hiveWriter = {
        writerDefaultFS: writeData.defaultFS,
        writerFileType: writeData.fileType,
        writerPath: writeData.path,
        writerFileName: writeData.fileName,
        writeMode: writeData.writeMode,
        writeFieldDelimiter: writeData.fieldDelimiter
      };
      const hbaseReader = {
        readerMode: readerData.mode,
        readerMaxVersion: readerData.maxVersion,
        readerRange: readerData.range
      };
      const hbaseWriter = {
        writerMode: writeData.mode,
        writerRowkeyColumn: writeData.rowkeyColumn,
        writerVersionColumn: writeData.versionColumn,
        writeNullMode: writeData.nullMode
      };
      const mongoDBReader = {};
      const mongoDBWriter = {
        upsertInfo: writeData.upsertInfo
      };
      const rdbmsReader = {
        readerSplitPk: readerData.splitPk,
        whereParams: readerData.where,
        querySql: readerData.querySql
      };
      const rdbmsWriter = {
        preSql: writeData.preSql,
        postSql: writeData.postSql
      };
      const obj = {
        readerDatasourceId: readerData.datasourceId,
        readerTables: [readerData.tableName],
        readerColumns: readerColumns,
        writerDatasourceId: writeData.datasourceId,
        writerTables: [writeData.tableName],
        writerColumns: writerColumns,
        transformer: transformer,
        hiveReader: hiveReader,
        hiveWriter: hiveWriter,
        rdbmsReader: rdbmsReader,
        rdbmsWriter: rdbmsWriter,
        hbaseReader: hbaseReader,
        hbaseWriter: hbaseWriter,
        rule: this.$refs.reader.getData().rule,
        mongoDBReader: mongoDBReader,
        mongoDBWriter: mongoDBWriter
      };
      // 调api
      dataxJsonApi.buildJson(obj).then((response) => {
        this.configJson = JSON.parse(response);
        console.log(123);
      });
    },
    handleCopy(text, event) {
      clip(this.configJson, event);
      this.$message({
        message: 'copy success',
        type: 'success'
      });
    },
    handleJobTemplateSelectDrawer() {
      this.jobTemplateSelectDrawer = !this.jobTemplateSelectDrawer;
      if (this.jobTemplateSelectDrawer) {
        this.fetchData();
      }
      console.log(123);
    },
    getReaderData() {
      return this.$refs.reader.getData();
    },
    fetchData() {
      this.listLoading = true;
      jobTemplate.getList(this.listQuery).then((response) => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
      });
    },
    handleCurrentChange(val) {
      this.temp = Object.assign({}, val);
      this.temp.id = undefined;
      this.temp.jobDesc = this.getReaderData().tableName;
      this.$refs.jobTemplateSelectDrawer.closeDrawer();
      this.jobTemplate = val.id + '(' + val.jobDesc + ')';
    }
  }
};
</script>

<style scoped>
.from_footer {
  text-align: right;
  border-top:1px solid #f3f3f3;
  margin-top: 0;
}

.main_content {
  width: 90%;
  margin:0 auto;
  min-height: 500px;
}

.main_content >>> .el-select {
  width: 100%;
}
</style>
