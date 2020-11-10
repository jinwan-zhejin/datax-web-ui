<template>
  <div class="job_detail">

    <div class="header">
      <div class="header_action" style="margin-left:17px;" @click="handlerExecute(temp)">
        <i class="el-icon-video-play" />
        <span>执行一次</span>
      </div>
      <div class="header_action" @click="handlerViewLog(temp)">
        <i class="el-icon-s-order" />
        <span>查询日志</span>
      </div>
      <div class="header_action">
        <el-popover placement="bottom" width="500" @show="loadById(temp)">
          <el-table :data="registerNode">
            <el-table-column width="150" property="title" label="执行器名称" />
            <el-table-column width="150" property="appName" label="appName" />
            <el-table-column width="150" property="registryList" label="机器地址" />
          </el-table>
          <div slot="reference" style="float: left">
            <i class="el-icon-s-tools" />
            <span>注册节点</span>
          </div>
        </el-popover>
      </div>

      <div class="header_action">
        <el-popover placement="bottom" width="300" @show="nextTriggerTime(temp)">
          <h5 v-html="triggerNextTimes" />
          <div slot="reference" style="float: left">
            <i class="el-icon-message-solid" />
            <span>下次触发时间</span>
          </div>
        </el-popover>
      </div>

      <div class="header_action" @click="handlerDelete(temp)">
        <i class="el-icon-delete-solid" />
        <span>删除</span>
      </div>
      <div class="header_switch" style="margin-right:10px;">
        <el-switch v-model="temp.triggerStatus" active-color="#00A854" active-text="启动" :active-value="1" inactive-color="#F04134" inactive-text="停止" :inactive-value="0" @change="changeSwitch(temp)" />
      </div>
    </div>

    <div class="content">
      <div class="title">
        <svg-icon :icon-class="temp.jobType" />

        <span class="jobDesc">{{ temp.jobDesc }}</span>

        <div class="edit" @click="handlerUpdate(temp)">
          <i class="el-icon-edit" />
          编辑
        </div>
      </div>

      <div class="detail">
        <div class="detail_target">
          <span class="key">执行器：</span>
          <span class="value">{{ jobGroupName }}</span>
        </div>
        <div class="detail_target">
          <span class="key">所属项目：</span>
          <span class="value">{{ temp.projectName }}</span>
        </div>
        <div v-if="jobType === 'NORMAL' || jobType === 'IMPORT' || jobType === 'EXPORT' || jobType === 'SHELL' || jobType === 'POWERSHELL' || jobType === 'PYTHON'" class="detail_target">
          <span class="key">路由策略：</span>
          <span class="value">{{ temp.executorRouteStrategy }}</span>
        </div>
        <div class="detail_target">
          <span class="key">子任务：</span>
          <span class="value">{{ temp.childJobId }}</span>
        </div>
        <div v-if="jobType === 'NORMAL' || jobType === 'IMPORT' || jobType === 'EXPORT' || jobType === 'SHELL' || jobType === 'POWERSHELL' || jobType === 'PYTHON'" class="detail_target">
          <span class="key">阻塞处理：</span>
          <span class="value">{{ temp.executorBlockStrategy }}</span>
        </div>
        <div class="detail_target">
          <span class="key">任务名称：</span>
          <span class="value">{{ temp.jobDesc }}</span>
        </div>
        <div class="detail_target">
          <span class="key">任务类型：</span>
          <span class="value">{{ temp.jobType }}</span>
        </div>
        <div class="detail_target">
          <span class="key">Corn：</span>
          <span class="value">{{ temp.jobCron }}</span>
        </div>
        <div class="detail_target">
          <span class="key">报警邮件：</span>
          <span class="value">{{ temp.alarmEmail }}</span>
        </div>
        <div class="detail_target">
          <span class="key">失败重试次数：</span>
          <span class="value">{{ temp.executorFailRetryCount }}</span>
        </div>
        <div class="detail_target">
          <span class="key">超时时间：</span>
          <span class="value">{{ temp.executorTimeout }}</span>
        </div>
        <div class="detail_target">
          <span class="key">JVM启动参数：</span>
          <span class="value">{{ temp.jvmParam }}</span>
        </div>
        <div v-if="jobType === 'SQLJOB'" class="detail_target">
          <span class="key">schema：</span>
          <span class="value">{{ temp.schema }}</span>
        </div>
      </div>

      <div class="json_detail">
        <p class="json_title" @click="viewJson">查看json：</p>
      </div>
      <div v-if="jsonshow" class="json_content">
        <json-editor ref="jsonEditor" v-model="temp.jobJson" :cani-edit="false" />
      </div>
    </div>

    <div class="log_detail">
      <div class="log_title">
        <span class="log_log">运行日志</span>
        <span class="unflod" @click="showRunLogDetails">
          <i v-if="!showLog" class="el-icon-sort-up" />
          <i v-else class="el-icon-sort-down" />
        </span>
      </div>
      <transition name="fade">
        <div v-if="showLog" class="log_container">
          <pre v-text="newstlogContent" />
        </div>
      </transition>
    </div>

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
            <el-dialog title="提示" :visible.sync="showCronBox" width="60%" append-to-body>
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
              <el-input-number v-model="temp.executorFailRetryCount" size="small" :min="0" :max="20" />
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
              <el-input-number v-model="temp.executorTimeout" size="small" :min="0" :max="120" />
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
            <el-form-item label="增量主键ID" prop="incStartId">
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
              <el-date-picker v-model="temp.incStartTime" type="datetime" placeholder="首次增量使用" format="yyyy-MM-dd HH:mm:ss" style="width: 57%" />
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

      <h3>2.构建reader</h3>
      <reader ref="reader" ></reader>
     
      <h3>3.构建writer</h3>
      <el-form label-position="right" label-width="150px" :model="writerForm" :rules="rules">
      <el-form-item label="数据库源：" prop="datasourceId">
        <el-select
          filterable
          :value="$store.state.taskAdmin.writerDataSourceID"
          @change="wDsChange"
        >
          <el-option
            v-for="item in $store.state.taskAdmin.dataSourceList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据库表名：" prop="tableName">
        <el-select
          allow-create
          default-first-option
          filterable
          :value="$store.state.taskAdmin.writerTableName"
          @change="wTbChange"
        >
          <el-option
            v-for="item in wTbList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <div style="margin: 5px 0;" />
      <el-form-item label="字段：">
        <el-checkbox v-model="writerForm.checkAll" :indeterminate="writerForm.isIndeterminate" @change="wHandleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="$store.state.taskAdmin.selectWriterColumn" @change="wHandleCheckedChange">
          <el-checkbox v-for="c in fromColumnList" :key="c" :label="c">{{ c }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="前置sql语句：">
        <el-input v-model="writerForm.preSql" placeholder="前置sql在insert之前执行" type="textarea" :rows="3"  />
      </el-form-item>
      <el-form-item label="postSql：">
        <el-input v-model="writerForm.postSql" placeholder="多个用;分隔" type="textarea" :rows="3"  />
      </el-form-item>
    </el-form>

      <h3>4.字段映射</h3>
      <el-table
        :data="tableData"
        stripe
        :header-cell-style="{ background: '#FAFAFC',color:'rgba(51, 51, 51, 1)','font-family': 'PingFangHK-Medium, PingFangHK' }"
        style="width: 100%"
      >
        <el-table-column
          label="数据源库"
          width="180"
        >
          <template slot-scope="scope">
            <el-select
              v-model="readerForm.lcolumns[scope.row.index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="lHandleSelect(scope.row.index,$event)"
            >
              <el-option v-for="tmp in fromColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column
          label="目标字段"
        >
          <template slot-scope="scope">
            <el-select
              v-model="readerForm.rcolumns[scope.row.index]"
              placeholder="请选择"
              filterable
              value-key="index"
              @change="rHandleSelect(scope.row.index,$event)"
            >
              <el-option v-for="tmp in toColumnsList" :key="tmp" :label="tmp" :value="tmp" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              type="infor"
              icon="el-icon-delete"
              circle
              size="small"
              value-key="index"
              @click="bHandleClick(scope.row.index,$event)"
            />
          </template>
        </el-table-column>
      </el-table>

























      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog width="75%" class="log_detail_window" title="日志信息" :visible.sync="logview">
      <jobLog :id="jobId" ref="jobLog" />
    </el-dialog>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query';
import * as executor from '@/api/datax-executor';
import * as job from '@/api/datax-job-info';
import * as log from '@/api/datax-job-log';
import waves from '@/directive/waves'; // waves directive
import Cron from '@/components/Cron';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor';
import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import * as jobProjectApi from '@/api/datax-job-project';
import reader from '@/views/datax/json-build/reader';
import writer from '@/views/datax/json-build/writer';
import mapper from '@/views/datax/json-build/mapper';
import {
  isJSON
} from '@/utils/validate';
import jobLog from './jobLog';
import {
  getTableSchema
} from '@/api/metadata-query';

import {
  handlerExecute,
  handlerViewLog,
  handlerDelete,
  handlerStart,
  handlerStop,
  loadById,
  nextTriggerTime,
  handlerUpdate
} from '../method';

export default {
  name: 'SimpleJob',
  components: {
    Pagination,
    JsonEditor,
    ShellEditor,
    PythonEditor,
    PowershellEditor,
    Cron,
    jobLog,
    reader,
    writer,
    mapper
  },
  directives: {
    waves
  },
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
  props: ['jobInfo'],
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
      tableData:[],
      mapperJson: {},
      fromColumnsList: [],
      fromColumnsListChecked: [],
      toColumnsList: [],
      toColumnsListChecked: [],
      ruleSettings: [],
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      },
      fromColumnList: [],
      wTbList: [],
      writerForm: {
        datasourceId: '',
        tableName: '',
        columns: [],
        checkAll: false,
        isIndeterminate: true,
        preSql: '',
        postSql: '',
        ifCreateTable: false,
        tableSchema: ''
      },
      rColumnList: [],
      rTbList: [],
      jsonshow: false,
      newstlogContent: '',
      jobId: '',
      logview: false,
      logData: [],
      editFrom: true,
      switchVal: 1,
      showLog: false,
      projectIds: '',
      list: null,
      listLoading: true,
      total: 0,
      schemaList: [],
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        jobGroup: [{
          required: true,
          message: 'jobGroup is required',
          trigger: 'change'
        }],
        executorRouteStrategy: [{
          required: true,
          message: 'executorRouteStrategy is required',
          trigger: 'change'
        }],
        executorBlockStrategy: [{
          required: true,
          message: 'executorBlockStrategy is required',
          trigger: 'change'
        }],
        glueType: [{
          required: true,
          message: 'jobType is required',
          trigger: 'change'
        }],
        projectId: [{
          required: true,
          message: 'projectId is required',
          trigger: 'change'
        }],
        jobDesc: [{
          required: true,
          message: 'jobDesc is required',
          trigger: 'blur'
        }],
        jobProject: [{
          required: true,
          message: 'jobProject is required',
          trigger: 'blur'
        }],
        jobCron: [{
          required: true,
          message: 'jobCron is required',
          trigger: 'blur'
        }],
        incStartId: [{
          trigger: 'blur',
          validator: validateIncParam
        }],
        replaceParam: [{
          trigger: 'blur',
          validator: validateIncParam
        }],
        primaryKey: [{
          trigger: 'blur',
          validator: validateIncParam
        }],
        incStartTime: [{
          trigger: 'change',
          validator: validateIncParam
        }],
        replaceParamType: [{
          trigger: 'change',
          validator: validateIncParam
        }],
        partitionField: [{
          trigger: 'blur',
          validator: validatePartitionParam
        }],
        datasourceId: [{
          trigger: 'change',
          validator: validateIncParam
        }],
        readerTable: [{
          trigger: 'blur',
          validator: validateIncParam
        }]
      },
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
        glueType: '',
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
      executorList: [],
      jobIdList: '',
      jobProjectList: '',
      dataSourceList: '',
      blockStrategies: [{
        value: 'SERIAL_EXECUTION',
        label: '单机串行'
      },
      {
        value: 'DISCARD_LATER',
        label: '丢弃后续调度'
      },
      {
        value: 'COVER_EARLY',
        label: '覆盖之前调度'
      }
      ],
      routeStrategies: [{
        value: 'FIRST',
        label: '第一个'
      },
      {
        value: 'LAST',
        label: '最后一个'
      },
      {
        value: 'ROUND',
        label: '轮询'
      },
      {
        value: 'RANDOM',
        label: '随机'
      },
      {
        value: 'CONSISTENT_HASH',
        label: '一致性HASH'
      },
      {
        value: 'LEAST_FREQUENTLY_USED',
        label: '最不经常使用'
      },
      {
        value: 'LEAST_RECENTLY_USED',
        label: '最近最久未使用'
      },
      {
        value: 'FAILOVER',
        label: '故障转移'
      },
      {
        value: 'BUSYOVER',
        label: '忙碌转移'
      }
        // { value: 'SHARDING_BROADCAST', label: '分片广播' }
      ],
      glueTypes: [{
        value: 'BEAN',
        label: 'DataX任务'
      },
      {
        value: 'GLUE_SHELL',
        label: 'Shell任务'
      },
      {
        value: 'GLUE_PYTHON',
        label: 'Python任务'
      },
      {
        value: 'GLUE_POWERSHELL',
        label: 'PowerShell任务'
      }
      ],
      incrementTypes: [{
        value: 0,
        label: '无'
      },
      {
        value: 1,
        label: '主键自增'
      },
      {
        value: 2,
        label: '时间自增'
      },
      {
        value: 3,
        label: 'HIVE分区'
      }
      ],
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      glueSource: '',
      timeOffset: 0,
      timeFormatType: 'yyyy-MM-dd',
      partitionField: '',
      timeFormatTypes: [{
        value: 'yyyy-MM-dd',
        label: 'yyyy-MM-dd'
      },
      {
        value: 'yyyyMMdd',
        label: 'yyyyMMdd'
      },
      {
        value: 'yyyy/MM/dd',
        label: 'yyyy/MM/dd'
      }
      ],
      replaceFormatTypes: [{
        value: 'yyyy/MM/dd',
        label: 'yyyy/MM/dd'
      },
      {
        value: 'yyyy-MM-dd',
        label: 'yyyy-MM-dd'
      },
      {
        value: 'HH:mm:ss',
        label: 'HH:mm:ss'
      },
      {
        value: 'yyyy/MM/dd HH:mm:ss',
        label: 'yyyy/MM/dd HH:mm:ss'
      },
      {
        value: 'yyyy-MM-dd HH:mm:ss',
        label: 'yyyy-MM-dd HH:mm:ss'
      },
      {
        value: 'Timestamp',
        label: '时间戳'
      }
      ],
      statusList: [{
        value: 500,
        label: '失败'
      },
      {
        value: 502,
        label: '失败(超时)'
      },
      {
        value: 200,
        label: '成功'
      },
      {
        value: 0,
        label: '无'
      }
      ]
    };
  },

  computed: {
    jobType() {
      return this.jobInfo.jobType;
    },

    jobGroupName() {
      return this.executorList.find(element => element.id === this.temp.jobGroup)?.title;
    },

    jobParam() {
      return JSON.parse(this.jobInfo.jobParam);
    },

    ruleArr() {
      return this.readerForm.rules;
    },

    readerColumns() {
      return this.$store.state.taskAdmin.selectReaderColumn
    },

    writerColumns() {
      return this.$store.state.taskAdmin.writerColumns
    }
  },
  created() {
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList();
    this.getSchemaList();
    this.temp = this.jobInfo;

  },

  methods: {
    wDsChange(e) {
      this.writerForm.datasourceId = e;
      this.$store.commit('SET_WRITER_DATASOURCE_ID', e);
    },

    getReaderData() {
      return this.$refs.reader.getData()
    },
    wHandleCheckAllChange(val) {
      this.writerForm.columns = val ? this.fromColumnList : []
      this.writerForm.isIndeterminate = false
      this.$store.commit('SET_SELECT_WRITERCOLUMN',this.writerForm.columns)
    },
    wHandleCheckedChange(value) {
      const checkedCount = value.length
      this.writerForm.checkAll = checkedCount === this.fromColumnList.length
      this.writerForm.isIndeterminate = checkedCount > 0 && checkedCount < this.fromColumnList.length
      this.$store.commit('SET_SELECT_WRITERCOLUMN', value)
    },
    wTbChange(t) {
      this.writerForm.tableName = t
      this.getColumns('writer')
      this.$store.commit('SET_WRITER_TABLENAME', t)
    },

    // 执行一次
    handlerExecute(temp) {
      handlerExecute.call(this, temp).then(() => {
        this.newstlogContent = ''
        this.logList();
        this.showLog = true;
        this.jsonshow = false;
      });
    },

    // 查看日志
    handlerViewLog(temp) {
      // handlerViewLog.call(this, temp);
      this.logview = true;
      this.jobId = temp.id;
            this.$refs.jobLog?.fetchData();
    },

    // 删除
    handlerDelete(temp) {
      handlerDelete
        .call(this, temp)
        .then(() => {
          this.$emit('deleteDetailTab', temp.id);
          this.$emit('deleteJob', true);
        })
        .then(() => {});
    },

    // 开关
    changeSwitch(temp) {
      temp.triggerStatus === 1
        ? handlerStart.call(this, temp)
        : handlerStop.call(this, temp);
    },

    // 注册节点
    loadById(row) {
      loadById.call(this, row);
    },

    // 下次触发时间
    nextTriggerTime(row) {
      nextTriggerTime.call(this, row);
    },

    // 编辑
    handlerUpdate(row) {
      row.childJobId = row.childJobId?.join?.(',');
      handlerUpdate.call(this, row);

      let jobParam = JSON.parse(row.jobParam);
      console.log('jobParam', jobParam);
      this.$store.commit('SET_READER_DATASOURCE_ID', jobParam.readerDatasourceId)

      this.$store.commit('SET_READER_TABLENAME', jobParam.readerTables[0])

      this.$store.commit('SET_SELECT_READERCOLUMN',jobParam.readerColumns)

      this.$store.commit('SET_WRITER_DATASOURCE_ID', jobParam.writerDatasourceId)

      this.$store.commit('SET_WRITER_TABLENAME', jobParam.writerTables[0])

      this.$store.commit('SET_SELECT_WRITERCOLUMN',jobParam.writerColumns)

      this.getColumns()

      this.getTables('rdbmsWriter')
    },

    // 实时更新日志
    logList() {
      const param = Object.assign({}, {
        current: 1,
        size: 10,
        jobGroup: 0,
        jobId: this.temp.id,
        logStatus: -1,
        filterTime: ''
      });
      let status = 0;

      log.getList(param).then((response) => {
        const {
          content
        } = response;

        const newestLog = content.data[0] || {};
        if (!newestLog?.executorAddress) {
          this.logList();
          return;
        }
        status = newestLog.handleCode;
        const triggerTime = Date.parse(newestLog?.triggerTime);
        log
          .viewJobLog(newestLog?.executorAddress, triggerTime, newestLog?.id, 1)
          .then((response) => {
            this.newstlogContent = response.content.logContent;
          })
          .then(() => {
            if (status === 0) {
              setTimeout(this.logList(), 1000);
            }
          });
      });
    },

    // schema列表
    async getSchemaList() {
      const schemaList = await getTableSchema({
        datasourceId: this.temp.datasourceId
      });
      this.schemaList = schemaList;
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getExecutor() {
      job.getExecutorList().then((response) => {
        const {
          content
        } = response;
        this.executorList = content;
        console.log('this.executorList', content);
      });
    },
    getJobIdList() {
      job.getJobIdList().then((response) => {
        const {
          content
        } = response;
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
        console.log('this.dataSourceList', this.dataSourceList);
      });
    },
    fetchData() {
      this.listLoading = true;
      this.listQuery.projectIds = this.$store.state.taskAdmin.projectId;
      job.getList(this.listQuery).then((response) => {
        const {
          content
        } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;

        this.$store.commit('SET_TASKLIST', this.list)
      });
    },
    incStartTimeFormat(vData) {},
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },

    updateData() {
      this.$store.commit('SET_SELECT_WRITERCOLUMN',this.readerForm.rcolumns);
      this.$store.commit('SET_SELECT_READERCOLUMN',this.readerForm.lcolumns);
      let jobParam = {
                  "readerDatasourceId": this.$store.state.taskAdmin.readerDataSourceID,
                  "readerTables": [this.$store.state.taskAdmin.readerTableName],
                  "readerColumns": this.$store.state.taskAdmin.selectReaderColumn,
                  "writerDatasourceId": this.$store.state.taskAdmin.writerDataSourceID,
                  "writerTables": [this.$store.state.taskAdmin.writerTableName],
                  "writerColumns": this.$store.state.taskAdmin.selectWriterColumn,
                  "transformer": [""],
                  "hiveReader": {},
                  "hiveWriter": {},
                  "rdbmsReader": {
                    "readerSplitPk": "",
                    "whereParams": "",
                    "querySql": ""
                  },
                  "rdbmsWriter": {
                    "preSql": "",
                    "postSql": ""
                  },
                  "hbaseReader": {},
                  "hbaseWriter": {},
                  "mongoDBReader": {},
                  "mongoDBWriter": {}
                }
      
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
        const tabName = this.temp.id;
        if (valid) {
          if (this.temp.childJobId) {
            const auth = [];
            for (const i in this.temp.childJobId) {
              auth.push(this.temp.childJobId[i].id);
            }
            this.temp.childJobId = auth.toString();
          }
          // this.temp.executorHandler =
          //   this.temp.glueType === "BEAN" ? "executorJobHandler" : "";
          this.temp.glueSource = this.glueSource;
          if (this.partitionField) {
            this.temp.partitionInfo =
                            this.partitionField +
                            ',' +
                            this.timeOffset +
                            ',' +
                            this.timeFormatType;
          }
          this.temp.jobParam = JSON.stringify(jobParam);
          job.updateJob(this.temp).then(() => {
            this.fetchData();
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            });
            // this.$emit("deleteDetailTab", tabName);
            // this.$emit("deleteJob");
          });
        }
      });
    },

    viewJson() {
      this.jsonshow = !this.jsonshow
      if(this.showLog){
        this.showLog = false;
      }
    },

    showRunLogDetails(){
      this.showLog=!this.showLog;
      if(this.jsonshow){
        this.jsonshow=false;
      }
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
            datasourceId: this.$store.state.taskAdmin.writerDataSourceID
          }
        }
        // 组装
        dsQueryApi.getTables(obj).then(response => {
          this.wTbList = response
        })
      }
    },
    // 获取表字段
    getColumns() {
      const obj = {
        datasourceId: this.$store.state.taskAdmin.writerDataSourceID,
        tableName: this.$store.state.taskAdmin.writerTableName
      }
      dsQueryApi.getColumns(obj).then(response => {
        this.fromColumnList = response
        this.writerForm.columns = response
        this.writerForm.checkAll = true
        this.writerForm.isIndeterminate = false

        this.$store.commit('SET_WRITER_COLUMNS', response);
        
        this.readerForm.rcolumns = response;
        this.toColumnsList = response;

        console.log(response);

      })
    },

   
   
    lHandleSelect(index, v) {
      
    },
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {
      console.log(index, v)
    },


    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1)
      this.toColumnsListChecked.splice(index, 1)

      this.readerForm.lcolumns.splice(index, 1)
      this.readerForm.rcolumns.splice(index, 1)
      this.tableData.splice(index, 1)
    },



    getLColumns() {
      return this.readerForm.lcolumns
    },
    getRColumns() {
      return this.readerForm.rcolumns
    },
    getRules() {
      return this.readerForm.rules
    }

    

  },
  watch: {
    'writerForm.datasourceId': function(oldVal, newVal) {
      this.getTables('rdbmsWriter')
    },

    fromColumnsListChecked(newval) {
      const arr = []
      newval.forEach((element, index) => {
        const obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index: index
        }
        arr.push(obj)
      })
      this.$store.commit('SET_TABLEDATA', arr)
    },

    readerColumns(newval) {
      console.log('newval', newval);
      this.readerForm.lcolumns = JSON.parse(JSON.stringify(newval));
      this.fromColumnsList = newval;
      this.tableData = [];
      newval.forEach((row, index) =>{
        let obj = {
          column: row,
          index
        }
        this.tableData.push(obj);
      })
    },

    writerColumns(newval) {
      this.readerForm.rcolumns = JSON.parse(JSON.stringify(newval));
      this.toColumnsList = newval;
    }

  }
};
</script>

