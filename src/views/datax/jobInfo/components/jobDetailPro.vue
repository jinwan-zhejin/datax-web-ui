<!--
 * @Date: 2021-02-02 17:38:54
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-03-01 14:49:47
 * @FilePath: \datax-web-ui\src\views\datax\jobInfo\components\jobDetailPro.vue
 * @Description: jobDetail任务详情改版
-->

<template>
  <div class="job_detail">
    <!-- action面板 -->
    <div class="header">
      <div
        class="header_action"
        style="margin-left:17px;"
        @click="handlerExecute(currentTask)"
      >
        <i class="el-icon-video-play" />
        <span style="font-size: 13px;">执行</span>
      </div>
      <div
        v-if="jobType('DQCJOB')"
        class="header_action"
        @click="handlerViewResult(currentTask)"
      >
        <i class="el-icon-search" />
        <span style="font-size: 13px;">查看结果</span>
      </div>
      <div class="header_action" @click="handlerViewLog(currentTask)">
        <i class="el-icon-s-order" />
        <span style="font-size: 13px;">日志</span>
      </div>
      <div class="header_action">
        <el-popover placement="bottom" width="500" @show="loadById(currentTask)">
          <el-table :data="registerNode">
            <el-table-column width="150" property="title" label="执行器名称" />
            <el-table-column width="150" property="appName" label="appName" />
            <el-table-column
              width="150"
              property="registryList"
              label="机器地址"
            />
          </el-table>
          <div slot="reference" style="float: left">
            <i class="el-icon-s-tools" />
            <span style="font-size: 13px;">注册节点</span>
          </div>
        </el-popover>
      </div>
      <div class="header_action">
        <el-popover
          placement="bottom"
          width="300"
          @show="nextTriggerTime(currentTask)"
        >
          <h5 v-html="triggerNextTimes" />
          <div slot="reference" style="float: left">
            <i class="el-icon-message-solid" />
            <span style="font-size: 13px;">下次触发</span>
          </div>
        </el-popover>
      </div>
      <div
        class="header_action"
        @click="showJobSchedule"
      >
        <i class="el-icon-s-marketing" />
        <span style="font-size: 13px;">任务调度</span>
      </div>

      <!-- <div class="header_action" @click="handlerDelete(currentTask)">
        <i class="el-icon-delete-solid" />
        <span style="font-size: 13px;">删除</span>
      </div> -->
      <!-- <div class="header_action" @click="showEdit(currentTask)">
        <i class="el-icon-delete-solid" />
        <span style="font-size: 13px;">测试编辑</span>
      </div> -->

      <div class="header_switch" style="margin-right:10px;">
        <el-switch
          v-model="currentTask.triggerStatus"
          active-color="#00A854"
          active-text="上线"
          :active-value="1"
          inactive-color="#F04134"
          inactive-text="下线"
          :inactive-value="0"
          @change="changeSwitch(currentTask)"
        />
      </div>
    </div>
    <el-drawer
      ref="drawer"
      title="任务调度"
      :visible.sync="scheduleShow"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div style="padding: 15px 15px 0 15px; height: calc(100vh - 180px); overflow-y: auto;">
        <el-form ref="scheduleForm" :model="scheduleForm" :rules="scheduleRules">
          <el-form-item label="执行器" prop="executor">
            <el-select v-model="scheduleForm.executor" placeholder="请选择执行器">
              <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="JobCron" prop="cron">
            <el-input v-model="scheduleForm.cron" placeholder="请输入Cron表达式">
              <el-button v-if="!showCronBox" slot="append" icon="el-icon-turn-off" title="打开图形配置" @click="showCronBox = true" />
              <el-button v-else slot="append" icon="el-icon-open" title="关闭图形配置" @click="showCronBox = false" />
            </el-input>
            <el-dialog
              title="JobCron"
              :visible.sync="showCronBox"
              width="60%"
              append-to-body
            >
              <cron v-model="scheduleForm.cron" />
              <span slot="footer" class="dialog-footer">
                <el-button @click="showCronBox = false;">关闭</el-button>
                <el-button type="primary" @click="showCronBox = false">确 定</el-button>
              </span>
            </el-dialog>
          </el-form-item>
          <el-form-item label="阻塞处理" prop="blockStrategy">
            <el-select v-model="scheduleForm.blockStrategy" placeholder="请选择阻塞处理策略">
              <el-option v-for="item in blockStrategies" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="路由策略" prop="routeStrategy">
            <el-select v-model="scheduleForm.routeStrategy" placeholder="请选择路由策略">
              <el-option v-for="item in routeStrategies" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="子任务" prop="subTask">
            <el-select v-model="scheduleForm.subTask" multiple placeholder="子任务" @change="selectChange">
              <el-option v-for="item in jobIdList" :key="item.id" :label="item.jobDesc" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="报警邮件" prop="alarmEmail">
            <el-input v-model="scheduleForm.alarmEmail" placeholder="输入报警邮件" />
          </el-form-item>
          <el-form-item label="失败重试次数" prop="retry">
            <br>
            <el-input-number v-model="scheduleForm.retry" :min="0" />
          </el-form-item>
          <el-form-item label="超时时间" prop="timeout">
            <br>
            <el-input-number v-model="scheduleForm.timeout" :min="0" />（分钟）
          </el-form-item>
        </el-form>
      </div>
      <el-divider />
      <div class="demo-drawer__footer" style="text-align: center;">
        <el-button class="drawer-btn-temp" @click="closeScheduleForm('scheduleForm')">取消</el-button>
        <el-button class="drawer-btn-temp" @click="resetScheduleForm('scheduleForm')">重置</el-button>
        <el-button class="drawer-btn-temp" type="primary" @click="submitScheduleForm('scheduleForm')">提交</el-button>
      </div>
    </el-drawer>
    <!-- gojs任务联系 -->
    <div class="taskRelation">
      <div
        :id="'myDiagramDiv' + myId"
        style="flex-grow: 1; height: calc(50vh);"
      />
    </div>
    <!-- 任务详情面板 -->
    <el-tabs
      v-model="detailActiveName"
      type="border-card"
      class="el-bar-tab"
    >
      <el-tab-pane label="任务详情" name="detail">
        <description class="detail_container">
          <template slot="title">
            <svg-icon
              v-if="currentTask.jobType !== 'IMPORT'"
              :icon-class="currentTask.jobType"
            />
            <svg
              v-else
              id="Layer_1"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="3px"
              width="15px"
              height="15px"
              style="margin-right: 3px"
              viewBox="0 3 15 15"
              enable-background="new 0 3 15 15"
              xml:space="preserve"
            >  <image
              id="image0"
              width="15"
              height="15"
              x="0"
              y="6"
              href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAXVBMVEX/////kUj/kkj/kUj/
