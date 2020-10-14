<template>
  <div class="app-container">
    <div class="action_btn">
      <span class="span_btn" @click="handlerExecute(temp)"><i class="el-icon-video-play"></i>&nbsp;&nbsp;执行一次</span>
      <span class="span_btn" @click="handlerViewLog(temp)"><i class="el-icon-tickets"></i>&nbsp;&nbsp;查询日志</span>
      <span class="span_btn" @click="handlerUpdate(temp)"><i class="el-icon-edit"></i>&nbsp;&nbsp;编辑</span>

      <el-popover
            placement="bottom"
            width="500"
            @show="loadById(temp)"
          >
            <el-table :data="registerNode">
              <el-table-column width="150" property="title" label="执行器名称" />
              <el-table-column width="150" property="appName" label="appName" />
              <el-table-column width="150" property="registryList" label="机器地址" />
            </el-table>
            <span slot="reference" class="span_btn"><i class="el-icon-copy-document"></i>&nbsp;&nbsp;注册节点</span>
      </el-popover>
      
      <el-popover
            placement="bottom"
            width="300"
            @show="nextTriggerTime(temp)"
          >
            <h5 v-html="triggerNextTimes" />
            <span slot="reference" class="span_btn"><i class="el-icon-time"></i>&nbsp;&nbsp;下次触发时间</span>
      </el-popover>
      
      <span class="span_btn" @click="handlerDelete(temp)"><i class="el-icon-delete"></i>&nbsp;&nbsp;删除</span>
    <el-switch
      v-model='temp.triggerStatus'
      active-color="#00A854"
      active-text="启动"
      :active-value="1"
      inactive-color="#F04134"
      inactive-text="停止"
      :inactive-value="0"
      @change="changeSwitch(temp)"
    ></el-switch>
    </div>
    <el-divider></el-divider>
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="left"
      label-width="110px"
      :disabled="editFrom"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务类型" prop="glueType">
            {{ this.temp.glueType }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务名称" prop="jobDesc">
            <el-input
              v-model="temp.jobDesc"
              size="medium"
              placeholder="请输入任务描述"
            />
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
          <el-form-item label="子任务">
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
    <json-editor
      v-if="temp.glueType === 'BEAN'"
      ref="jsonEditor"
      v-model="temp.jobJson"
    />
    <shell-editor
      v-if="temp.glueType === 'GLUE_SHELL'"
      ref="shellEditor"
      v-model="temp.jobJson"
    />
    <python-editor
      v-if="temp.glueType === 'GLUE_PYTHON'"
      ref="pythonEditor"
      v-model="temp.jobJson"
    />
    <powershell-editor
      v-if="temp.glueType === 'GLUE_POWERSHELL'"
      ref="powershellEditor"
      v-model="temp.jobJson"
    />
    <div slot="footer" class="dialog-footer ">
      <div >
        <div class="log_title">
          <span>运行日志</span>
          <span @click="showLog = !showLog" class="unflod">
            <i v-if="!showLog" class="el-icon-sort-up"></i>
            <i v-else class="el-icon-sort-down"></i>
          </span>
        </div>
        <transition name="fade">
        <div v-if="showLog" class="log_container">

        </div>
        </transition>
      </div>
    </div>
    <!-- </el-dialog> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" :before-close="handleClose">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="执行器" prop="jobGroup">
              <el-select v-model="temp.jobGroup" placeholder="请选择执行器">
                <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="jobDesc">
              <el-input v-model="temp.jobDesc" size="medium" placeholder="请输入任务描述" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="路由策略" prop="executorRouteStrategy">
              <el-select v-model="temp.executorRouteStrategy" placeholder="请选择路由策略">
                <el-option v-for="item in routeStrategies" :key="item.value" :label="item.label" :value="item.value" />
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
                <el-button @click="showCronBox = false;">关闭</el-button>
                <el-button type="primary" @click="showCronBox = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-form-item label="Cron" prop="jobCron">
              <el-input v-model="temp.jobCron" auto-complete="off" placeholder="请输入Cron表达式">
                <el-button v-if="!showCronBox" slot="append" icon="el-icon-turn-off" title="打开图形配置" @click="showCronBox = true" />
                <el-button v-else slot="append" icon="el-icon-open" title="关闭图形配置" @click="showCronBox = false" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="阻塞处理" prop="executorBlockStrategy">
              <el-select v-model="temp.executorBlockStrategy" placeholder="请选择阻塞处理策略">
                <el-option v-for="item in blockStrategies" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警邮件">
              <el-input v-model="temp.alarmEmail" placeholder="请输入报警邮件，多个用逗号分隔" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="任务类型" prop="glueType">
              <el-select v-model="temp.glueType" placeholder="任务脚本类型">
                <el-option v-for="item in glueTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失败重试次数">
              <el-input-number v-model="temp.executorFailRetryCount" :min="0" :max="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="projectId">
              <el-select v-model="temp.projectId" placeholder="所属项目" class="filter-item">
                <el-option v-for="item in jobProjectList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时间(分钟)">
              <el-input-number v-model="temp.executorTimeout" :min="0" :max="120" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="子任务">
              <el-select v-model="temp.childJobId" multiple placeholder="子任务" value-key="id">
                <el-option v-for="item in jobIdList" :key="item.id" :label="item.jobDesc" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row v-if="temp.glueType==='BEAN'" :gutter="20">
          <el-col :span="12">
            <el-form-item label="辅助参数" prop="incrementType">
              <el-select v-model="temp.incrementType" placeholder="请选择参数类型" value="">
                <el-option v-for="item in incrementTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 1" :gutter="20">
          <el-col :span="12">
            <el-form-item label="增量主键开始ID" prop="incStartId">
              <el-input v-model="temp.incStartId" placeholder="首次增量使用" style="width: 56%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ID增量参数" prop="replaceParam">
              <el-input v-model="temp.replaceParam" placeholder="-DstartId='%s' -DendId='%s'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="reader数据源" prop="datasourceId">
              <el-select v-model="temp.datasourceId" placeholder="reader数据源" class="filter-item">
                <el-option v-for="item in dataSourceList" :key="item.id" :label="item.datasourceName" :value="item.id" />
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
              <el-input v-model="temp.primaryKey" placeholder="请填写主键字段名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 2" :gutter="20">
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
              <el-input v-model="temp.replaceParam" placeholder="-DlastTime='%s' -DcurrentTime='%s'" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="增量时间格式" prop="replaceParamType">
              <el-select v-model="temp.replaceParamType" placeholder="增量时间格式" @change="incStartTimeFormat">
                <el-option v-for="item in replaceFormatTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row v-if="temp.glueType==='BEAN' && temp.incrementType === 3" :gutter="20">
          <el-col :span="12">
            <el-form-item label="分区字段" prop="partitionField">
              <el-input v-model="partitionField" placeholder="请输入分区字段" style="width: 56%" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="分区时间">
              <el-select v-model="timeFormatType" placeholder="分区时间格式">
                <el-option v-for="item in timeFormatTypes" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-input-number v-model="timeOffset" :min="-20" :max="0" style="width: 65%" />
          </el-col>
        </el-row>
        <el-row v-if="temp.glueType==='BEAN'" :gutter="20">
          <el-col :span="24">
            <el-form-item label="JVM启动参数">
              <el-input v-model="temp.jvmParam" placeholder="-Xms1024m -Xmx1024m -XX:+HeapDumpOnOutOfMemoryError" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <json-editor v-if="temp.glueType==='BEAN'" ref="jsonEditor" v-model="temp.jobJson" />
      <!-- <shell-editor v-if="temp.glueType==='GLUE_SHELL'" ref="shellEditor" v-model="glueSource" />
      <python-editor v-if="temp.glueType==='GLUE_PYTHON'" ref="pythonEditor" v-model="glueSource" />
      <powershell-editor v-if="temp.glueType==='GLUE_POWERSHELL'" ref="powershellEditor" v-model="glueSource" /> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="日志信息" :visible.sync="logview">
  <el-table :data="logData">
    <el-table-column property="date" label="日期" width="150"></el-table-column>
    <el-table-column property="name" label="姓名" width="200"></el-table-column>
    <el-table-column property="address" label="地址"></el-table-column>
  </el-table>
</el-dialog>

</div>
</template>

<script>
import * as executor from "@/api/datax-executor";
import * as job from "@/api/datax-job-info";
import waves from "@/directive/waves"; // waves directive
import Cron from "@/components/Cron";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import JsonEditor from "@/components/JsonEditor";
import ShellEditor from "@/components/ShellEditor";
import PythonEditor from "@/components/PythonEditor";
import PowershellEditor from "@/components/PowershellEditor";
import * as datasourceApi from "@/api/datax-jdbcDatasource";
import * as jobProjectApi from "@/api/datax-job-project";
import { isJSON } from "@/utils/validate";

import { handlerExecute, handlerViewLog, handlerDelete, handlerStart, handlerStop, loadById, nextTriggerTime, handlerUpdate } from '../method';

export default {
  name: "SimpleJob",
  props: ["jobInfo"],
  components: {
    Pagination,
    JsonEditor,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Cron,
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    const validateIncParam = (rule, value, callback) => {
      if (!value) {
        callback(new Error("Increment parameters is required"));
      }
      callback();
    };
    const validatePartitionParam = (rule, value, callback) => {
      if (!this.partitionField) {
        callback(new Error("Partition parameters is required"));
      }
      callback();
    };
    return {
      logview:false,
      logData:[],
      editFrom: true,
      switchVal: 1,
      showLog: false,
      projectIds: "",
      list: null,
      listLoading: true,
      total: 0,
      // jobTypeLabel: '',
      listQuery: {
        current: 1,
        size: 10,
        jobGroup: 0,
        projectIds: "",
        triggerStatus: -1,
        jobDesc: "",
        glueType: "",
      },
      showCronBox: false,
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      rules: {
        jobGroup: [
          {
            required: true,
            message: "jobGroup is required",
            trigger: "change",
          },
        ],
        executorRouteStrategy: [
          {
            required: true,
            message: "executorRouteStrategy is required",
            trigger: "change",
          },
        ],
        executorBlockStrategy: [
          {
            required: true,
            message: "executorBlockStrategy is required",
            trigger: "change",
          },
        ],
        glueType: [
          { required: true, message: "jobType is required", trigger: "change" },
        ],
        projectId: [
          {
            required: true,
            message: "projectId is required",
            trigger: "change",
          },
        ],
        jobDesc: [
          { required: true, message: "jobDesc is required", trigger: "blur" },
        ],
        jobProject: [
          {
            required: true,
            message: "jobProject is required",
            trigger: "blur",
          },
        ],
        jobCron: [
          { required: true, message: "jobCron is required", trigger: "blur" },
        ],
        incStartId: [{ trigger: "blur", validator: validateIncParam }],
        replaceParam: [{ trigger: "blur", validator: validateIncParam }],
        primaryKey: [{ trigger: "blur", validator: validateIncParam }],
        incStartTime: [{ trigger: "change", validator: validateIncParam }],
        replaceParamType: [{ trigger: "change", validator: validateIncParam }],
        partitionField: [
          { trigger: "blur", validator: validatePartitionParam },
        ],
        datasourceId: [{ trigger: "change", validator: validateIncParam }],
        readerTable: [{ trigger: "blur", validator: validateIncParam }],
      },
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
      },
      resetTemp() {
        this.temp = this.$options.data().temp;
        this.jobJson = "";
        this.glueSource = "";
        this.timeOffset = 0;
        this.timeFormatType = "yyyy-MM-dd";
        this.partitionField = "";
      },
      executorList: "",
      jobIdList: "",
      jobProjectList: "",
      dataSourceList: "",
      blockStrategies: [
        { value: "SERIAL_EXECUTION", label: "单机串行" },
        { value: "DISCARD_LATER", label: "丢弃后续调度" },
        { value: "COVER_EARLY", label: "覆盖之前调度" },
      ],
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
      glueTypes: [
        { value: 'BEAN', label: 'DataX任务' },
        { value: "GLUE_SHELL", label: "Shell任务" },
        { value: 'GLUE_PYTHON', label: 'Python任务' },
        { value: 'GLUE_POWERSHELL', label: 'PowerShell任务' }
      ],
      incrementTypes: [
        { value: 0, label: "无" },
        { value: 1, label: "主键自增" },
        { value: 2, label: "时间自增" },
        { value: 3, label: "HIVE分区" },
      ],
      triggerNextTimes: "",
      registerNode: [],
      jobJson: "",
      glueSource: "",
      timeOffset: 0,
      timeFormatType: "yyyy-MM-dd",
      partitionField: "",
      timeFormatTypes: [
        { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
        { value: "yyyyMMdd", label: "yyyyMMdd" },
        { value: "yyyy/MM/dd", label: "yyyy/MM/dd" },
      ],
      replaceFormatTypes: [
        { value: "yyyy/MM/dd", label: "yyyy/MM/dd" },
        { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
        { value: "HH:mm:ss", label: "HH:mm:ss" },
        { value: "yyyy/MM/dd HH:mm:ss", label: "yyyy/MM/dd HH:mm:ss" },
        { value: "yyyy-MM-dd HH:mm:ss", label: "yyyy-MM-dd HH:mm:ss" },
        { value: "Timestamp", label: "时间戳" },
      ],
      statusList: [
        { value: 500, label: "失败" },
        { value: 502, label: "失败(超时)" },
        { value: 200, label: "成功" },
        { value: 0, label: "无" },
      ],
    };
  },
  created() {
    // console.log('this.temp',this.jobInfo);
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList();
    this.temp = this.jobInfo;
    
  },

  methods: {
    //执行一次
    handlerExecute(temp) {
      handlerExecute.call(this, temp);
    },

    //查看日志
    handlerViewLog(temp) {
      // handlerViewLog.call(this, temp);
      this.logview = true;
    },

    //删除
    handlerDelete(temp) {
      handlerDelete.call(this, temp)
      .then(()=>{
        this.$emit('deleteDetailTab',temp.id)
      })
      .then(()=>{
        this.$emit('deleteJob')
      })
    },

    //开关
    changeSwitch(temp) {
      temp.triggerStatus === 1 ? handlerStart.call(this, temp) : handlerStop.call(this, temp)
    },

    //注册节点
    loadById(row) {
      loadById.call(this, row);
    },

    //下次触发时间
    nextTriggerTime(row) {
      nextTriggerTime.call(this, row);
    },

    //编辑
    handlerUpdate(row) {
      console.log(row);
      row.childJobId = row.childJobId?.join?.(',')
      handlerUpdate.call(this, row)
    },

















    handleClose(done) {
      this.$confirm("确认关闭？")
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
    fetchData() {
      this.listLoading = true;
      if (this.projectIds) {
        this.listQuery.projectIds = this.projectIds.toString();
      }

      job.getList(this.listQuery).then((response) => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
      });
    },
    incStartTimeFormat(vData) {},
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    
    updateData() {
      this.temp.jobJson =
        typeof this.jobJson !== "string"
          ? JSON.stringify(this.jobJson, null, 2)
          : this.jobJson;
      if (this.temp.glueType === "BEAN" && !isJSON(this.temp.jobJson)) {
        this.$notify({
          title: "Fail",
          message: "json格式错误",
          type: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs["dataForm"].validate((valid) => {
        const tabName = this.temp.id;
        if (valid) {
          if (this.temp.childJobId) {
            const auth = [];
            for (const i in this.temp.childJobId) {
              auth.push(this.temp.childJobId[i].id);
            }
            this.temp.childJobId = auth.toString();
          }
          this.temp.executorHandler =
            this.temp.glueType === "BEAN" ? "executorJobHandler" : "";
          this.temp.glueSource = this.glueSource;
          if (this.partitionField)
            this.temp.partitionInfo =
              this.partitionField +
              "," +
              this.timeOffset +
              "," +
              this.timeFormatType;
          job.updateJob(this.temp).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
            this.$emit('deleteDetailTab', tabName)
            this.$emit('deleteJob')
          });
        }
      });
    },
    
    
  },
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
.action_btn {
  font-size:14px;
  cursor: pointer;
}
.span_btn {
  margin-left: 15px;
}
.span_btn > i {
  color: gray;
}
.log_title {
  color: #409eff;
  font-size: 12px;
  background: rgb(247, 247, 247);
  padding: 10px;
}
.unflod {
  color: black;
  float: right;
  cursor: pointer;
}
.log_container {
  height: 150px;
  border: 1px solid rgb(247, 247, 247);
}
.fade-enter-active, .fade-leave-active {
  transition: height .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  height: 0;
}
</style>
