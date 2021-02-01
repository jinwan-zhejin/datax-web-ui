<template>
  <div class="Management">
    <div class="lt">
      <!-- {{jobDetailIdx}} -->
      <div class="top">
        <el-row>
          <el-col :span="12">
            <!-- <el-select
              v-model="selectValue"
              placeholder="请选择"
              @change="fetchJobs"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select> -->
            <el-dropdown v-show="showAdmin" @command="handleCommand">
              <span>
                {{ dropdownText }}<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown" style="max-height: calc(100vh - 200px); overflow: auto;">
                <el-dropdown-item v-for="item in options" :key="item.id" :command="item.id + '/' + item.name">{{ item.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-dropdown-menu slot="dropdown" placeholder="请选择">
              <span class="el-dropdown-link">
                123
              </span>
              <el-dropdown-item v-for="item in options" :key="item.id" :command="item.name">{{ item.name }}</el-dropdown-item>
            </el-dropdown-menu> -->
          </el-col>
          <el-col :span="12">
            <i class="el-icon-location-outline top-icon" />
            <i class="el-icon-coin top-icon" />
            <i class="el-icon-folder-add top-icon" @click="showAllName" />
            <el-dropdown trigger="click" @command="createNewJob">
              <i class="el-icon-folder-add top-icon" />
              <el-dropdown-menu
                style="max-height: calc(100vh - 200px); overflow: auto;"
              >
                <el-dropdown-item command="wenjianjia">
                  <svg-icon class="svg_icon" icon-class="wenjianjia" /> 新建文件夹
                </el-dropdown-item>
                <el-dropdown-item command="NORMAL">
                  <svg-icon class="svg_icon" icon-class="NORMAL" /> 普通任务
                </el-dropdown-item>
                <el-dropdown-item command="IMPORT">
                  <svg-icon class="svg_icon" icon-class="IMPORT" />引入任务
                </el-dropdown-item>
                <el-dropdown-item command="EXPORT">
                  <svg-icon class="svg_icon" icon-class="EXPORT" />导出任务
                </el-dropdown-item>
                <el-dropdown-item command="COMPUTE" disabled>
                  <svg-icon class="svg_icon" icon-class="COMPUTE" />计算任务
                </el-dropdown-item>
                <el-dropdown-item command="SQLJOB">
                  <svg-icon class="svg_icon" icon-class="SQLJOB" />SQL任务
                </el-dropdown-item>
                <el-dropdown-item command="SPARK">
                  <svg-icon class="svg_icon" icon-class="SPARK" />SPARK任务
                </el-dropdown-item>
                <el-dropdown-item command="DQCJOB">
                  <svg-icon class="svg_icon" icon-class="DQCJOB" />质量任务
                </el-dropdown-item>
                <el-dropdown-item command="METACOLLECT" divided>
                  <svg-icon
                    class="svg_icon"
                    icon-class="METACOLLECT"
                  />元数据采集任务
                </el-dropdown-item>
                <el-dropdown-item command="METACOMPARE">
                  <svg-icon
                    class="svg_icon"
                    icon-class="METACOMPARE"
                  />元数据比较任务
                </el-dropdown-item>
                <el-dropdown-item command="SHELL" divided>
                  <svg-icon class="svg_icon" icon-class="SHELL" />SHELL任务
                </el-dropdown-item>
                <el-dropdown-item command="POWERSHELL">
                  <svg-icon
                    class="svg_icon"
                    icon-class="POWERSHELL"
                  />POWERSHELL任务
                </el-dropdown-item>
                <el-dropdown-item command="PYTHON">
                  <svg-icon class="svg_icon" icon-class="PYTHON" />PYTHON任务
                </el-dropdown-item>
                <el-dropdown-item command="VJOB" divided>
                  <svg-icon class="svg_icon" icon-class="VJOB" />虚任务
                </el-dropdown-item>
                <el-dropdown-item command="JAVA" divided disabled>
                  <svg-icon class="svg_icon" icon-class="JAVA" />Java任务
                </el-dropdown-item>
                <el-dropdown-item command="SCALA" disabled>
                  <svg-icon class="svg_icon" icon-class="SCALA" />Scala任务
                </el-dropdown-item>
                <el-dropdown-item command="PYSPARK" disabled>
                  <svg-icon class="svg_icon" icon-class="PYSPARK" />PySpark任务
                </el-dropdown-item>
                <el-dropdown-item command="R" disabled>
                  <svg-icon class="svg_icon" icon-class="R" />R任务
                </el-dropdown-item>
                <el-dropdown-item command="BATCH" divided>
                  <svg-icon class="svg_icon" icon-class="BATCH" />任务批量构建
                </el-dropdown-item>
                <el-dropdown-item command="TEMPLATE">
                  <svg-icon
                    class="svg_icon"
                    icon-class="TEMPLATE"
                  />普通任务模板
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <div class="body">
          <el-input
            v-model="search"
            class="input_serach"
            prefix-icon="el-icon-search"
            placeholder="文件夹或任务名称"
            clearable
          />
          <el-scrollbar>
            <!-- <div v-if="isFolder" class="list">
              <ul>
                <li
                  v-for="(item, index) in filterList"
                  :key="index"
                  :class="[jobDetailIdx === (item.id + '') ? 'list-highlight' : '']"
                  style="padding-right: 12px;"
                  @click="getJobDetail(item)"
                >
                  <svg-icon :icon-class="item.jobType" />
                  <a style="color: rgba(102, 102, 102, 1)">
                    {{ item.jobDesc }}
                  </a>
                  <el-tag
                    v-if="item.hasOwnProperty('triggerStatus')"
                    :type="item.triggerStatus === 1 ? 'success' : item.triggerStatus === 0 ? 'warning' : 'info'"
                    effect="plain"
                    size="mini"
                    style="float: right; margin-top: 6px; padding-right: 20px;"
                  >
                    {{ item.triggerStatus === 1 ? '运行中' : item.triggerStatus === 0 ? '未运行' : '未知' }}
                  </el-tag>
                </li>
              </ul>
            </div>
            <div v-else class="folder">
              <p>
                <svg-icon icon-class="wenjianjia" />
                <a style="color: rgba(102, 102, 102, 1)" @click="singleClick(folderName)" @dblclick="resetName(folderName)">
                  {{ folderName }}
                </a>
                <i class="el-icon-close" @click="delFolder" />
                <ul v-show="showCurrentFolder">
                  <li
                    v-for="(item, index) in filterList"
                    :key="index"
                    :class="[jobDetailIdx === (item.id + '') ? 'list-highlight' : '']"
                    style="padding-right: 12px;"
                    @click="getJobDetail(item)"
                  >
                    <svg-icon :icon-class="item.jobType" />
                    <a style="color: rgba(102, 102, 102, 1)">
                      {{ item.jobDesc }}
                    </a>
                    <el-tag
                      v-if="item.hasOwnProperty('triggerStatus')"
                      :type="item.triggerStatus === 1 ? 'success' : item.triggerStatus === 0 ? 'warning' : 'info'"
                      effect="plain"
                      size="mini"
                      style="float: right; margin-top: 6px; padding-right: 20px;"
                    >
                      {{ item.triggerStatus === 1 ? '运行中' : item.triggerStatus === 0 ? '未运行' : '未知' }}
                    </el-tag>
                  </li>
                </ul>
              </p>
            </div> -->
            <el-tree
              id="main_span"
              ref="tree"
              :data="treeList"
              highlight-current
              :filter-node-method="filterNode"
              accordion
              :props="defaultProps"
              default-expand-all
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              draggable
              node-key="id"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node" style="height: 32px;line-height: 32px;position: relative;display: block;width: 100%;" @dblclick="resetName(folderName)">
                <span>
                  <svg-icon v-if="data.jobType" :icon-class="data.jobType" style="margin-right:10px;" />{{ data.name }}
                </span>
                <!-- <el-tag
                  v-if="data.hasOwnProperty('triggerStatus')"
                  :type="data.triggerStatus === 1 ? 'success' : data.triggerStatus === 0 ? 'warning' : 'info'"
                  effect="plain"
                  size="mini"
                  style="right: 20px; margin-top: 6px; position: absolute; padding-left: 20px;padding-right: 20px;"
                >
                  {{ data.triggerStatus === 1 ? '运行中' : data.triggerStatus === 0 ? '未运行' : '未知' }}
                </el-tag> -->
              </span>
            </el-tree>
            <vue-context-menu
              class="right-menu"
              :target="contextMenuTarget"
              :show="contextMenuVisible"
              @update:show="(show) => contextMenuVisible = show"
            >
              <a href="javascript:" @click="showAllName">新建文件夹</a>
              <a id="newFile" href="javascript:">新建文件<i class="el-icon-arrow-right" />
                <vue-context-menu
                  class="right-menu1"
                  :target="contextMenu1Target"
                  :show.sync="contextMenu1Visible"
                  style="display: none;"
                >
                  <a href="javascript:" @click="showAllName('NORMAL')">
                    <svg-icon class="svg_icon" icon-class="NORMAL" /> 普通任务
                  </a>
                  <a href="javascript:" @click="showAllName('IMPORT')">
                    <svg-icon class="svg_icon" icon-class="IMPORT" />引入任务
                  </a>
                  <a href="javascript:" @click="showAllName('EXPORT')">
                    <svg-icon class="svg_icon" icon-class="EXPORT" />导出任务
                  </a>
                  <a href="javascript:" @click="showAllName('COMPUTE')">
                    <svg-icon class="svg_icon" icon-class="COMPUTE" />计算任务
                  </a>
                  <a href="javascript:" @click="showAllName('SQLJOB')">
                    <svg-icon class="svg_icon" icon-class="SQLJOB" />SQL任务
                  </a>
                  <a href="javascript:" @click="showAllName('SPARK')">
                    <svg-icon class="svg_icon" icon-class="SPARK" />SPARK任务
                  </a>
                  <a href="javascript:" @click="showAllName('DQCJOB')">
                    <svg-icon class="svg_icon" icon-class="DQCJOB" />质量任务
                  </a>
                  <hr style="padding: 0;margin: 0;">
                  <a href="javascript:" @click="showAllName('METACOLLECT')">
                    <svg-icon
                      class="svg_icon"
                      icon-class="METACOLLECT"
                    />元数据采集任务
                  </a>
                  <a href="javascript:" @click="showAllName('METACOMPARE')">
                    <svg-icon
                      class="svg_icon"
                      icon-class="METACOMPARE"
                    />元数据比较任务
                  </a>
                  <hr style="padding: 0;margin: 0;">
                  <a href="javascript:" @click="showAllName('SHELL')">
                    <svg-icon class="svg_icon" icon-class="SHELL" />SHELL任务
                  </a>
                  <a href="javascript:" @click="showAllName('POWERSHELL')">
                    <svg-icon
                      class="svg_icon"
                      icon-class="POWERSHELL"
                    />POWERSHELL任务
                  </a>
                  <a href="javascript:" @click="showAllName('PYTHON')">
                    <svg-icon class="svg_icon" icon-class="PYTHON" />PYTHON任务
                  </a>
                  <hr style="padding: 0;margin: 0;">
                  <a href="javascript:" @click="showAllName('VJOB')">
                    <svg-icon class="svg_icon" icon-class="VJOB" />虚任务
                  </a>
                  <a href="javascript:" @click="showAllName('JAVA')">
                    <svg-icon class="svg_icon" icon-class="JAVA" />Java任务
                  </a>
                  <a href="javascript:" @click="showAllName('SCALA')">
                    <svg-icon class="svg_icon" icon-class="SCALA" />Scala任务
                  </a>
                  <a href="javascript:" @click="showAllName('PYSPARK')">
                    <svg-icon class="svg_icon" icon-class="PYSPARK" />PySpark任务
                  </a>
                  <a href="javascript:" @click="showAllName('R')">
                    <svg-icon class="svg_icon" icon-class="R" />R任务
                  </a>
                  <a href="javascript:" @click="showAllName('BATCH')">
                    <svg-icon class="svg_icon" icon-class="BATCH" />任务批量构建
                  </a>
                  <a href="javascript:" @click="showAllName('TEMPLATE')">
                    <svg-icon
                      class="svg_icon"
                      icon-class="TEMPLATE"
                    />普通任务模板
                  </a>
                </vue-context-menu>
              </a>
              <a href="javascript:" @click="resetName">查看文件信息</a>
              <a href="javascript:" @click="resetName">移动文件夹</a>
              <hr style="padding: 0;margin: 0;">
              <a href="javascript:" @click="copyFile">复制(C)</a>
              <a href="javascript:" @click="showScene">粘贴(P)</a>
              <a href="javascript:" @click="delFolder">删除(D)</a>
            </vue-context-menu>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- {{ jobDetailIdx }} -->
    <div class="rg rt">
      <el-tabs
        v-model="jobDetailIdx"
        type="border-card"
        closable
        class="el-bar-tab"
        @tab-remove="removeJobTab"
        @tab-click="JobTabClick"
      >
        <el-tab-pane
          v-if="!$store.state.taskAdmin.taskDetailList.length"
          label="欢迎"
          name="欢迎"
        >
          <div class="title_h3">
            一站式数据开发解决方案
          </div>
          <svg-icon style="width: 100%; height: 90%;margin-top: 25px" icon-class="fengdie" />
        </el-tab-pane>

        <el-tab-pane
          v-for="item in $store.state.taskAdmin.taskDetailList"
          :key="item.content.id"
          :label="item.title"
          :name="item.content.id + ''"
        >
          <JobDetail
            v-if="item.content.jobType !== 'VJOB'"
            :job-info="$store.state.taskAdmin.jobInfo"
            @deleteJob="getItem"
            @deleteDetailTab="clearJobTab"
          />
          <Workflow
            v-else
            :is-save="item"
            job-type="VJOB"
            :task-list="List"
            @fromChild="getChild"
            @refreshList="refreshList"
          />
        </el-tab-pane>

        <el-tab-pane
          v-if="$store.state.taskAdmin.tabType"
          :name="$store.state.taskAdmin.tabType"
          :label="
            $store.state.taskAdmin.allTabType[$store.state.taskAdmin.tabType]
          "
        >
          <div
            v-if="
              jobType === 'NORMAL' ||
                jobType === 'IMPORT' ||
                jobType === 'EXPORT'
            "
            class="rg"
          >
            <JsonBuild @cancel="closeCreate" />
          </div>

          <div v-if="jobType === 'SQLJOB'" class="rg">
            <SqlJob job-type="GLUE_SQL" job-type-label="SQL任务" />
          </div>

          <div v-if="jobType === 'SPARK'" class="rg">
            <SparkJob job-type="GLUE_SPARK" job-type-label="SPARK任务" />
          </div>

          <div v-if="jobType === 'DQCJOB'" class="rg">
            <JsonQuality />
          </div>
          <div v-if="jobType === 'BATCH'" class="rg">
            <BatchBuild />
          </div>
          <div v-if="jobType === 'TEMPLATE'" class="rg">
            <JobTemplate />
          </div>
          <div v-if="jobType === 'SHELL'" class="rg">
            <SimpleJob job-type="GLUE_SHELL" job-type-label="SHELL任务" />
          </div>
          <div v-if="jobType === 'POWERSHELL'" class="rg">
            <SimpleJob
              job-type="GLUE_POWERSHELL"
              job-type-label="POWERSHELL任务"
            />
          </div>
          <div v-if="jobType === 'PYTHON'" class="rg">
            <SimpleJob job-type="GLUE_PYTHON" job-type-label="PYTHON任务" />
          </div>
          <div v-if="jobType === 'METACOMPARE'" class="rg">
            <MetaCompare />
          </div>
          <div v-if="jobType === 'VJOB'" class="rg">
            <Workflow
              :is-save="{}"
              job-type="VJOB"
              :task-list="List"
              @fromChild="getChild"
              @refreshList="getItem()"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog width="40%" title="重命名" :visible.sync="dialogRenameVisible">
      <span style="margin-left:20px;">名称：</span><el-input v-model="Rename" style="width: 60%;margin-left:20px;" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialog">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="sureRe">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog width="40%" title="新建" :visible.sync="dialogNameVisible">
      <span style="margin-left:20px;">名称：</span><el-input v-model="allName" style="width: 60%;margin-left:20px;" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialog">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="createFolder">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Workflow from './components/workflow.vue';
import SimpleJob from './components/simpleJob.vue';
import SparkJob from './components/sparkJob.vue';
import JobDetail from './components/jobDetail.vue';
import * as jobProjectApi from '@/api/datax-job-project';
import * as job from '@/api/datax-job-info';
import JsonBuild from '@/views/datax/json-build/index';
import JsonQuality from '@/views/datax/jsonQuality/index';
import BatchBuild from '@/views/datax/json-build-batch/index';
import JobTemplate from '@/views/datax/jobTemplate/index';
import SqlJob from '@/views/datax/jobInfo/components/sqlJob';
import MetaCompare from '@/views/datax/jobInfo/components/metaCompare';
import _ from 'lodash';
import { component as VueContextMenu } from '@xunlei/vue-context-menu';

import { list as jdbcDsList } from '@/api/datax-jdbcDatasource';

import { objList } from '@/utils/sortArr'

var time;

export default {
  name: '',
  components: {
    Workflow,
    JsonBuild,
    JsonQuality,
    SimpleJob,
    JobDetail,
    BatchBuild,
    JobTemplate,
    SparkJob,
    SqlJob,
    MetaCompare,
    'vue-context-menu': VueContextMenu
  },
  data() {
    return {
      editableTabsValue: '1',
      isDel: false,
      editableTabs: [
        {
          title: 'Untitled',
          name: '1'
        }
      ],
      dialogRenameVisible: false,
      dialogNameVisible: false,
      showCurrentFolder: false,
      Rename: '',
      allName: '',
      tabIndex: 1,
      treeList: [],
      contextMenuVisible: false,
      contextMenu1Visible: false,
      contextMenuTarget: '',
      contextMenu1Target: '',
      selectedIndex: '',
      /** el-select选项 */
      options: [],
      /** el-select激活项 */
      selectValue: '',
      search: '',
      List: [],
      listQuery: {
        pageNo: 1,
        pageSize: 1000,
        searchVal: '',
        userId: ''
      },
      /** 任务类型 */
      jobType: 'SHOWDETAIL',
      jobDetailIdx: '欢迎',
      jobTypeMap: '',
      jobDetailLoading: true,
      firstTime: true,
      projectIds: '',
      showAdmin: false,
      folderName: '新建文件夹',
      FolderArray: [],
      isFolder: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectRow: {},
      copyObj: {},
      currentJob: '', // 当前任务
      targetId: '', // 目标id
      dropId: '' // 被拖拽id
    };
  },
  computed: {
    taskList() {
      // 任务列表
      return this.$store.state.taskAdmin.taskList;
    },

    taskDetailID() {
      return this.$store.state.taskAdmin.taskDetailID;
    },

    filterList() {
      return this.List.filter(item => {
        if (item.jobDesc.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
          return true
        }
        if (this.search === item.id.toString()) {
          return true
        }
      })
    },

    dropdownText() {
      if (this.selectValue !== '' && this.selectValue !== null && this.selectValue !== undefined) {
        if (typeof this.selectValue === 'number') {
          return this.options.filter(item => item.id === this.selectValue)[0].name
        } else {
          return this.selectValue
        }
      } else {
        return '请选择'
      }
    }
  },
  watch: {
    editableTabs(val) {
      console.log(val);
      if (val.length === 1) {
        this.isDel = false;
      } else {
        this.isDel = true;
      }
    },

    taskList(val) {
      this.List = val;
    },

    taskDetailID(val) {
      this.jobDetailIdx = val;
    },

    '$store.state.project.currentItem': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (oldValue) {
          const commandId = newValue.split('/')[0]
          const commandName = newValue.split('/')[1]
          this.selectValue = commandName;
          this.$store.commit('SET_PROJECT_ID', commandId);

          // 获取任务列表
          const listQuery = {
            current: 1,
            size: 10,
            jobGroup: 0,
            projectIds: commandId,
            triggerStatus: -1,
            jobDesc: '',
            glueType: ''
          };
          this.projectIds = commandId;

          job.getList(listQuery).then(response => {
            const { content } = response;
            this.List = content.data;
          });

          this.getDataTree()

          // 根据项目id获取数据源

          const p = {
            current: 1,
            size: 200,
            ascs: 'datasource_name',
            projectId: commandId
          };
          jdbcDsList(p).then(response => {
            const { records } = response;
            this.$store.commit('SET_DATASOURCE', records);
          });
        }
      }
    },

    search: function(val) {
      this.$refs.tree.filter(val)
    }
  },

  mounted() {
    const myChartContainer = document.getElementById('main_span');
    // 右击显示菜单 区域位置
    this.contextMenuTarget = myChartContainer;
    this.contextMenu1Target = myChartContainer;
    // 关闭浏览器右击默认菜单
    myChartContainer.oncontextmenu = function(e) {
      console.log(e)
      return false;
    };

    const a = document.getElementById('newFile');
    const b = document.getElementsByClassName('right-menu1')
    for (var i = 0; i < b.length; i++) {
      b[i].style.display = 'none';
    }

    a.onmouseover = function() {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'block';
      }
    }

    a.onmouseout = function() {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'none';
      }
    }

    b.onmouseover = function() {
      for (var i = 0; i < b.length; i++) {
        b[i].style.display = 'block';
      }
    }
  },

  created() {
    if (sessionStorage.getItem('level') === '2') {
      this.showAdmin = false;
    } else {
      this.showAdmin = true;
    }
    this.getItem();
    this.getDataTree()
    console.log(this.$store.state);
  },
  methods: {
    /**
     * @description: tab关闭逻辑
     */
    removeJobTab(targetId) {
      const targetIdInt = parseInt(targetId)
      console.log(this.$store.state.taskAdmin.taskDetailList)
      const removeIndex = this.$store.state.taskAdmin.taskDetailList.findIndex(
        ele => ele.content.id === targetIdInt
      )
      console.log(removeIndex)
      if (this.jobDetailIdx === targetId) {
        this.jobDetailIdx =
          (
            this.$store.state.taskAdmin.taskDetailList[removeIndex + 1]?.content
              ?.id ||
            this.$store.state.taskAdmin.taskDetailList[removeIndex - 1]?.content
              ?.id
          ) + ''
        console.log('jobDetailIdx: ', this.jobDetailIdx);
      }
      // 关闭的是[新增任务tab]，非新增任务tab id = content.id
      if (this.$store.state.taskAdmin.tabTypeArr.indexOf(targetId) !== -1) {
        this.jobType = '';
        this.$store.commit('SET_TAB_TYPE', '');
      } else {
        this.$store.commit('DELETE_TASKDETAIL', removeIndex);
        if (this.$store.state.taskAdmin.taskDetailList.length === 0) {
          this.jobDetailIdx = '欢迎';
        }
      }
    },

    // 获取tree数据结构
    getDataTree() {
      console.log(this.$store.state.project.currentItem, 'currentItem')
      const projectId = this.$store.state.project.currentItem.split('/')[0]
      job.getTreeData(projectId).then((res) => {
        if (res.code === 200) {
          this.treeList = res.content
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    showScene() {
      console.log(this.selectedIndex)
    },

    JobTabClick(ele) {
      this.jobType = ele.name;
      const t = this.List.filter(item => item.id === parseInt(this.jobDetailIdx))
      this.$store.commit('SET_JOB_INFO', t[0])
    },

    clearJobTab(name) {
      const removeIndex = _.findIndex(
        this.$store.state.taskAdmin.taskDetailList,
        ele => ele.content.id === name
      );
      this.jobDetailIdx =
        (this.$store.state.taskAdmin.taskDetailList[removeIndex + 1]?.content
          ?.id ||
          this.$store.state.taskAdmin.taskDetailList[removeIndex - 1]?.content
            ?.id) + '';
      this.$store.commit('DELETE_TASKDETAIL', removeIndex);
    },

    freshItem() {
      this.getItem();
      this.jobType = 'SHOWDETAIL';
    },

    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        const newTabName = new Date().valueOf().toString();
        this.editableTabs.push({
          title: 'Untitled',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },

    changeTab(e) {
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].title === e.label) {
          this.editableTabsValue = this.editableTabs[i].name;
        }
      }
      console.log(this.editableTabsValue);
    },

    getChild(v) {
      console.log(v);
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === v.index) {
          this.editableTabs[i].title = v.name;
          this.pushList(v);
        }
      }
    },

    pushList(val) {
      if (this.List.length < 1) {
        this.List.push({
          name: val.name,
          data: val.data
        });
      } else {
        for (let i = 0; i < this.List.length; i++) {
          if (this.List[i].name === val.name) {
            this.editableTabsValue = val.index;
          } else {
            this.List.push({
              name: val.name,
              data: val.data
            });
          }
        }
      }
    },

    handleRemove(name) {
      console.log(name);
      if (this.editableTabs.length === 1) {
        this.isDel = false;
        this.editableTabsValue = this.editableTabs[0].name;
      } else {
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].name === name) {
            this.editableTabs.splice(i, 1);
          }
          if (this.editableTabsValue === name) {
            this.editableTabsValue = this.editableTabs[
              this.editableTabs.length
            ].name;
          }
        }
      }
    },

    // 快速检索关键字
    filterNode(value, data) {
      console.log(value, data)
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    // 单击文件夹选中
    singleClick(name) {
      clearTimeout(time); // 首先清除计时器
      time = setTimeout(() => {
        console.log(name, this.showCurrentFolder, '11111ooooooooo')
        if (this.showCurrentFolder) {
          this.showCurrentFolder = false;
        } else {
          this.showCurrentFolder = true;
        }
      }, 300); // 大概时间300ms
    },

    // 文件夹重命名
    resetName(name) {
      clearTimeout(time);
      this.dialogRenameVisible = true;
    },

    // 确认命名文件夹
    sureRe() {
      console.log(this.selectRow, '...........')
      job.dragReName({
        id: this.selectRow.id,
        name: this.Rename
      }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getDataTree()
          this.dialogRenameVisible = false
        } else {
          this.$message.err(res.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },

    // 复制
    copyFile() {
      if (this.selectRow.parentId === 0) {
        this.$notify({
          message: '不能复制整个根目录数据',
          type: 'warning',
          duration: 1000
        });
        this.contextMenuVisible = false
      } else {
        this.selectRow = this.copyObja
        this.contextMenuVisible = false
        this.$notify({
          message: '复制成功',
          type: 'success',
          duration: 1000
        });
      }
    },

    // 粘贴
    pasteFile() {
      const params = {
        projectId: this.selectRow.projectId,
        parentId: this.selectRow.id,
        name: this.copyFile.name,
        type: this.selectRow.type,
        jobType: this.selectRow.jobType
      }
      job.createNewFile(params).then((res) => {
        if (res.code === 200) {
          this.getDataTree()
          this.selectRow = {}
          this.dialogNameVisible = false
          if (this.currentJob) {
            this.createNewJob(this.currentJob)
            this.currentJob = ''
          }
          this.allName = ''
          this.$message.success(res.content)
        } else {
          this.$message.error(res.msg)
        }
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 新增命名文件夹
    showAllName(name) {
      if (name) {
        this.dialogNameVisible = true
        this.currentJob = name
        console.log(name, 'name')
      } else {
        this.dialogNameVisible = true
      }
    },

    // 取消对话框
    cancelDialog() {
      this.dialogNameVisible = false
      this.dialogRenameVisible = false
      this.allName = ''
      this.Rename = ''
    },

    // 拖拽tree
    handleDragStart(node, ev) {
      this.dropId = node.data.id
      console.log('节点开始拖拽时触发的事件', node);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      this.targetId = dropNode.key
      console.log('拖拽进入其他节点时触发的事件', this.targetId);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('拖拽离开某个节点时触发的事件');
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('拖拽结束时（可能未成功）触发的事件');
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('拖拽成功完成时触发的事件');
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      job.dragReName({
        id: this.dropId,
        parentId: this.targetId
      }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          console.log(res.msg)
        } else {
          this.$message.err(res.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
      console.log('tree drop: ', dropNode.label, dropType, draggingNode);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.name === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    allowDrag(draggingNode) {
      console.log(draggingNode, 'draggingNode')
      return draggingNode.data.name.indexOf('三级 3-2-2') === -1;
    },

    // 新建文件夹
    createFolder() {
      console.log(this.selectRow)
      const params = {
        projectId: this.selectRow.projectId,
        parentId: this.selectRow.id,
        name: this.allName,
        type: this.selectRow.type,
        jobType: this.selectRow.jobType
      }
      job.createNewFile(params).then((res) => {
        if (res.code === 200) {
          this.getDataTree()
          this.selectRow = {}
          this.dialogNameVisible = false
          if (this.currentJob) {
            this.createNewJob(this.currentJob)
            this.currentJob = ''
          }
          this.allName = ''
          this.$message.success(res.content)
        } else {
          this.$message.error(res.msg)
        }
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    },

    // 点击删除文件夹
    delFolder() {
      this.$confirm('此操作将删除该文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        job.delFile(this.selectRow.id).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.getDataTree()
          }
        }).catch((err) => {
          console.log(err)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    handleNodeClick(data) {
      console.log(data)
      this.selectRow = data
      if (data.jobId) {
        job.getTaskInfo(data.jobId).then((res) => {
          console.log(res, 'content')
          if (res.code === 200) {
            this.getJobDetail(res.content)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    },

    getJobDetail(data) {
      this.$store.commit('SET_JOB_INFO', data)
      this.$store.commit('SET_TASKDETAIL_ID', data.id + '')
      const a = {};
      a.title = data.jobDesc;
      a.name = data.jobDesc;
      a.content = data;

      if (
        _.findIndex(
          this.$store.state.taskAdmin.taskDetailList,
          tab => tab.content.id === data.id
        ) === -1
      ) {
        this.$store.state.taskAdmin.taskDetailList.push(a);
        this.jobDetailIdx = a.content.id + '';
      } else {
        this.jobDetailIdx = a.content.id + '';
      }
      // this.jobType = 'SHOWDETAIL';
    },

    getList(data) {
      console.log(data);
      console.log(this.editableTabs);

      if (this.editableTabs.length > 0) {
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].title === data.name) {
            this.editableTabsValue = this.editableTabs[i].name;
            console.log(this.editableTabsValue);
            break;
          } else {
            this.editableTabs.push({
              title: data.name,
              name: (this.editableTabs.length + 1).toString()
            });
            this.editableTabsValue = this.editableTabs[
              this.editableTabs.length - 1
            ].name;
          }
        }
      } else {
        this.editableTabs.push({
          title: data.name,
          name: (this.editableTabs.length + 1).toString()
        });
      }
    },

    getItem(del) {
      this.listQuery.userId = JSON.parse(localStorage.getItem('userId'))
      jobProjectApi.list(this.listQuery).then(response => {
        const { records } = response;
        const { total } = response;
        this.total = total;
        this.options = records;
        this.options = objList(this.options, 'name')
        this.selectValue = this.options[0].id;
        this.fetchJobs(this.selectValue);

        const listQuery = {
          current: 1,
          size: 10000,
          jobGroup: 0,
          // projectIds: '',
          triggerStatus: -1,
          jobDesc: '',
          glueType: ''
        };
        listQuery.projectIds = this.projectIds
          ? this.projectIds
          : this.options[0].id;
        job.getList(listQuery).then(response => {
          const { content } = response;
          this.List = content.data;
          console.log(this.List);
          const firstElement = content?.data[0] || {};
          const a = {};

          a.title = firstElement.jobDesc;
          a.name = firstElement.jobDesc;
          a.content = firstElement;
          if (!this.firstTime) {
            if (!del) {
              // this.$store.state.taskAdmin.taskDetailList.push(a);
              this.$store.commit('ADD_TASKDETAIL', a);
              this.jobDetailIdx = a.content.id + '';
            }
          } else {
            this.firstTime = false;
          }
          this.jobDetailLoading = false;
        });
      });
    },

    /**
     * @description: 刷新列表
     */
    refreshList(isSaveInfo) {
      const removeIndex = _.findIndex(
        this.$store.state.taskAdmin.taskDetailList,
        ele => ele.content.id === isSaveInfo.content.id + ''
      );
      this.$store.commit('DELETE_TASKDETAIL', removeIndex);
      jobProjectApi.list(this.listQuery).then(response => {
        const { records } = response;
        const { total } = response;
        this.total = total;
        this.options = records;
        this.selectValue = this.options[0].id;
        this.fetchJobs(this.selectValue);

        const listQuery = {
          current: 1,
          size: 10000,
          jobGroup: 0,
          // projectIds: '',
          triggerStatus: -1,
          jobDesc: '',
          glueType: ''
        };
        listQuery.projectIds = this.projectIds
          ? this.projectIds
          : this.options[0].id;
        job.getList(listQuery).then(response => {
          const { content } = response;
          this.List = content.data;
          console.log(this.List);
          const a = {};
          const eleIndex = _.findIndex(
            this.List,
            ele => ele.id === isSaveInfo.content.id
          );
          a.title = this.List[eleIndex].jobDesc;
          a.name = this.List[eleIndex].jobDesc;
          a.content = this.List[eleIndex];
          if (!this.firstTime) {
            // if (!del) {
            // this.$store.state.taskAdmin.taskDetailList.push(a);
            this.$store.commit('ADD_TASKDETAIL', a);
            this.jobDetailIdx = a.content.id + '';
            // }
          } else {
            this.firstTime = false;
          }
          this.jobDetailLoading = false;
        });
      });
    },

    fetchJobs(event) {
      this.$store.commit('SET_PROJECT_ID', event);

      // 获取任务列表
      const listQuery = {
        current: 1,
        size: 10,
        jobGroup: 0,
        projectIds: event,
        triggerStatus: -1,
        jobDesc: '',
        glueType: ''
      };
      this.projectIds = event;

      job.getList(listQuery).then(response => {
        const { content } = response;
        this.List = content.data;
      });

      // 根据项目id获取数据源

      const p = {
        current: 1,
        size: 200,
        ascs: 'datasource_name',
        projectId: event
      };
      jdbcDsList(p).then(response => {
        const { records } = response;
        this.$store.commit('SET_DATASOURCE', records);
      });
    },

    createNewJob(command) {
      this.$store.commit('SET_READER_ISEDIT', false)
      console.log(command);
      this.$store.commit('SET_TAB_TYPE', command);
      this.jobType = command;
      this.jobDetailIdx = command;
    },

    handleCommand(command) {
      const commandId = command.split('/')[0]
      const commandName = command.split('/')[1]
      this.selectValue = commandName;
      this.$store.commit('SET_PROJECT_ID', commandId);

      // 获取任务列表
      const listQuery = {
        current: 1,
        size: 10,
        jobGroup: 0,
        projectIds: commandId,
        triggerStatus: -1,
        jobDesc: '',
        glueType: ''
      };
      this.projectIds = commandId;

      job.getList(listQuery).then(response => {
        const { content } = response;
        this.List = content.data;
      });

      // 根据项目id获取数据源

      const p = {
        current: 1,
        size: 200,
        ascs: 'datasource_name',
        projectId: commandId
      };
      jdbcDsList(p).then(response => {
        const { records } = response;
        this.$store.commit('SET_DATASOURCE', records);
      });
    },
    closeCreate() {
      this.jobType = ''
      this.$store.commit('SET_TAB_TYPE', '')
      if (this.$store.state.taskAdmin.taskDetailList.length <= 0) {
        this.jobDetailIdx = '欢迎'
      } else {
        this.jobDetailIdx = this.$store.state.taskAdmin.taskDetailList[0].content.id + ''
      }
    }
  }
};
</script>

<style lang="scss">
.Management {
  display: flex;
  // min-height: 660px;
  height: calc(100vh - 50px);
  // margin: 24px;
  // box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
  // border-radius: 8px;

  .lt {
    width: 360px;
    // min-height: 660px;
    // max-height: 700px;
    // overflow: scroll;
    // overflow: hidden;
    padding: 10px;
    // background: #f0f0f2;
    // background: #fff;
    background: #f8f8fa;
    // border-top-left-radius: 8px;
    // border-bottom-left-radius: 8px;
    // border-right: 1px solid #f0eded;

    .top {
      height: 42px;
      line-height: 34px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);

      .el-row {
        .el-col {
          i {
            cursor: pointer;
            margin-left: 20px;
          }

          // .el-select {
          //   .el-input__inner {
          //     border: none;
          //   }
          // }
        }
      }
    }

    .bottom {
      height: 100%;
      overflow-x: hidden;
      .body {
        border-top: 1px solid #f8f8f8;
        .el-scrollbar {
          height: calc(100vh - 181px);
          .list {
            ul {
              padding: 0px;
              li {
                height: 32px;
                font-size: 15px;
                line-height: 32px;
                // background-color: rgb(218, 243, 253);
                text-align: left;
                list-style: none;
                text-indent: 1rem;
                margin: 5px 0px;
                cursor: pointer;
              }
              li:hover {
                background-color: #DAF3FD;
              }
            }
          }
          .folder {
            padding: 0px;
            p {
              min-height: 32px;
              max-height: 100%;
              font-size: 15px;
              line-height: 32px;
              // background-color: rgb(218, 243, 253);
              text-align: left;
              list-style: none;
              text-indent: 1rem;
              margin: 5px 0px;
              ul {
                padding: 0px;
                margin-left: 30px;
                li {
                  height: 32px;
                  font-size: 15px;
                  line-height: 32px;
                  // background-color: rgb(218, 243, 253);
                  text-align: left;
                  list-style: none;
                  text-indent: 1rem;
                  margin: 5px 0px;
                  cursor: pointer;
                }
                li:hover {
                  background-color: #DAF3FD;
                }
              }
              i {
                float: right;
                margin-right:20px;
                margin-top: 8px;
                cursor: pointer;
              }
              i:hover {
                color: red;
              }
              a {
                cursor: pointer;
              }
              .svg-icon {
                cursor: pointer;
              }
            }
          }
          .el-tree {
            background-color: #f8f8fa;
          }
          .right-menu {
            border: 1px solid #eee;
            box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
            border-radius: 1px;
            display: block;
            font-family: Microsoft Yahei,Avenir,Helvetica,Arial,sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            color: #2c3e50;
            position: fixed;
            background: #fff;
            border: 1px solid rgba(0,0,0,.2);
            border-radius: 3px;
            z-index: 999;
            display: none;
            padding: 2px;
            box-shadow:5px 5px 10px gray;
            a {
              padding: 2px 15px;
              // width: 120px;
              height: 28px;
              line-height: 28px;
              text-align: left;
              display: block;
              color: #1a1a1a;
              text-decoration: none;
              font-size: 13px;
              i {margin-left: 20px;}
            }
            a:hover {
              background: #42b983;
              color: #fff;
            }
            hr {
              color: #eee;
            }
            #newFile {
              position: relative;
              .right-menu1 {
                border: 1px solid #eee;
                box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
                height: 400px;
                overflow-y: auto;
                border-radius: 1px;
                display: block;
                margin-left:116px;
                margin-top: 28px;
                font-family: Microsoft Yahei,Avenir,Helvetica,Arial,sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-align: center;
                color: #2c3e50;
                position: fixed;
                background: #fff;
                border: 1px solid rgba(0,0,0,.2);
                border-radius: 3px;
                z-index: 999;
                display: none;
                padding: 2px;
                box-shadow:5px 5px 10px gray;
                a {
                  padding: 2px 15px;
                  width: 176px;
                  height: 28px;
                  line-height: 28px;
                  text-align: left;
                  display: block;
                  color: #1a1a1a;
                  text-decoration: none;
                  font-size: 13px;
                  i {margin-left: 20px;}
                }
                a:hover {
                  background: #42b983;
                  color: #fff;
                }
                hr {
                  color: #eee;
                }
              }
            }
          }
        }
      }
    }
  }

  .rg {
    width: 100%;
    height: 100%;
    flex: 1;
    // min-height: 630px;

    .el-tabs {
      .el-tabs__content {
        height: calc(100vh - 80px);
        overflow-y: auto;
        overflow-x: auto;
        // background-color: #f7f9fb;
      }
      .el-tabs__header {
        height: 32px;
        line-height: 32px;
        .el-tabs__item {
          height: 32px;
          line-height: 32px;
        };
      }

      .el-tabs__item.is-active {
        background-color: #ffffff;
        border-bottom-color:  #3d5eff;
      }
      // .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
      //   height: 50px;
      //   line-height: 50px;
      // }
      .el-tab-pane {
        // padding: 10px;
        height: 100%;
        position: relative;
        .job_detail {
          height: 100%;
        }
        .title_h3 {
          position: absolute;
          font-size: 24px;
          font-weight: 700;
          font-family: "楷体";
          left: 24px;
          top: 30px;
        }
      }
    }
  }

  .rt {
    // overflow-x: scroll;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .input_serach > .el-input__prefix > .el-input__icon {
    line-height: 35px !important;
  }
}
</style>

<style scoped>
.el-bar-tab >>> .el-tabs__nav-scroll {
  background: #f8f8fa;
}

.el-bar-tab >>> .el-tabs__content {
  height: 660px;
  overflow: scroll;
  padding: 0;
}

.el-tree >>> .el-tree-node {
  margin: 5px 0px;
}

.el-bar-tab {
  border: 0;
  box-shadow: 0 0;
}

.task_icon {
  width: 16px;
  float: left;
  margin-top: 10px;
  margin-right: 8px;
}

.task_img {
  width: 16px;
  float: left;
  margin-top: 4px;
  margin-right: 5px;
}
.svg_icon {
  margin-right: 5px;
}
.list-highlight {
  background: #DAF3FD;
}
.top-icon:hover {
  color: #3d5eff;
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