lUr/i0b/k0b/kkf/kkf/kEf/k0f/k0b/kkf/kkf/kUj/kkf/kEj/lEf/kUf/kUf/kUj/j0f/kUb/
k0j/kkf/lkv/kUj/kUf//wD/kUf///+LAJe9AAAAHXRSTlMAw9mjGAtQcP7pYUnnto7pYzLrQaQZ
smrwEeTaAcB/ix4AAAABYktHRACIBR1IAAAAB3RJTUUH5QIFADcDzk1yTQAAAE1JREFUGNNjYCAD
MMoiAUaggCyyrCw2ASYQg5kFIcDAwMrGzsHJhRDg5uHlk+UXgAsICgkzMIiIIrSIiaMZKiGJJiDF
wCCN4jAZUr0GALWzBTkD4ue4AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAyLTA0VDE2OjU1OjAz
KzA4OjAw5fkjmwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMi0wNFQxNjo1NTowMyswODowMJSk
mycAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1
bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABd0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTYd
r15vAAAAFnRFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADE25QCe4gAAABl0RVh0VGh1bWI6Ok1pbWV0
eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjEyNDI4OTAz6wc9eAAAABF0
RVh0VGh1bWI6OlNpemUAMjk4QkK3drNWAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3Rt
cC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYwOTkwMzUxMTcyMzMzODZfNDNfWzBdxZFLGAAAAABJRU5E
rkJggg=="
            />
            </svg>
            <span class="jobDesc">{{ currentTask.jobDesc }}</span>
          </template>
          <template slot="action">
            <el-button
              v-show="this.$store.state.taskAdmin.jobDataDetail.jobType === 'IMPORT' || this.$store.state.taskAdmin.jobDataDetail.jobType === 'NORMAL' || this.$store.state.taskAdmin.jobDataDetail.jobType === 'EXPORT'"
              type="text"
              icon="el-icon-edit"
              @click="showEdit(currentTask)"
            >编辑</el-button>
          </template>
          <template slot="context">
            <!-- <description-items keys="执行器" :values="jobGroupName" /> -->
            <description-items keys="所属项目" :values="projectName" />
            <!-- <description-items
              v-if="showProjectName"
              keys="路由策略"
              :values="currentTask.executorRouteStrategy"
            /> -->
            <!-- <description-items keys="子任务" :values="hasVal(childJob, 'jobDesc')" /> -->
            <!-- <description-items
              v-if="showProjectName"
              keys="阻塞处理"
              :values="currentTask.executorBlockStrategy"
            /> -->
            <description-items keys="任务名称" :values="currentTask.jobDesc" />
            <description-items keys="任务类型" :values="currentTask.jobType" />
            <!-- <description-items keys="Cron" :values="currentTask.jobCron" /> -->
            <!-- <description-items keys="报警邮件" :values="currentTask.alarmEmail" /> -->
            <!-- <description-items
              keys="失败重试次数"
              :values="currentTask.executorFailRetryCount"
            /> -->
            <!-- <description-items keys="超时时间" :values="currentTask.executorTimeout" /> -->
            <description-items keys="JVM启动参数" :values="currentTask.jvmParam" />
            <description-items
              v-if="jobType('SQLJOB')"
              keys="Schema"
              :values="currentTask.schema"
            />
          </template>
        </description>
      </el-tab-pane>
      <el-tab-pane label="查看JSON" name="json">
        <div class="json_content">
          <json-editor
            ref="jsonEditor"
            :value="jsons"
            cani-edit="nocursor"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务日志" name="log">
        <div class="log_container">
          <pre v-text="newstlogContent" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      width="75%"
      class="log_detail_window"
      title="日志信息"
      :visible.sync="logview"
    >
      <jobLog :id="jobId" ref="jobLog" />
    </el-dialog>

    <el-dialog width="75%" title="结果查看" :visible.sync="resultView">
      <job-result :id="jobId" ref="jobResult" />
    </el-dialog>

    <job-detail-pro-edit
      :show="editPanelShow"
      :title="'编辑任务：' + currentTask.jobDesc + ' ( ' + projectName + ' )'"
      :job-id="editPanelId"
      @close="closeEdit"
      @fetchData="fetchData"
    />
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query';
import * as infoApi from '@/api/datax-job-info';
// logApi
import { getList as logGetList, viewJobLog } from '@/api/datax-job-log';
import waves from '@/directive/waves'; // waves directive
import Cron from '@/components/Cron';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import JsonEditor from '@/components/JsonEditor';
import ShellEditor from '@/components/ShellEditor';
import PythonEditor from '@/components/PythonEditor';
import PowershellEditor from '@/components/PowershellEditor';
import { getDataSourceList } from '@/api/datax-jdbcDatasource';
import { getJobProjectList } from '@/api/datax-job-project';
import { updateJob } from '@/api/datax-job-info';
import reader from '@/views/datax/json-build/reader';
import writer from '@/views/datax/json-build/writer';
import qualityReader from '../../jsonQuality/reader';
import qualityWriter from '../../jsonQuality/writer';
import mapper from '@/views/datax/json-build/mapper';
import { isJSON } from '@/utils/validate';
import jobLog from './jobLog';
import jobResult from './jobResult';
import { getTableSchema } from '@/api/metadata-query';

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
import { translaterMaster } from '@/utils/dictionary';
import Description from '@/components/Description/index';
import DescriptionItems from '@/components/Description/components/items';
import go from 'gojs';
import JobDetailProEdit from './editDialog/jobDetailProEdit';

