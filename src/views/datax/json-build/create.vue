<template>
  <div>
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="left"
      label-width="110px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobDesc">
            <el-input
              v-model="temp.jobDesc"
              size="medium"
              placeholder="请输入任务描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
          <el-dialog
            title="提示"
            :visible.sync="showCronBox"
            width="60%"
            append-to-body
          >
            <cron v-model="temp.jobCron" />
            <span slot="footer" class="dialog-footer">
              <el-button @click="showCronBox = false">关闭</el-button>
              <el-button type="primary" @click="showCronBox = false"
                >确 定</el-button
              >
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
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
          <el-form-item label="报警邮件">
            <el-input
              v-model="temp.alarmEmail"
              placeholder="请输入报警邮件，多个用逗号分隔"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务类型" prop="glueType">
            <el-select v-model="temp.glueType" placeholder="任务脚本类型">
              <el-option
                v-for="item in glueTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试次数">
            <el-input-number
              v-model="temp.executorFailRetryCount"
              :min="0"
              :max="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属项目" prop="projectId">
            <el-select
              v-model="temp.projectId"
              placeholder="所属项目"
              class="filter-item"
            >
              <el-option
                v-for="item in jobProjectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="超时时间(分钟)">
            <el-input-number
              v-model="temp.executorTimeout"
              :min="0"
              :max="120"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
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
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" />
      </el-row>
      <el-row v-if="temp.glueType === 'BEAN'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="辅助参数" prop="incrementType">
            <el-select
              v-model="temp.incrementType"
              placeholder="请选择参数类型"
              value=""
            >
              <el-option
                v-for="item in incrementTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="temp.glueType === 'BEAN' && temp.incrementType === 1"
        :gutter="20"
      >
        <el-col :span="12">
          <el-form-item label="增量主键开始ID" prop="incStartId">
            <el-input
              v-model="temp.incStartId"
              placeholder="首次增量使用"
              style="width: 56%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ID增量参数" prop="replaceParam">
            <el-input
              v-model="temp.replaceParam"
              placeholder="-DstartId='%s' -DendId='%s'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="reader数据源" prop="datasourceId">
            <el-select
              v-model="temp.datasourceId"
              placeholder="reader数据源"
              class="filter-item"
            >
              <el-option
                v-for="item in dataSourceList"
                :key="item.id"
                :label="item.datasourceName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="reader表" prop="readerTable">
            <el-input v-model="temp.readerTable" placeholder="读表的表名" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="主键" label-width="40px" prop="primaryKey">
            <el-input
              v-model="temp.primaryKey"
              placeholder="请填写主键字段名"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="temp.glueType === 'BEAN' && temp.incrementType === 2"
        :gutter="20"
      >
        <el-col :span="12">
          <el-form-item label="增量开始时间" prop="incStartTime">
            <el-date-picker
              v-model="temp.incStartTime"
              type="datetime"
              placeholder="首次增量使用"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 57%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="增量时间字段" prop="replaceParam">
            <el-input
              v-model="temp.replaceParam"
              placeholder="-DlastTime='%s' -DcurrentTime='%s'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="增量时间格式" prop="replaceParamType">
            <el-select
              v-model="temp.replaceParamType"
              placeholder="增量时间格式"
              @change="incStartTimeFormat"
            >
              <el-option
                v-for="item in replaceFormatTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        v-if="temp.glueType === 'BEAN' && temp.incrementType === 3"
        :gutter="20"
      >
        <el-col :span="12">
          <el-form-item label="分区字段" prop="partitionField">
            <el-input
              v-model="partitionField"
              placeholder="请输入分区字段"
              style="width: 56%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="分区时间">
            <el-select v-model="timeFormatType" placeholder="分区时间格式">
              <el-option
                v-for="item in timeFormatTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-input-number
            v-model="timeOffset"
            :min="-20"
            :max="0"
            style="width: 65%"
          />
        </el-col>
      </el-row>
      <el-row v-if="temp.glueType === 'BEAN'" :gutter="20">
        <el-col :span="24">
          <el-form-item label="JVM启动参数">
            <el-input
              v-model="temp.jvmParam"
              placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- <json-editor v-if="temp.glueType" ref="jsonEditor" v-model="inputJson" /> -->
  </div>
</template>

