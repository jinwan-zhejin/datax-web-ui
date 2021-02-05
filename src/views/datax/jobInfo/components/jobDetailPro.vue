<!--
 * @Date: 2021-02-02 17:38:54
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-05 17:36:28
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

      <div class="header_action" @click="handlerDelete(currentTask)">
        <i class="el-icon-delete-solid" />
        <span style="font-size: 13px;">删除</span>
      </div>
      <div class="header_action" @click="editPanelShow = true">
        <i class="el-icon-delete-solid" />
        <span style="font-size: 13px;">测试编辑</span>
      </div>

      <div class="header_switch" style="margin-right:10px;">
        <el-switch
          v-model="currentTask.triggerStatus"
          active-color="#00A854"
          active-text="启动"
          :active-value="1"
          inactive-color="#F04134"
          inactive-text="停止"
          :inactive-value="0"
          @change="changeSwitch(currentTask)"
        />
      </div>
    </div>
    <!-- gojs任务联系 -->
    <div class="taskRelation">
      <div
        :id="'myDiagramDiv' + myId"
        style="flex-grow: 1; height: calc(50vh);"
      />
    </div>
    <!-- 任务详情面板 -->
    <el-collapse v-model="collapseActiveName" accordion>
      <el-collapse-item name="result">
        <template slot="title">
          <i class="el-icon-document" />任务详情
        </template>
        <description>
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
              y="0px"
              width="16px"
              height="16px"
              viewBox="0 0 16 16"
              enable-background="new 0 0 16 16"
              xml:space="preserve"
            >
              <image
                id="image0"
                width="16"
                height="16"
                x="0"
                y="0"
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
              type="text"
              icon="el-icon-edit"
              @click="handlerUpdate(currentTask)"
            >编辑</el-button>
          </template>
          <template slot="context">
            <description-items keys="执行器" :values="jobGroupName" />
            <description-items keys="所属项目" :values="projectName" />
            <description-items
              v-if="showProjectName"
              keys="路由策略"
              :values="currentTask.executorRouteStrategy"
            />
            <description-items keys="子任务" :values="hasVal(childJob, 'jobDesc')" />
            <description-items
              v-if="showProjectName"
              keys="阻塞处理"
              :values="currentTask.executorBlockStrategy"
            />
            <description-items keys="任务名称" :values="currentTask.jobDesc" />
            <description-items keys="任务类型" :values="currentTask.jobType" />
            <description-items keys="Corn" :values="currentTask.jobCron" />
            <description-items keys="报警邮件" :values="currentTask.alarmEmail" />
            <description-items
              keys="失败重试次数"
              :values="currentTask.executorFailRetryCount"
            />
            <description-items keys="超时时间" :values="currentTask.executorTimeout" />
            <description-items keys="JVM启动参数" :values="currentTask.jvmParam" />
            <description-items
              v-if="jobType('SQLJOB')"
              keys="Schema"
              :values="currentTask.schema"
            />
          </template>
        </description>
      </el-collapse-item>
      <el-collapse-item name="json">
        <template slot="title">
          <i class="el-icon-document" />查看JSON
        </template>
        <div class="json_content">
          <json-editor
            ref="jsonEditor"
            :value="jsons"
            cani-edit="nocursor"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="log">
        <template slot="title">
          <i class="el-icon-document" />运行日志
        </template>
        <div class="log_container">
          <pre v-text="newstlogContent" />
        </div>
      </el-collapse-item>
    </el-collapse>

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
      :title="'编辑' + currentTask.jobDesc"
      :show="editPanelShow"
      @close="editPanelShow = false"
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
import JobDetailProEdit from './jobDetailProEdit';

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
      /** 质量任务表单 */
      writerFormQuality: {},
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
      /** 可编辑 */
      editable: {
        /** 新建任务 */
        newTask: false,
        /** 构建reader */
        reader: false,
        /** 构建writer */
        writer: false,
        /** 字段映射 */
        mapping: false
      },
      dataSource: '',
      resultView: false, // 结果查看
      /** 折叠面板激活项 */
      collapseActiveName: 'result',
      /** gojs面板 */
      myDiagram: '',
      /** 任务Id */
      myId: '',
      jsons: ''
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
        ? parseInt(this.currentTask.childJobId) : this.currentTask.childJobId
      return this.$store.state.taskAdmin.taskList.find(ele => ele.id === t)
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
    }
  },
  watch: {
    'writerFormQuality.writerDatasourceId': function(oldVal, newVal) {
      this.$store.state.taskAdmin.dataSourceList.find(item => {
        if (item.id === this.writerFormQuality.writerDatasourceId) {
          this.dataSource = item.datasource;
        }
      });
      if (
        this.dataSource === 'postgresql' ||
        this.dataSource === 'greenplum' ||
        this.dataSource === 'oracle' ||
        this.dataSource === 'sqlserver'
      ) {
        this.getSchemaList();
      }
      this.getTables('rdbmsWriter');
    },

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

    editPanelShow(val) {
      this.$store.commit('SET_READER_EDITABLE', !val);
      if (!val) {
        for (var i in this.editable) {
          this.editable[i] = false;
        }
      } else {
        this.$store.state.taskAdmin.dataSourceList.find(item => {
          if (item.id === this.$store.state.taskAdmin.writerDataSourceID) {
            this.dataSource = item.datasource;
          }
        });
        this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam));
        this.getColumns();
      }
    },

    'writerFormQuality.writerSchema'(val) {
      this.getTables('rdbmsWriter');
    },

    'editable.writer'(val) {
      if (!val) {
        this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam));
        this.getColumns();
      }
    },

    collapseActiveName(val) {
      if (val === '' || val === undefined || val === null) {
        this.collapseActiveName = 'result';
      } else if (val === 'json') {
        this.jsons = this.jsonString
      }
    }
  },
  created() {
    this.fetchData();
    this.getExecutor();
    this.getJobIdList();
    this.getJobProject();
    this.getDataSourceList();
    this.getSchemaList();
    this.currentTask = this.jobInfo;
    this.writerFormQuality = JSON.parse(JSON.stringify(this.jobParam));
    this.myId = this.guid;
  },
  mounted() {
    this.initGoJs();
  },

  methods: {
    /**
     * @description: 质量任务编辑 - 数据源切换
     */
    wDsChange(e) {
      this.$store.commit('SET_WRITER_DATASOURCE_ID', e);
      this.$store.state.taskAdmin.dataSourceList.find(item => {
        if (item.id === e) {
          this.dataSource = item.datasource;
        }
      });
    },

    getReaderData() {
      return this.$refs.reader.getData();
    },
    /**
     * @description: writer表项全选
     */
    wHandleCheckAllChange(val) {
      this.writerFormQuality.writerColumns = val ? this.fromColumnList : [];
      this.writerForm.isIndeterminate = false;
      this.$store.commit(
        'SET_SELECT_WRITERCOLUMN',
        this.writerFormQuality.writerColumns
      );
    },
    wHandleCheckedChange(value) {
      const checkedCount = value.length;
      this.writerForm.checkAll = checkedCount === this.fromColumnList.length;
      this.writerForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.fromColumnList.length;
      this.$store.commit('SET_SELECT_WRITERCOLUMN', value);
    },
    wTbChange(t) {
      this.getColumns('writer');
      this.$store.commit('SET_WRITER_TABLENAME', t);
    },

    /**
     * @description: 执行一次
     * @param {object} taskInfo
     */
    handlerExecute(taskInfo) {
      handlerExecute.call(this, taskInfo).then(() => {
        this.newstlogContent = '';
        this.logList();
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
      this.$store.commit('SET_LOGVIEW_TYPE', 0);
      this.logview = true;
      // this.jobId = taskInfo.id;
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

    // 编辑
    handlerUpdate(row) {
      this.$store.commit('SET_JOBINFO_TYPE', this.jobInfo.jobType);
      this.$store.commit('SET_READER_ISEDIT', true);

      row.childJobId = row.childJobId?.join?.(',');
      handlerUpdate.call(this, row);

      const jobParam = JSON.parse(row.jobParam);
      this.$store.commit(
        'SET_READER_DATASOURCE_ID',
        jobParam.readerDatasourceId
      );

      if (this.$store.state.taskAdmin.jobInfoType === 'DQCJOB') {
        const jobParamRule = jobParam.rule;
        jobParamRule.forEach(ele => {
          const codeArr = [];
          ele.ruleId.forEach(code => {
            codeArr.push(code.code);
          });
          ele.ruleId = codeArr;
        });
        this.$store.commit('SET_JOBRULE', jobParamRule);
      }

      this.$store.commit('SET_READER_TABLENAME', jobParam.readerTables[0]);

      this.$store.commit('SET_READER_SCHEMA', jobParam.readerSchema);

      this.$store.commit('SET_WRITER_SCHEMA', jobParam.writerSchema);

      this.$store.commit('SET_SELECT_READERCOLUMN', jobParam.readerColumns);

      this.$store.commit(
        'SET_WRITER_DATASOURCE_ID',
        jobParam.writerDatasourceId
      );

      this.$store.commit('SET_WRITER_TABLENAME', jobParam.writerTables[0]);

      this.$store.commit('SET_SELECT_WRITERCOLUMN', jobParam.writerColumns);

      this.getColumns();

      this.getTables('rdbmsWriter');
    },

    /**
     * @description: 实时更新日志
     */
    logList() {
      const param = Object.assign(
        {},
        {
          current: 1,
          size: 10,
          jobGroup: 0,
          jobId: this.currentTask?.id,
          logStatus: -1,
          filterTime: ''
        }
      );
      let status = 0;

      logGetList(param).then(response => {
        const { content } = response;

        const newestLog = content.data[0] || {};
        if (!newestLog?.executorAddress) {
          this.logList();
          return;
        }
        status = newestLog.handleCode;
        const triggerTime = Date.parse(newestLog?.triggerTime);
        viewJobLog(newestLog?.executorAddress, triggerTime, newestLog?.id, 1)
          .then(response => {
            this.newstlogContent = response.content.logContent;
          })
          .then(() => {
            if (status === 0) {
              setTimeout(this.logList(), 1000);
            }
          });
      });
    },

    /**
     * @description: 获取schema列表
     */
    getSchemaList() {
      getTableSchema({
        datasourceId: this.writerFormQuality.writerDatasourceId
      }).then(response => {
        this.schemaList = response.data
      })
    },

    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    /**
     * @description: 获取执行器列表
     */
    getExecutor() {
      infoApi.getExecutorList().then(response => {
        const { content } = response;
        this.executorList = content;
      });
    },
    /**
     * @description: 获取所有任务列表
     */
    getJobIdList() {
      infoApi.getJobIdList().then(response => {
        const { content } = response;
        this.jobIdList = content;
      });
    },
    getJobProject() {
      getJobProjectList().then(response => {
        this.jobProjectList = response;
      });
    },
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
    handleCreate() {
      this.resetCurrentTask();
      this.dialogStatus = 'create';
      this.editPanelShow = true;
      // this.$nextTick(() => {
      //   this.$refs["dataForm"].clearValidate();
      // });
    },

    updateData() {
      this.$store.commit('SET_SELECT_WRITERCOLUMN', this.readerForm.rcolumns);
      this.$store.commit('SET_SELECT_READERCOLUMN', this.readerForm.lcolumns);
      const jobParam = {
        readerDatasourceId: this.$store.state.taskAdmin.readerDataSourceID,
        writerDatasourceId: this.writerFormQuality.writerDatasourceId,
        readerTables: [this.$store.state.taskAdmin.readerTableName], // reader表名[Array]
        writerTables: this.writerFormQuality.writerTables, // writer表名[Array]
        readerColumns: this.$store.state.taskAdmin.selectReaderColumn, // 已选择的表项
        writerColumns: this.writerFormQuality.writerColumns,
        readerSchema: this.$store.state.taskAdmin.readerSchema,
        writerSchema:
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
            ? this.writerFormQuality.writerSchema
            : '',
        transformer: this.writerFormQuality.transformer,
        hiveReader: this.writerFormQuality.hiveReader,
        hiveWriter:
          this.dataSource === 'hive' ? this.writerFormQuality.hiveWriter : {},
        rdbmsReader: this.writerFormQuality.rdbmsReader,
        rdbmsWriter:
          this.dataSource !== 'hive'
            ? this.writerFormQuality.rdbmsWriter
            : { preSql: '', postSql: '' },
        hbaseReader: this.writerFormQuality.hbaseReader,
        hbaseWriter: this.writerFormQuality.hbaseWriter,
        mongoDBReader: this.writerFormQuality.mongoDBReader,
        mongoDBWriter: this.writerFormQuality.mongoDBWriter
      };

      if (this.currentTask.glueType === 'BEAN' && !isJSON(this.currentTask.jobJson)) {
        this.$notify({
          title: 'Fail',
          message: 'json格式错误',
          type: 'error',
          duration: 2000
        });
        return;
      }
      this.$refs['dataForm'].validate(valid => {
        // const tabName = this.currentTask.id;
        if (valid) {
          if (this.currentTask.childJobId) {
            const auth = [];
            for (const i in this.currentTask.childJobId) {
              auth.push(this.currentTask.childJobId[i].id);
            }
            this.currentTask.childJobIdArr = auth;
            this.currentTask.childJobId = auth.toString();
          }
          // this.currentTask.executorHandler =
          //   this.currentTask.glueType === "BEAN" ? "executorJobHandler" : "";
          this.currentTask.glueSource = this.glueSource;
          if (this.partitionField) {
            this.currentTask.partitionInfo =
              this.partitionField +
              ',' +
              this.timeOffset +
              ',' +
              this.timeFormatType;
          }
          if (this.currentTask.jobType === 'DQCJOB') {
            const tempjobRule = JSON.parse(
              JSON.stringify(this.$store.state.taskAdmin.jobRule)
            );
            tempjobRule.forEach(ele => {
              const codeArr = [];
              ele.ruleId.forEach(code => {
                codeArr.push({ code });
              });
              ele.ruleId = codeArr;
            });
            jobParam.rule = tempjobRule;
          }
          this.currentTask.jobParam = JSON.stringify(jobParam);
          infoApi.updateJob(this.currentTask).then(() => {
            this.fetchData();
            this.editPanelShow = false;
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

    // 获取表名
    getTables(type) {
      if (type === 'rdbmsWriter') {
        let obj = {};
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'greenplum' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            datasourceId: this.writerFormQuality.writerDatasourceId,
            tableSchema: this.writerFormQuality.writerSchema
          };
        } else {
          obj = {
            datasourceId: this.writerFormQuality.writerDatasourceId
          };
        }
        // 组装
        dsQueryApi
          .getTables(obj)
          .then(response => {
            this.wTbList = response;
            this.$store.commit('SET_WRITER_TABLENAME', this.wTbList[0]);
          })
          .catch(error => {
            console.log(error);
            this.wTbList = [];
            this.$store.commit('SET_WRITER_TABLENAME', '');
          });
      }
    },
    // 获取表字段
    getColumns() {
      const obj = {
        datasourceId: this.writerFormQuality.writerDatasourceId,
        tableName: this.writerFormQuality.writerTables[0]
      };
      dsQueryApi.getColumns(obj).then(response => {
        this.fromColumnList = response;

        if (
          this.writerFormQuality.writerDatasourceId ===
            this.jobParam.writerDatasourceId &&
          this.writerFormQuality.writerTables[0] ===
            this.jobParam.writerTables[0]
        ) {
          this.writerFormQuality.writerColumns = this.jobParam.writerColumns;
        } else {
          this.writerFormQuality.writerColumns = this.fromColumnList;
        }

        this.writerForm.checkAll =
          this.writerFormQuality.writerColumns.length ===
          this.fromColumnList.length;
        this.writerForm.isIndeterminate =
          this.writerFormQuality.writerColumns.length > 0 &&
          this.writerFormQuality.writerColumns.length <
            this.fromColumnList.length;

        this.$store.commit('SET_WRITER_COLUMNS', response);

        this.readerForm.rcolumns = response;
        this.toColumnsList = response;
      });
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
    editReader() {
      this.editable.reader = !this.editable.reader;
      this.$store.commit('SET_READER_ISEDIT', true);
      this.$store.commit('SET_READER_EDITABLE', this.editable.reader);
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
          $(go.TextBlock, '上线/下线', {
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
              this.deleteTask();
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
              this.checkLog();
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
              this.editTask();
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
      const paramItem = [{ text: this.currentTask.jobDesc, key: this.currentTask.id, color: 'lightblue' }];
      if (this.isVal(this.currentTask.childJobId)) {
        paramItem.push({ text: this.hasVal(this.childJob, 'jobDesc'), key: parseInt(this.hasVal(this.childJob, 'id')), color: 'orange' });
      }
      const paramLine = [];
      if (this.isVal(this.currentTask.childJobId)) {
        paramLine.push({ from: this.currentTask.id, to: parseInt(this.hasVal(this.childJob, 'id')) });
      }
      this.$nextTick(_ => {
        this.myDiagram.model = new go.GraphLinksModel(
          paramItem, paramLine
        )
      })
    },
    /**
     * @description: 查看详情
     */
    checkInfo(obj) {
      this.currentTask = this.$store.state.taskAdmin.taskList.find(ele => ele.id === obj.part.data.key)
    },
    /**
     * @description: 上线、下线
     */
    online(obj) {
      this.currentTask.triggerStatus = this.currentTask.triggerStatus === 0 ? 1 : 0
      this.changeSwitch(this.$store.state.taskAdmin.taskList.find(ele => ele.id === obj.part.data.key))
    },
    /**
     * @description: 删除任务
     */
    deleteTask(obj) {
      this.handlerDelete(this.$store.state.taskAdmin.taskList.find(ele => ele.id === obj.part.data.key));
    },
    /**
     * @description: 查看任务操作日志
     */
    checkLog(obj) {
      this.handlerViewLog(this.$store.state.taskAdmin.taskList.find(ele => ele.id === obj?.part.data.key));
    },
    /**
     * @description: 编辑任务属性
     */
    editTask(obj) {
      this.handlerUpdate(this.$store.state.taskAdmin.taskList.find(ele => ele.id === obj.part.data.key));
    },
    /**
     * @description: 导出任务
     */
    exportTask(obj) {
      console.log(obj.part.data);
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
}

.log_container {
  padding-left: 24px;
  height: 240px;
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
  height: 240px;
  overflow: auto;
}

.taskRelation {
  width: 100%;
  display: flex;
  // border: solid 1px lightgray;
}
</style>