let timer = null

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
    jobResult,
    reader,
    writer,
    qualityReader,
    qualityWriter,
    mapper,
    Description,
    DescriptionItems,
    JobDetailProEdit
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
  props: {
    jobInfo: { type: Object, default: () => ({}) }
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
      tableData: [],
      mapperJson: {},
      fromColumnsList: [],
      fromColumnsListChecked: [],
      toColumnsList: [],
      toColumnsListChecked: [],
      ruleSettings: [],
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
      }, // 任务调度参数
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
      readerForm: {
        lcolumns: [],
        rcolumns: [],
        rules: [],
        lcheckAll: false,
        rcheckAll: false,
        isIndeterminate: true
      },
      /** 数据库-表-列 */
      fromColumnList: [],
      wTbList: [],
      writerForm: {
        checkAll: false,
        isIndeterminate: true,
        ifCreateTable: false
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
      /** 任务列表 */
      list: [],
      listLoading: true,
      total: 0,
      schemaList: [],
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
      /** 编辑dialog显示 */
      editPanelShow: false,
      /** 传到编辑页面的ID */
      editPanelId: 0,
      dialogStatus: '',
      rules: {
        jobGroup: [
          { required: true, message: 'jobGroup is required', trigger: 'change' }
        ],
        executorRouteStrategy: [
          { required: true, message: 'executorRouteStrategy is required', trigger: 'change' }
        ],
        executorBlockStrategy: [
          { required: true, message: 'executorBlockStrategy is required', trigger: 'change' }
        ],
        glueType: [
          { required: true, message: 'jobType is required', trigger: 'change' }
        ],
        projectId: [
          { required: true, message: 'projectId is required', trigger: 'change' }
        ],
        jobDesc: [
          { required: true, message: 'jobDesc is required', trigger: 'blur' }
        ],
        jobProject: [
          { required: true, message: 'jobProject is required', trigger: 'blur' }
        ],
        jobCron: [
          { required: true, message: 'jobCron is required', trigger: 'blur' }
        ],
        incStartId: [
          { trigger: 'blur', validator: validateIncParam }
        ],
        replaceParam: [
          { trigger: 'blur', validator: validateIncParam }
        ],
        primaryKey: [
          { trigger: 'blur', validator: validateIncParam }
        ],
        incStartTime: [
          { trigger: 'change', validator: validateIncParam }
        ],
        replaceParamType: [
          { trigger: 'change', validator: validateIncParam }
        ],
        partitionField: [
          { trigger: 'blur', validator: validatePartitionParam }
        ],
        datasourceId: [
          { trigger: 'change', validator: validateIncParam }
        ],
        readerTable: [
          { trigger: 'blur', validator: validateIncParam }
        ]
      },
      currentTask: {
        id: undefined,
        jobGroup: '',
        jobCron: '',
        jobDesc: '',
        executorRouteStrategy: '',
        executorBlockStrategy: '',
        childJobId: '',
        childJobIdArr: '',
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
        readerTable: '',
        jobType: ''
      },
      executorList: [],
      jobIdList: '',
      jobProjectList: '',
      dataSourceList: '',
      triggerNextTimes: '',
      registerNode: [],
      jobJson: '',
      glueSource: '',
      timeOffset: 0,
      timeFormatType: 'yyyy-MM-dd',
      partitionField: '',
      dataSource: '',
      resultView: false, // 结果查看
      /** 折叠面板激活项 */
      collapseActiveName: 'result',
      /** gojs面板 */
      myDiagram: '',
      /** 任务Id */
      myId: '',
      jsons: '',
      stop_start_name: '上线',
      scheduleForm: {
        cron: '',
        blockStrategy: '',
        alarmEmail: '',
        executor: '',
        retry: 0,
        timeout: 0,
        routeStrategy: '',
        subTask: []
      },
      scheduleRules: {
        executor: [
          { required: true, message: '请选择执行器', trigger: 'change' }
        ],
        cron: [
          { required: true, message: '请输入Cron表达式', trigger: 'blur' }
        ],
        blockStrategy: [
          { required: false, message: '请选择阻塞处理策略', trigger: 'change' }
        ],
        alarmEmail: [
          { required: false, message: '请输入报警邮箱', trigger: 'blur' }
        ],
        retry: [
          { required: true, message: '请输入失败重试次数', trigger: 'blur' }
        ],
        timeout: [
          { required: true, message: '请输入超时时间', trigger: 'blur' }
        ],
        routeStrategy: [
          { required: false, message: '请选择路由策略', trigger: 'change' }
        ],
        subTask: [
          { required: false, message: '请选择子任务', trigger: 'change' }
        ]
      },
      scheduleShow: false,
      detailActiveName: 'detail'
    };
  },

  computed: {
    /** 判断当前任务类型 */
    jobType() {
      return type => {
        return this.jobInfo.jobType === type;
      };
    },

    /** 执行器 */
    jobGroupName() {
      return this.executorList.find(
        element => element.id === this.currentTask.jobGroup
      )?.title;
    },

    /** 所属项目名称 */
    projectName() {
      const t = this.$store.state.project.currentItem;
      const i = this.$store.state.project.currentItem.indexOf('/');
      if (i > -1) {
        return t.substring(i + 1, t.length);
      }
      return t;
    },

    /** 子任务对象 */
    childJob() {
      const t = typeof this.currentTask.childJobId === 'string'
      if (t) {
        const a = this.currentTask.childJobId.split(',')
        const b = []
        for (const aa of a) {
          const c = this.$store.state.taskAdmin.taskList.find(ele => ele.id === parseInt(aa))
          if (c) {
            b.push(c)
          }
        }
        return b
      } else {
        return [this.$store.state.taskAdmin.taskList.find(ele => ele.id === this.currentTask.childJobId)]
      }
    },

    /** 值不为空 */
    isVal() {
      return val => {
        return val !== '' && val !== undefined && val !== null
      }
    },

    jobParam() {
      return JSON.parse(this.jobInfo.jobParam);
    },

    ruleArr() {
      return this.readerForm.rules;
    },

    readerColumns() {
      return this.$store.state.taskAdmin.selectReaderColumn;
    },

    writerColumns() {
      return this.$store.state.taskAdmin.writerColumns;
    },

    /**
     * @description: 查找sets中某一项的attr属性与item相同，若有则返回sets中某一项的distAttr属性值
     * @param {String} item
     * @param {array} sets
     * @param {String} attr
     * @param {String} distAttr
     * @returns {String}
     */
    finder() {
      return (item, sets, attr, distAttr) => {
        let t = '';
        if (sets) {
          t = sets.find(ele => ele[attr] === item);
        }
        if (!t) {
          return '';
        }
        return t[distAttr];
      };
    },

    /** res中是否有属性item */
    hasVal() {
      return (res, item) => {
        if (res) {
          if (res.hasOwnProperty(item)) {
            return res[item];
          } else {
            return '';
          }
        } else {
          return '';
        }
      };
    },

    jsonString() {
      return JSON.parse(this.currentTask.jobJson);
    },

    /** 是否为普通、引入、导出、SHELL、POWERSHELL、PYTHON任务 */
    showProjectName() {
      return (
        this.jobType === 'NORMAL' ||
        this.jobType === 'IMPORT' ||
        this.jobType === 'EXPORT' ||
        this.jobType === 'SHELL' ||
        this.jobType === 'POWERSHELL' ||
        this.jobType === 'PYTHON'
      );
    },

    /** 唯一标识码 */
    guid() {
      return 'xxxxxxxxxxxxxxxxxxx'
        .concat(new Date().valueOf().toString())
        .replace(/[xy]/g, function(c) {
          var r = (Math.random() * 16) | 0;
          var v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
    },

    hasSchema() {
      return this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
    }
  },

  watch: {

    fromColumnsListChecked(newval) {
      const arr = [];
      newval.forEach((element, index) => {
        const obj = {
          sourceField: this.readerForm.lcolumns[index],
          clearRule: this.readerForm.rules[index],
          targetField: this.readerForm.rcolumns[index],
          index: index
        };
        arr.push(obj);
      });
      this.$store.commit('SET_TABLEDATA', arr);
    },

    readerColumns(val) {
      console.log('val', val);
      this.readerForm.lcolumns = JSON.parse(JSON.stringify(val));
      this.fromColumnsList = val;
      this.tableData = [];
      val.forEach((row, index) => {
        const obj = {
          column: row,
          index
        };
        this.tableData.push(obj);
      });
    },

    writerColumns(val) {
      this.readerForm.rcolumns = JSON.parse(JSON.stringify(val));
      this.toColumnsList = val;
    },

    'currentTask.triggerStatus'(val) {
      if (val === 1) {
        this.stop_start_name = '上线'
      } else {
        this.stop_start_name = '下线'
      }
    },

    detailActiveName(val) {
      if (val === '' || val === undefined || val === null) {
        this.detailActiveName = 'detail';
      } else if (val === 'json') {
        this.jsons = this.jsonString
      }
    },

    /**
     * @description: 等待trigger执行完再获取log列表
     */
    '$store.state.taskAdmin.logWatch'(val) {
      timer = setInterval(() => {
        this.logList()
      }, 1000)
    }
  },

  created() {
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList();
    this.currentTask = this.jobInfo;
    this.myId = this.guid;
    this.temp = this.$store.state.taskAdmin.jobDataDetail
  },
  mounted() {
    this.initGoJs();
  },
  beforeDestroy() {
    clearInterval(timer)
    timer = null
  },

  methods: {
    getReaderData() {
      return this.$refs.reader.getData();
    },

    showJobSchedule() {
      this.scheduleForm.cron = this.$store.state.taskAdmin.jobDataDetail.jobCron
      this.scheduleForm.timeout = this.$store.state.taskAdmin.jobDataDetail.executorTimeout
      this.scheduleForm.alarmEmail = this.$store.state.taskAdmin.jobDataDetail.alarmEmail
      this.scheduleForm.blockStrategy = this.$store.state.taskAdmin.jobDataDetail.executorBlockStrategy
      if (this.$store.state.taskAdmin.jobDataDetail.childJobId) {
        this.scheduleForm.subTask = this.$store.state.taskAdmin.jobDataDetail.childJobId.split(',')
        const childarr = []
        for (let i = 0; i < this.scheduleForm.subTask.length; i++) {
          childarr.push(parseInt(this.scheduleForm.subTask[i]))
        }
        this.scheduleForm.subTask = childarr
        console.log(childarr, 'childarr')
      }
      this.scheduleForm.retry = this.$store.state.taskAdmin.jobDataDetail.executorFailRetryCount
      this.scheduleForm.routeStrategy = this.$store.state.taskAdmin.jobDataDetail.executorRouteStrategy // 路由
      this.scheduleForm.executor = this.$store.state.taskAdmin.jobDataDetail.jobGroup // 执行器
      this.scheduleShow = true
    },

    selectChange(val) {
      console.log(val, 'val')
      this.scheduleForm.subTask = val
      this.temp.childJobId = ''
      console.log(this.temp.childJobId, '1')
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          if (i === 0) {
            this.temp.childJobId = val[i]
          } else {
            this.temp.childJobId += ',' + val[i]
          }
        }
      } else {
        this.temp.childJobId = ''
      }
      console.log(this.temp.childJobId, '2')
      console.log(this.temp, 'console.log(this.temp)')
    },

    /**
     * @description: 执行一次
     * @param {object} taskInfo
     */
    handlerExecute(taskInfo) {
      handlerExecute.call(this, taskInfo).then(response => {
        this.newstlogContent = '';
        this.showLog = true;
        this.jsonshow = false;
      });
    },

    /**
     * @description: 查看结果
     */
    handlerViewResult(taskInfo) {
      this.resultView = true;
      this.jobId = taskInfo.id;
      this.$refs.jobResult?.fetchData();
    },

    /**
     * @description: 查看日志
     */
    handlerViewLog(taskInfo) {
      // handlerViewLog.call(this, taskInfo);
      this.jobId = taskInfo.id;
      this.$store.commit('SET_LOGVIEW_TYPE', 0);
      this.logview = true;
      // console.log(taskInfo);
      this.$refs.jobLog?.fetchData();
    },

    /**
     * @description: 删除
     */
    handlerDelete(taskInfo) {
      handlerDelete
        .call(this, taskInfo)
        .then(() => {
          this.$emit('deleteDetailTab', taskInfo.id);
          this.$emit('deleteJob', true);
        })
        .then(() => {});
    },

    /**
     * @description: 启停
     */
    changeSwitch(taskInfo) {
      console.log(this.currentTask.triggerStatus, 'currentTask.triggerStatus')
      // if (this.currentTask.triggerStatus === 1) {
      //   this.stop_start_name = '上线'
      // } else {
      //   this.stop_start_name = '下线'
      // }
      taskInfo.triggerStatus === 1
        ? handlerStart.call(this, taskInfo)
        : handlerStop.call(this, taskInfo);
    },

    /**
     * @description: 注册节点
     */
    loadById(row) {
      loadById.call(this, row);
    },

    /**
     * @description: 下次触发时间
     */
    nextTriggerTime(row) {
      nextTriggerTime.call(this, row);
    },

    /**
     * @description: 实时更新日志
     */
    logList() {
      const param = {
        current: 1,
        size: 10,
        jobGroup: 0,
        jobId: this.currentTask?.id,
        logStatus: -1,
        filterTime: ''
      }
      let status = 0;

      logGetList(param).then(response => {
        const newestLog = response.content.data[0] || {};
        if (!newestLog?.executorAddress) {
          return;
        }
        status = newestLog.handleCode;
        /** 触发时间 */
        const triggerTime = new Date().getTime(newestLog?.triggerTime);
        /** 获取日志详情 */
        viewJobLog(newestLog?.executorAddress, triggerTime, newestLog?.id, 1)
          .then(response => {
            this.newstlogContent = response.content.logContent;
            if (status !== 0) {
              clearInterval(timer)
              timer = null
            }
          })
      });
    },

    /**
     * @description: 获取执行器列表
     */
    getExecutor() {
      infoApi.getExecutorList().then(response => {
        const { content } = response;
        this.executorList = content;
        console.log(this.executorList, 'this.executorList')
      });
    },
    /**
     * @description: 获取所有任务列表
     */
    getJobIdList() {
      infoApi.getJobIdList().then(response => {
        const { content } = response;
        this.jobIdList = content;
        console.log(this.jobIdList, '子任务');
      });
    },

    /**
     * @description: 获取项目列表
     */
    getJobProject() {
      getJobProjectList().then(response => {
        this.jobProjectList = response;
      });
    },

    /**
     * @description: 获取数据源列表
     */
    getDataSourceList() {
      getDataSourceList().then(response => {
        this.dataSourceList = response;
      });
    },

    fetchData() {
      this.listLoading = true;
      this.listQuery.projectIds = this.$store.state.taskAdmin.projectId;
      infoApi.getList(this.listQuery).then(response => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
        this.$store.commit('SET_TASKLIST', this.list);
        const t = this.list.filter(
          item => item.id === this.$store.state.taskAdmin.jobInfo.id
        );
        this.$store.commit('SET_JOB_INFO', t[0]);
      });
    },
    incStartTimeFormat(vData) {},

    updateData() {

    },

    viewJson() {
      this.jsonshow = !this.jsonshow;
      if (this.showLog) {
        this.showLog = false;
      }
    },

    showRunLogDetails() {
      this.showLog = !this.showLog;
      if (this.jsonshow) {
        this.jsonshow = false;
      }
    },

    lHandleSelect(index, v) {},
    cHandleSelect(index, v) {},
    rHandleSelect(index, v) {
      console.log(index, v);
    },

    bHandleClick(index, v) {
      this.fromColumnsListChecked.splice(index, 1);
      this.toColumnsListChecked.splice(index, 1);

      this.readerForm.lcolumns.splice(index, 1);
      this.readerForm.rcolumns.splice(index, 1);
      this.tableData.splice(index, 1);
    },

    getLColumns() {
      return this.readerForm.lcolumns;
    },
    getRColumns() {
      return this.readerForm.rcolumns;
    },
    getRules() {
      return this.readerForm.rules;
    },
    exStatus(param) {
      param = !param;
    },
    translaterMaster,
    /**
     * @description: 点击Schema触发表改变
     */
    schemaChange() {
      this.getTables('rdbmsWriter');
    },
    /**
     * @description: 重置当前展示任务
     */
    resetCurrentTask() {
      this.currentTask = this.$options.data().currentTask;
      this.jobJson = '';
      this.glueSource = '';
      this.timeOffset = 0;
      this.timeFormatType = 'yyyy-MM-dd';
      this.partitionField = '';
    },
    /**
     * @description: 初始化gojs
     */
    initGoJs() {
      var $ = go.GraphObject.make; // 构建
      this.myDiagram = $(
        go.Diagram,
        'myDiagramDiv' + this.myId, // create a Diagram for the DIV HTML element
        {
          'undoManager.isEnabled': true // enable undo & redo
        }
      );
      /** 右键面板 */
      const myContextMenu = $(
        'ContextMenu',
        $(
          'ContextMenuButton',
          $(go.TextBlock, '查看详情', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.checkInfo(obj);
            }
          }
        ),
        $(
          'ContextMenuButton',
          $(go.TextBlock, this.stop_start_name + '/下线', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.online(obj);
            }
          }
        ),
        $(
          'ContextMenuButton',
          $(go.TextBlock, '删除', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.deleteTask(obj);
            }
          }
        ),
        $(
          'ContextMenuButton',
          $(go.TextBlock, '查看任务操作日志', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.checkLog(obj);
            }
          }
        ),
        $(
          'ContextMenuButton',
          $(go.TextBlock, '编辑任务属性', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.editTask(obj);
            }
          }
        ),
        $(
          'ContextMenuButton',
          $(go.TextBlock, '导出任务', {
            alignment: go.Spot.Center,
            margin: 5,
            font: '12px sans-serif',
            opacity: 0.75,
            stroke: '#404040'
          }),
          {
            click: (e, obj) => {
              this.exportTask(obj);
            }
          }
        )
      );
      // define a simple Node template
      this.myDiagram.nodeTemplate = $(
        go.Node,
        'Auto', // the Shape will go around the TextBlock
        { contextMenu: myContextMenu },
        $(
          go.Shape,
          'RoundedRectangle',
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color') // 在 model 的 nodes 中通过 color 属性来指定 Node 的 fill 属性
        ),
        $(
          go.TextBlock,
          { margin: 3 }, // some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding('text', 'text'),
          new go.Binding('key', 'key')
        )
      );
      const paramItem = [{ text: this.currentTask.jobDesc, key: this.currentTask.id, data: this.currentTask, color: 'lightblue' }];
      if (this.isVal(this.currentTask.childJobId)) {
        for (const i of this.childJob) {
          paramItem.push({
            text: this.hasVal(i, 'jobDesc'),
            key: parseInt(this.hasVal(i, 'id')),
            data: i,
            color: 'orange' });
        }
      }
      const paramLine = [];
      if (this.isVal(this.currentTask.childJobId)) {
        for (const i of this.childJob) {
          paramLine.push({
            from: this.currentTask.id,
            to: parseInt(this.hasVal(i, 'id'))
          })
        }
      }
      this.myDiagram.model = new go.GraphLinksModel(
        paramItem, paramLine
      )
    },
    /**
     * @description: 查看详情
     */
    checkInfo(obj) {
      this.currentTask = obj.part.data.data
      this.detailActiveName = 'detail'
    },
    /**
     * @description: 上线、下线
     */
    online(obj) {
      this.currentTask.triggerStatus = this.currentTask.triggerStatus === 0 ? 1 : 0
      this.changeSwitch(obj.part.data.data)
    },
    /**
     * @description: 删除任务
     */
    deleteTask(obj) {
      this.handlerDelete(obj.part.data.data);
    },
    /**
     * @description: 查看任务操作日志
     */
    checkLog(obj) {
      this.handlerViewLog(obj?.part.data.data);
    },
    /**
     * @description: 编辑任务属性
     */
    editTask(obj) {
      this.showEdit(obj?.part.data.data)
    },
    /**
     * @description: 导出任务
     */
    exportTask(obj) {
      console.log(obj.part.data);
    },
    /**
     * @description: 编辑
     */
    showEdit(currentTask) {
      console.log(currentTask);
      console.log(this.jobInfo.jobType, 'this.jobInfo.jobType')
      this.$store.commit('SET_JOBINFO_TYPE', this.jobInfo.jobType);
      this.editPanelId = currentTask.id
      this.editPanelShow = true
      console.log(this.editPanelId, 'this.editPanelId')
    },
    closeEdit() {
      this.editPanelShow = false
    },
    /**
     * @description: 提交调度参数修改
     */
    submitScheduleForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.temp.id = this.$store.state.taskAdmin.jobDataDetail.id
          this.temp.jobCron = this.scheduleForm.cron
          this.temp.executorTimeout = this.scheduleForm.timeout
          this.temp.alarmEmail = this.scheduleForm.alarmEmail
          this.temp.executorBlockStrategy = this.scheduleForm.blockStrategy
          console.log(this.temp.childJobId, 'this.temp.childJobId')
          this.temp.executorFailRetryCount = this.scheduleForm.retry
          this.temp.executorRouteStrategy = this.scheduleForm.routeStrategy
          this.temp.jobGroup = this.scheduleForm.executor
          console.log(this.temp)
          updateJob(this.temp).then((res) => {
            console.log(res, '任务调度。。。。')
            this.scheduleShow = false
            this.$store.commit('setScheduleId', this.temp.id)
            this.$notify({
              title: '成功',
              message: '调度修改成功',
              type: 'success',
              duration: 2000
            })
          }).catch((err) => {
            console.log(err)
          })
          console.log(this.scheduleForm)
          console.log(this.$store.state.taskAdmin.jobDataDetail, 'data')
        } else {
          return false;
        }
      })
    },
    resetScheduleForm(formName) {
      this.$refs[formName].resetFields();
      this.scheduleForm.cron = ''
    },
    closeScheduleForm(formName) {
      this.$refs[formName].resetFields();
      this.scheduleForm.cron = ''
      this.scheduleShow = false
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  overflow: hidden;
  padding: 10px 0;
  border-bottom: 1px solid rgba(215, 215, 215, 1);
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
  color: #3d5fff;
  height: 33px;
  line-height: 33px;
  cursor: pointer;
}