<script>
import * as job from "@/api/datax-job-info";
import * as jobProjectApi from "@/api/datax-job-project";
import * as datasourceApi from "@/api/datax-jdbcDatasource";
import Cron from "@/components/Cron";

import ShellEditor from "@/components/ShellEditor";
import PythonEditor from "@/components/PythonEditor";
import PowershellEditor from "@/components/PowershellEditor";

export default {
  name: "create",
  components: { Cron, ShellEditor, PythonEditor, PowershellEditor },
  props: ["Fjson"],
  data() {
    return {
      showCronBox: false,
      temp: {
        id: undefined,
        jobGroup: "",
        jobCron: "",
        jobDesc: "",
        executorRouteStrategy: "",
        executorBlockStrategy: "",
        childJobId: "",
        executorFailRetryCount: "",
        alarmEmail: "",
        executorTimeout: "",
        userId: 0,
        jobConfigId: "",
        executorHandler: "",
        glueType: "",
        glueSource: "",
        jobJson: "",
        executorParam: "",
        replaceParam: "",
        replaceParamType: "Timestamp",
        jvmParam: "",
        incStartTime: "",
        partitionInfo: "",
        incrementType: 0,
        incStartId: "",
        primaryKey: "",
        projectId: "",
        datasourceId: "",
        readerTable: "",
        childJobIdArr: [],
      },

      executorList: [],

      routeStrategies: [
        { value: "FIRST", label: "第一个" },
        { value: "LAST", label: "最后一个" },
        { value: "ROUND", label: "轮询" },
        { value: "RANDOM", label: "随机" },
        { value: "CONSISTENT_HASH", label: "一致性HASH" },
        { value: "LEAST_FREQUENTLY_USED", label: "最不经常使用" },
        { value: "LEAST_RECENTLY_USED", label: "最近最久未使用" },
        { value: "FAILOVER", label: "故障转移" },
        { value: "BUSYOVER", label: "忙碌转移" },
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],

      blockStrategies: [
        { value: "SERIAL_EXECUTION", label: "单机串行" },
        { value: "DISCARD_LATER", label: "丢弃后续调度" },
        { value: "COVER_EARLY", label: "覆盖之前调度" },
      ],

      glueTypes: [
        { value: "BEAN", label: "DataX任务" },
        { value: "GLUE_SHELL", label: "Shell任务" },
        { value: "GLUE_PYTHON", label: "Python任务" },
        { value: "GLUE_POWERSHELL", label: "PowerShell任务" },
      ],

      incrementTypes: [
        { value: 0, label: "无" },
        { value: 1, label: "主键自增" },
        { value: 2, label: "时间自增" },
        { value: 3, label: "HIVE分区" },
      ],

      jobProjectList: [],

      jobIdList: [],

      dataSourceList: [],

      replaceFormatTypes: [
        { value: "yyyy/MM/dd", label: "yyyy/MM/dd" },
        { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
        { value: "HH:mm:ss", label: "HH:mm:ss" },
        { value: "yyyy/MM/dd HH:mm:ss", label: "yyyy/MM/dd HH:mm:ss" },
        { value: "yyyy-MM-dd HH:mm:ss", label: "yyyy-MM-dd HH:mm:ss" },
        { value: "Timestamp", label: "时间戳" },
      ],

      timeFormatTypes: [
        { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
        { value: "yyyyMMdd", label: "yyyyMMdd" },
        { value: "yyyy/MM/dd", label: "yyyy/MM/dd" },
      ],
    };
  },
  methods: {
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

    getDataSourceList() {
      datasourceApi.getDataSourceList().then((response) => {
        this.dataSourceList = response;
      });
    },

    createTask() {
      this.temp.jobJson = JSON.stringify(this.Fjson, null,2);
      console.log('this.Fjson',this.Fjson);
      let str = "";
      this.temp.childJobIdArr.forEach((ele) => {
        str = str + ele + ",";
      });
      this.temp.childJobId = str;
      this.temp.executorHandler =
        this.temp.glueType === "BEAN"
          ? "executorJobHandler"
          : "executorJobHandler";
      job.createJob(this.temp).then(() => {
        this.$notify({
          title: "Success",
          message: "Created Successfully",
          type: "success",
          duration: 2000,
        });
        this.$emit("refresh");
      });
    },
  },

  beforeMount() {
    this.getExecutor();
    this.getJobProject();
    this.getJobIdList();
    this.getDataSourceList();
  },
};
</script>

<style>
</style>