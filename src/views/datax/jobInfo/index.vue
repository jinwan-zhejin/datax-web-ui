<template>
  <div class="Management">
    <div class="lt">
      <div class="top">
        <el-row>
          <el-col :span="12">
            <el-select v-model="selectValue" placeholder="请选择" @change="fetchJobs">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col :span="12">
            <i class="el-icon-location-outline" />
            <i class="el-icon-coin" />
            <el-dropdown @command="createNewJob">
              <i class="el-icon-folder-add" />
              <el-dropdown-menu>
                <el-dropdown-item command="NORMAL">
                  <svg-icon icon-class="NORMAL" /> 普通任务
                </el-dropdown-item>
                <el-dropdown-item command="IMPORT"><svg-icon icon-class="IMPORT" />引入任务</el-dropdown-item>
                <el-dropdown-item command="EXPORT">
                  <svg-icon icon-class="EXPORT" />导出任务
                </el-dropdown-item>
                <el-dropdown-item command="COMPUTE" disabled><svg-icon icon-class="COMPUTE" />计算任务</el-dropdown-item>
                <el-dropdown-item command="SQLJOB"><svg-icon icon-class="SQLJOB" />SQL任务</el-dropdown-item>
                <el-dropdown-item command="SPARK"><svg-icon icon-class="SPARK" />SPARK任务</el-dropdown-item>
                <el-dropdown-item command="DQCJOB"><svg-icon icon-class="DQCJOB" />质量任务</el-dropdown-item>
                <el-dropdown-item command="METACOLLECT" divided><svg-icon icon-class="METACOLLECT" />元数据采集任务</el-dropdown-item>
                <el-dropdown-item command="METACOMPARE"><svg-icon icon-class="METACOMPARE" />元数据比较任务</el-dropdown-item>
                <el-dropdown-item command="SHELL" divided><svg-icon icon-class="SHELL" />SHELL任务</el-dropdown-item>
                <el-dropdown-item command="POWERSHELL"><svg-icon icon-class="POWERSHELL" />POWERSHELL任务</el-dropdown-item>
                <el-dropdown-item command="PYTHON"><svg-icon icon-class="PYTHON" />PYTHON任务</el-dropdown-item>
                <el-dropdown-item command="VJOB" divided><svg-icon icon-class="VJOB" />虚任务</el-dropdown-item>
                <el-dropdown-item command="JAVA" divided disabled><svg-icon icon-class="JAVA" />Java任务</el-dropdown-item>
                <el-dropdown-item command="SCALA" disabled><svg-icon icon-class="SCALA" />Scala任务</el-dropdown-item>
                <el-dropdown-item command="PYSPARK" disabled><svg-icon icon-class="PYSPARK" />PySpark任务</el-dropdown-item>
                <el-dropdown-item command="R" disabled><svg-icon icon-class="R" />R任务</el-dropdown-item>
                <el-dropdown-item command="BATCH" divided><svg-icon icon-class="BATCH" />任务批量构建</el-dropdown-item>
                <el-dropdown-item command="TEMPLATE"><svg-icon icon-class="TEMPLATE" />普通任务模板</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <div class="body">
          <el-input v-model="search" class="input_serach" prefix-icon="el-icon-search" placeholder="任务名称/ID/代码" />
          <div class="list">
            <ul>
              <li v-for="item in List" :key="item.id" @click="getJobDetail(item)">
                <svg-icon :icon-class="item.jobType" />
                <a style="color: rgba(102, 102, 102, 1)">
                  {{ item.jobDesc }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="rg rt">
      <el-tabs v-model="jobDetailIdx" type="border-card" closable class="el-bar-tab" @tab-remove="removeJobTab" @tab-click="JobTabClick">
        <el-tab-pane v-if="!$store.state.taskAdmin.taskDetailList.length" label="欢迎" name="欢迎">
          欢迎
        </el-tab-pane>

        <el-tab-pane v-for="item in $store.state.taskAdmin.taskDetailList" :key="item.content.id" :label="item.title" :name="item.content.id + ''">
          <JobDetail :job-info="item.content" @deleteJob="getItem" @deleteDetailTab="clearJobTab" />
        </el-tab-pane>

        <el-tab-pane v-if="$store.state.taskAdmin.tabType" :name="$store.state.taskAdmin.tabType" :label="$store.state.taskAdmin.allTabType[$store.state.taskAdmin.tabType]">
          <div v-if="jobType === 'NORMAL' || jobType === 'IMPORT' || jobType === 'EXPORT'" class="rg">
            <JsonBuild />
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
            <SimpleJob job-type="GLUE_POWERSHELL" job-type-label="POWERSHELL任务" />
          </div>
          <div v-if="jobType === 'PYTHON'" class="rg">
            <SimpleJob job-type="GLUE_PYTHON" job-type-label="PYTHON任务" />
          </div>
          <div v-if="jobType === 'METACOMPARE'" class="rg">
            <MetaCompare />
          </div>
          <div v-if="jobType === 'VJOB'" class="rg">
            <!-- <el-tabs
                v-model="editableTabsValue"
                type="card"
                addable
                :closable="isDel"
                @tab-remove="handleRemove"
                @edit="handleTabsEdit"
                @tab-click="changeTab"
              >
                <el-tab-pane
                  v-for="item in editableTabs"
                  :key="item.id"
                  :label="item.title"
                  :name="item.name"
                >
                </el-tab-pane>
              </el-tabs> -->
            <Workflow :is-save="item" :task-list="List" @fromChild="getChild" />
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>

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

import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'

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
    MetaCompare
  },
  data() {
    return {
      editableTabsValue: '1',
      isDel: false,
      editableTabs: [{
        title: 'Untitled',
        name: '1'
      }],
      tabIndex: 1,
      options: '',
      selectValue: '',
      search: '',
      List: [],
      listQuery: {
        pageNo: 1,
        pageSize: 1000,
        searchVal: ''
      },
      jobType: 'SHOWDETAIL',
      jobDetailIdx: '欢迎',
      jobTypeMap: '',
      jobDetailLoading: true,
      firstTime: true,
      projectIds: ''
    };
  },
  computed: {
    taskList() { // 任务列表
      return this.$store.state.taskAdmin.taskList
    },

    taskDetailID() {
      return this.$store.state.taskAdmin.taskDetailID
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
      this.List = val
    },

    taskDetailID(val) {
      this.jobDetailIdx = val
    }
  },

  created() {
    this.getItem();
    console.log(this.$store.state);
  },
  methods: {
    removeJobTab(name) {
      const removeIndex = _.findIndex(
        this.$store.state.taskAdmin.taskDetailList,
        (ele) => ele.content.id == name
      );
      if (this.jobDetailIdx === name) {
        this.jobDetailIdx =
                    (this.$store.state.taskAdmin.taskDetailList[removeIndex + 1]?.content?.id ||
                        this.$store.state.taskAdmin.taskDetailList[removeIndex - 1]?.content?.id) + '';
      }
      if (this.$store.state.taskAdmin.tabTypeArr.indexOf(name) != -1) {
        this.jobType = '';
        this.$store.commit('SET_TAB_TYPE', '')
      } else {
        this.$store.commit('DELETE_TASKDETAIL', removeIndex)
        if (this.$store.state.taskAdmin.taskDetailList.length === 0) {
          this.jobDetailIdx = '欢迎';
        }
      }
    },

    JobTabClick(ele) {
      this.jobType = ele.name;
    },

    clearJobTab(name) {
      const removeIndex = _.findIndex(
        this.$store.state.taskAdmin.taskDetailList,
        (ele) => ele.content.id == name
      );
      this.jobDetailIdx =
                (this.$store.state.taskAdmin.taskDetailList[removeIndex + 1]?.content?.id ||
                    this.$store.state.taskAdmin.taskDetailList[removeIndex - 1]?.content?.id) + '';
      this.$store.commit('DELETE_TASKDETAIL', removeIndex)
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
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
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

    getJobDetail(data) {
      console.log(data);
      const a = {};
      a.title = data.jobDesc;
      a.name = data.jobDesc;
      a.content = data;

      if (_.findIndex(this.$store.state.taskAdmin.taskDetailList, (tab) => tab.content.id == data.id) === -1) {
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
      jobProjectApi.list(this.listQuery).then((response) => {
        const {
          records
        } = response;
        const {
          total
        } = response;
        this.total = total;
        this.options = records;
        this.selectValue = this.options[0].id;
        this.fetchJobs(this.selectValue)

        const listQuery = {
          current: 1,
          size: 10000,
          jobGroup: 0,
          // projectIds: '',
          triggerStatus: -1,
          jobDesc: '',
          glueType: ''
        };
        listQuery.projectIds = this.projectIds ? this.projectIds : this.options[0].id;
        job.getList(listQuery).then((response) => {
          const {
            content
          } = response;
          this.List = content.data;
          const firstElement = content?.data[0] || {};
          const a = {};

          a.title = firstElement.jobDesc;
          a.name = firstElement.jobDesc;
          a.content = firstElement;
          if (!this.firstTime) {
            if (!del) {
              // this.$store.state.taskAdmin.taskDetailList.push(a);
              this.$store.commit('ADD_TASKDETAIL', a)
              this.jobDetailIdx = a.content.id + '';
            }
          } else {
            this.firstTime = false;
          }
          this.jobDetailLoading = false;
        });
      });
    },

    fetchJobs(event) {
      this.$store.commit('SET_PROJECT_ID', event)

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

      job.getList(listQuery).then((response) => {
        const {
          content
        } = response;
        this.List = content.data;
      });

      // 根据项目id获取数据源

      const p = {
        current: 1,
        size: 200,
        ascs: 'datasource_name',
        projectId: event
      }
      jdbcDsList(p).then(response => {
        const { records } = response
        this.$store.commit('SET_DATASOURCE', records)
      })
    },

    createNewJob(command) {
      console.log(command);
      this.$store.commit('SET_TAB_TYPE', command)
      this.jobType = command;
      this.jobDetailIdx = command;
    }
  }
};
</script>

<style lang="scss">
.Management {
    display: flex;
    min-height: 660px;
    margin: 24px;
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    .lt {
        width: 280px;
        min-height: 660px;
        max-height: 700px;
        overflow: scroll;
        padding: 10px;
        background: #F0F0F2;

        .top {
            height: 66px;
            line-height: 60px;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .el-row {
                .el-col {
                    i {
                        cursor: pointer;
                        margin-left: 20px;
                    }

                    .el-select {
                        .el-input__inner {
                            border: none;
                        }
                    }
                }
            }
        }

        .bottom {
            height: 100%;

            .body {
                border-top: 1px solid #f8f8f8;

                .list {
                    ul {
                        padding: 0px;

                        li {
                            height: 24px;
                            font-size: 15px;
                            line-height: 24px;
                            // background-color: rgb(218, 243, 253);
                            text-align: left;
                            list-style: none;
                            text-indent: 1rem;
                            margin: 5px 0px;
                            cursor: pointer;
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
        min-height: 630px;

        .el-tabs {
            .el-tab-pane {
                // padding: 10px;
                height: 100%;
                .job_detail{
                    height: 100%;
                }
            }
        }
    }

    .rt {
        overflow-x: scroll;
    }

    .input_serach>.el-input__prefix>.el-input__icon {
        line-height: 35px !important;
    }

}
</style>

<style scoped>
.el-bar-tab>>>.el-tabs__nav-scroll {
    background: rgb(240, 240, 242);
}

.el-bar-tab>>>.el-tabs__content {
    height: 660px;
    overflow: scroll;
    padding: 0;
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
</style>