.detail {
  margin-top: 20px;
  padding: 8px;
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
.detail_col {
  padding: 8px;
}

.json_title {
  font-size: 14px;
  font-family: PingFangHK-Regular, PingFangHK;
  font-weight: 400;
  color: #3d5fff;
  line-height: 20px;
  padding: 8px;
  cursor: pointer;
}

.job_detail {
  position: relative;
  overflow: hidden;
  ::v-deep .el-drawer {
    width: 450px !important;
    .drawer-btn-temp {
      width: 28%;
    }
  }
}

.log_container {
  padding-left: 24px;
  height: calc(50vh - 157px);
  overflow: scroll;
  background: white;
  font-size: 13px;
}

.log_detail_window >>> .el-dialog {
  border-radius: 8px;
}

.log_detail_window >>> .el-dialog__body {
  padding: 20px 40px;
}

.detail_container {
  height: calc(50vh - 157px);
  overflow-y: auto;
}
</style>
<style lang="scss" scoped>
.el-dialog {
  h3 {
    font-size: 20px;
    font-family: PingFangHK-Medium, PingFangHK;
    margin: 22px 0;
    color: #333333;
    .el-button {
      position: relative;
      float: right;
      padding: 0;
      font-size: 16px;
      margin: 0 10px;
    }
  }
  .el-form {
    .info-detail {
      color: #333333;
      font-family: PingFangHK-Regular, PingFangHK;
    }
    .el-select {
      width: 100%;
    }
    .el-date-editor {
      width: 100%;
    }
  }
  .part-container {
    padding: 24px;
    background: #fff;
    margin: 0 24px;
  }
  .el-table {
    border: 1px solid #f3f3f3;
    >>> td {
      border-bottom: 1px solid #f3f3f3;
    }
    >>> th {
      border-bottom: 1px solid #f3f3f3;
    }
  }
}
>>> .el-dialog {
  margin-bottom: 15vh;
  .el-dialog__body {
    padding-top: 0;
  }
}
.form-item-class {
  >>> .el-form-item__label {
    font-weight: 500;
    color: #999999;
    font-family: PingFangHK-Regular, PingFangHK;
  }
}

.json_content {
  height: calc(50vh - 157px);
  overflow: auto;
}

.taskRelation {
  width: 100%;
  display: flex;
  // border: solid 1px lightgray;
}
::v-deep .el-collapse-item__header {
  border: 0;
}
::v-deep .el-form {
  .el-select {
    width: 100%;
  }
}
</style>
