<template>
  <div>
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="top"
      label-width="120px"
      class="elFrom"
      size="medium"
    >
      <el-row :gutter="20">
        <el-card shadow="never">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobDesc">
              <el-input
                v-model="temp.jobDesc"
                size="medium"
                placeholder="请输入任务名称"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="描述（新增）" prop="jobGroup">
              <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
                <el-option
                  v-for="item in executorList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="描述（新增）" prop="jobGroup">
              <el-input v-model="temp.description" placeholder="描述" />
            </el-form-item>
          </el-col>
        </el-card>
        <!-- <h1 style="font-size: 21px; font-weight: 700; margin: 28px 4%;">调度策略<el-button type="text" icon="el-icon-down" @click="showStrategy = !showStrategy">{{ showStrategy ? '展开' : '折叠'}}</el-button></h1> -->
        <el-card v-show="showStrategy" shadow="never" style="margin-top: 3%">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="下级任务">
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
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调度时间" prop="jobCron">
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警邮件">
              <el-input
                v-model="temp.alarmEmail"
                placeholder="请输入报警邮件，多个用逗号分隔"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失败重试">
              <el-input-number
                v-model="temp.executorFailRetryCount"
                :min="0"
                :max="20"
                size="small"
              />
              <span style="margin-left: 10px">次</span>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时间">
              <el-input-number
                v-model="temp.executorTimeout"
                :min="0"
                :max="120"
                size="small"
              />
              <span style="margin-left: 10px">分</span>
            </el-form-item>
          </el-col>
        </el-card>
      </el-row>
      <!-- <el-form-item label="任务名称：" prop="jobDesc">
        <el-input
          v-model="temp.jobDesc"
          size="medium"
          placeholder="请输入任务名称"
        />
      </el-form-item>

      <el-form-item label="执行器：" prop="jobGroup">
        <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
          <el-option
            v-for="item in executorList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="路由策略：" prop="executorRouteStrategy">
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

      <el-form-item label="阻塞处理：" prop="executorBlockStrategy">
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

      <el-form-item label="子任务：">
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
            :value="item.id"
          />
        </el-select>
      </el-form-item>

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

      <el-form-item label="报警邮件：">
        <el-input
          v-model="temp.alarmEmail"
          placeholder="请输入报警邮件，多个用逗号分隔"
        />
      </el-form-item>

      <el-form-item label="失败重试次数：">
        <el-input-number
          v-model="temp.executorFailRetryCount"
          :min="0"
          :max="20"
          size="small"
        />
      </el-form-item>

      <el-form-item label="超时时间(分)：">
        <el-input-number
          v-model="temp.executorTimeout"
          :min="0"
          :max="120"
          size="small"
        />
      </el-form-item> -->
    </el-form>
    <!-- <json-editor v-if="temp.glueType" ref="jsonEditor" v-model="inputJson" /> -->
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
  </div>
</template>

<script>
import * as job from '@/api/datax-job-info';
import * as jobProjectApi from '@/api/datax-job-project';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import Cron from '@/components/Cron';

import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';

export default {
  name: 'Create',
  components: { Cron, ShellEditor, PythonEditor, PowershellEditor },
  props: ['fjson'],
  data() {
    return {
      showCronBox: false,
      temp: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: '',
        executorFailRetryCount: '',
        alarmEmail: '',
        executorTimeout: '',
        userId: 0,
        jobConfigId: '',
        executorHandler: '',
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
        readerTable: '',
        childJobIdArr: []
      },

      executorList: [],

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

      blockStrategies: [
        { value: 'SERIAL_EXECUTION', label: '单机串行' },
        { value: 'DISCARD_LATER', label: '丢弃后续调度' },
        { value: 'COVER_EARLY', label: '覆盖之前调度' }
      ],

      glueTypes: [
        { value: 'BEAN', label: 'DataX任务' },
        { value: 'GLUE_SHELL', label: 'Shell任务' },
        { value: 'GLUE_PYTHON', label: 'Python任务' },
        { value: 'GLUE_POWERSHELL', label: 'PowerShell任务' }
      ],

      incrementTypes: [
        { value: 0, label: '无' },
        { value: 1, label: '主键自增' },
        { value: 2, label: '时间自增' },
        { value: 3, label: 'HIVE分区' }
      ],

      jobProjectList: [],

      jobIdList: [],

      dataSourceList: [],

      replaceFormatTypes: [
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'HH:mm:ss', label: 'HH:mm:ss' },
        { value: 'yyyy/MM/dd HH:mm:ss', label: 'yyyy/MM/dd HH:mm:ss' },
        { value: 'yyyy-MM-dd HH:mm:ss', label: 'yyyy-MM-dd HH:mm:ss' },
        { value: 'Timestamp', label: '时间戳' }
      ],

      timeFormatTypes: [
        { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
        { value: 'yyyyMMdd', label: 'yyyyMMdd' },
        { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' }
      ],
      showStrategy: false
    };
  },

  beforeMount() {
    this.getExecutor();
    this.getJobProject();
    this.getJobIdList();
    this.getDataSourceList();
    // 默认值
    this.$set(this.temp, 'executorRouteStrategy', this.routeStrategies.length > 0 ? this.routeStrategies[0].value : '')
    this.$set(this.temp, 'executorBlockStrategy', this.blockStrategies.length > 0 ? this.blockStrategies[0].value : '')
    this.$set(this.temp, 'executorFailRetryCount', 1)
    this.$set(this.temp, 'executorTimeout', 1)
    this.$set(this.temp, 'jobCron', '* * * ? * * *')
  },
  methods: {
    /**
     * @description: 获取执行器列表
     */
    getExecutor() {
      job.getExecutorList().then((response) => {
        const { content } = response;
        this.executorList = content;
        this.$set(this.temp, 'jobGroup', this.executorList.length > 0 ? this.executorList[0].id : '')
      });
    },

    getJobProject() {
      jobProjectApi.getJobProjectList().then((response) => {
        this.jobProjectList = response;
      });
    },
    /**
     * @description: 获取子任务列表
     */
    getJobIdList() {
      job.getJobIdList().then((response) => {
        const { content } = response;
        this.jobIdList = content;
        const t = []
        if (this.jobIdList.length > 0) {
          t.push(this.jobIdList[0].id)
        }
        this.$set(this.temp, 'childJobIdArr', t)
      });
    },
    /**
     * @description: 获取数据源列表
     */
    getDataSourceList() {
      datasourceApi.getDataSourceList().then((response) => {
        this.dataSourceList = response;
      });
    },

    createTask() {
      this.temp.jobJson = JSON.stringify(this.fjson, null, 2);
      this.temp.projectId = this.$store.state.taskAdmin.projectId;
      let str = '';
      this.temp.childJobIdArr.forEach((ele) => {
        str = str + ele + ',';
      });
      this.temp.childJobId = str;
      this.temp.executorHandler =
        this.temp.glueType === 'BEAN'
          ? 'executorJobHandler'
          : 'executorJobHandler';

      this.temp.jobType = this.$store.state.taskAdmin.tabType;

      this.temp.jobParam = this.$store.state.taskAdmin.jobParam;
      job.createJob(this.temp).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        });

        this.$store.dispatch('getTaskList', true)
        this.$store.commit('SET_TAB_TYPE', '');
      });
    }

  }
};
</script>

<style scoped>
/* .elFrom >>> .el-input--suffix .el-input__inner {
  padding-right: 100px;
} */

.el-card {
    border-radius: 0px;
    border: 0px solid #e6ebf5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
}

</style>