<style scoped>
.header {
    overflow: hidden;
    padding: 8px 0;
    border-bottom: 1px solid rgba(235, 235, 235, 1);
}

.header_action {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    line-height: 20px;
    float: left;
    cursor: pointer;
}

.header_action:not(:first-child) {
    margin-left: 32px;
}

.header_action span {
    margin-left: 4px;
}

.header_switch {
    float: right;
}

.content {
    padding: 0 16px 16px;
}

.title {
    margin-top: 31px;
}

.task_img {
    width: 21px;
}

.jobDesc {
    font-size: 24px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
    color: #333333;
    line-height: 33px;
    margin-left: 10px;
}

.edit {
    float: right;
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    color: #3D5FFF;
    height: 33px;
    line-height: 33px;
    cursor: pointer;
}

.detail {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
}

.detail .key {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
}

.detail .value {

    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    line-height: 20px;
}

.detail_target {
    width: 50%;
    padding: 8px;
    /* background: red; */
}

.json_title {
    font-size: 14px;
    font-family: PingFangHK-Regular, PingFangHK;
    font-weight: 400;
    color: #3D5FFF;
    line-height: 20px;
    padding: 8px;
    cursor: pointer;
}

.json_content>>>.CodeMirror {
    background: white;
    color: #333333;
}

.json_content>>>.CodeMirror-gutters {
    background: #F8F8FA;
    border: none;
}

.json_content>>>.CodeMirror-lint-markers {
    width: 0;
}

.json_content>>>.CodeMirror-linenumber {
    color: rgba(102, 102, 102, 1);
    left: 0 !important;
    /* width: 44px !important; */
}

.job_detail {
    position: relative;
}

.log_detail {
    width: 100%;
    background: #F8F8FA;
    border: 2px solid #F8F8FA;
    border-left: none;
    position: absolute;
    bottom: 0
}

.log_title {
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
    color: #333333;
    /* background: white; */
}

.log_log {
    background: white;
    display: inline-block;
    padding: 0 24px;
}

.log_container {
    padding-left: 24px;
    height: 240px;
    overflow: scroll;
    background: white;
    font-size: 13px;
}

.unflod {
    color: black;
    float: right;
    cursor: pointer;
    margin-right: 10px;
}

.fade-enter-active,
.fade-leave-active {
    transition: height .5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */
    {
    height: 0;
}

.log_detail_window >>> .el-dialog {
    border-radius: 8px;
}

.log_detail_window >>> .el-dialog__body {
    padding: 20px 40px;
}
</style>
