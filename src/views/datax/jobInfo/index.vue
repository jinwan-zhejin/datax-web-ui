<template>
  <div class="Management">
    <div class="lt">
      <div class="top">
        <el-row>
          <el-col :span="12">
            <el-select
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
            </el-select>
          </el-col>
          <el-col :span="12">
            <i class="el-icon-location-outline" />
            <i class="el-icon-coin" />
            <!-- <i class="el-icon-folder-add" /> -->
            <el-dropdown @command="createNewJob">
              <i class="el-icon-folder-add"></i>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-receiving" command="NORMAL"
                  >普通任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-collection" command="IMPORT"
                  >引入任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-files" command="EXPORT"
                  >导出任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-notebook-1"
                  command="COMPUTE"
                  disabled
                  >计算任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-present" command="SQLJOB"
                  >SQL任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-s-goods" command="SPARK"
                  >SPARK任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-sell" command="DQCJOB"
                  >质量任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-brush"
                  command="METACOLLECT"
                  divided
                  >元数据采集任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-brush" command="METACOMPARE"
                  >元数据比较任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-wallet" command="SHELL" divided
                  >SHELL任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-cpu" command="POWERSHELL"
                  >POWERSHELL任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-box" command="PYTHON"
                  >PYTHON任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-bank-card"
                  command="VJOB"
                  divided
                  >虚任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-bank-card"
                  command="JAVA"
                  divided
                  disabled
                  >Java任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-bank-card"
                  command="SCALA"
                  disabled
                  >Scala任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-bank-card"
                  command="PYSPARK"
                  disabled
                  >PySpark任务</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-bank-card" command="R" disabled
                  >R任务</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-copy-document"
                  command="BATCH"
                  divided
                  >任务批量构建</el-dropdown-item
                >
                <el-dropdown-item icon="el-icon-brush" command="TEMPLATE"
                  >普通任务模板</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="bottom">
        <div class="title">任务</div>
        <div class="body">
          <el-input
            v-model="search"
            prefix-icon="el-icon-search"
            placeholder="请输入内容"
          >
            <!-- <template slot="append">我的</template> -->
          </el-input>
          <div class="list">
            <ul>
              <li
                v-for="item in List"
                :key="item.jobDesc"
                @click="getJobDetail(item)"
              >
                <!--  -->
                <a
                  >{{ item.jobDesc }}
                  <span style="color: #ff5500">{{
                    item.glueType.replace("GLUE_", "").toLowerCase()
                  }}</span></a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="rg">
      <el-tabs
        v-model="jobDetailIdx"
        type="card"
        closable
        @tab-remove="removeJobTab"
      >
        <el-tab-pane
          :key="item.name"
          v-for="item in jobDetailTabs"
          :label="item.title"
          :name="item.name"
        >
          <JobDetail :jobInfo="item.content"></JobDetail>
        </el-tab-pane>
        <el-tab-pane
          :name="
            jobType === 'NORMAL'
              ? 'NORMAL'
              : jobType === 'IMPORT'
              ? 'IMPORT'
              : 'EXPORT'
          "
          :label="
            jobType === 'NORMAL'
              ? '普通任务'
              : jobType === 'IMPORT'
              ? '引入任务'
              : '导出任务'
          "
          v-if="
            jobType === 'NORMAL' || jobType === 'IMPORT' || jobType === 'EXPORT'
          "
        >
          <div class="rg">
            <JsonBuild @refresh="freshItem" />
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="引入任务"  v-if="jobType === 'IMPORT'">
          <div class="rg">
            <JsonBuild />
          </div>
        </el-tab-pane>
        <el-tab-pane label="导出任务" v-if="jobType === 'EXPORT'">
          <div class="rg">
            <JsonBuild />
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div v-if="jobType === 'VJOB'" class="rg">
      <el-tabs
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
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <Workflow :is-save="item" @fromChild="getChild" :taskList="List" />
        </el-tab-pane>
      </el-tabs>
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
      <SimpleJob jobType="GLUE_SHELL" jobTypeLabel="SHELL任务"></SimpleJob>
    </div>
    <div v-if="jobType === 'POWERSHELL'" class="rg">
      <SimpleJob
        jobType="GLUE_POWERSHELL"
        jobTypeLabel="POWERSHELL任务"
      ></SimpleJob>
    </div>
    <div v-if="jobType === 'PYTHON'" class="rg">
      <SimpleJob jobType="GLUE_PYTHON" jobTypeLabel="PYTHON任务"></SimpleJob>
    </div>
    <div v-if="jobType === 'SPARK'" class="rg">
      <SparkJob jobType="GLUE_SPARK" jobTypeLabel="SPARK任务"></SparkJob>
    </div>
    <div v-if="jobType === 'SQLJOB'" class="rg">
      <SqlJob jobType="GLUE_SQL" jobTypeLabel="SQL任务"></SqlJob>
    </div>
    <div v-if="jobType === 'METACOMPARE'" class="rg">
      <MetaCompare></MetaCompare>
    </div>
  </div>
</template>

<script>
import Workflow from "./components/workflow.vue";
import SimpleJob from "./components/simpleJob.vue";
import SparkJob from "./components/sparkJob.vue";
import JobDetail from "./components/jobDetail.vue";
import * as jobProjectApi from "@/api/datax-job-project";
import * as job from "@/api/datax-job-info";
import JsonBuild from "@/views/datax/json-build/index";
import JsonQuality from "@/views/datax/jsonQuality/index";
import BatchBuild from "@/views/datax/json-build-batch/index";
import JobTemplate from "@/views/datax/jobTemplate/index";
import SqlJob from "@/views/datax/jobInfo/components/sqlJob";
import MetaCompare from "@/views/datax/jobInfo/components/metaCompare";
import _ from "lodash";

export default {
  name: "",
  components: {
    // HelloWorld,
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
  },
  data() {
    return {
      editableTabsValue: "1",
      isDel: false,
      editableTabs: [
        {
          title: "Untitled",
          name: "1",
        },
      ],
      jobDetailTabs: [],
      tabIndex: 1,
      options: "",
      selectValue: "",
      search: "",
      List: [],
      listQuery: {
        pageNo: 1,
        pageSize: 100,
        searchVal: "",
      },
      jobType: "SHOWDETAIL",
      jobDetailIdx: "",
      jobTypeMap: "",
      jobDetailLoading: true,
    };
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
  },
  created() {
    this.getItem();
  },
  mounted() {},
  methods: {
    removeJobTab(name) {
      const removeIndex = _.findIndex(
        this.jobDetailTabs,
        (ele) => ele.name === name
      );
      if (this.jobDetailIdx === name) {
        this.jobDetailIdx =
          this.jobDetailTabs[removeIndex + 1]?.name ||
          this.jobDetailTabs[removeIndex - 1]?.name;
      }
      this.jobDetailTabs.splice(removeIndex, 1);
    },

    freshItem() {
      this.getItem();
      this.jobType = "SHOWDETAIL";
    },

    handleTabsEdit(targetName, action) {
      if (action === "add") {
        const newTabName = new Date().valueOf().toString();
        this.editableTabs.push({
          title: "Untitled",
          name: newTabName,
          content: "New Tab content",
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
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
          data: val.data,
        });
      } else {
        for (let i = 0; i < this.List.length; i++) {
          if (this.List[i].name === val.name) {
            this.editableTabsValue = val.index;
          } else {
            this.List.push({
              name: val.name,
              data: val.data,
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
      let a = {};
      a.title = data.jobDesc;
      a.name = data.jobDesc;
      a.content = data;
      console.log(this.jobDetailTabs);
      console.log(a);
      if (JSON.stringify(this.jobDetailTabs).indexOf(JSON.stringify(a)) == -1) {
        // this.$message.info("tab not found, open a new one  ")
        this.jobDetailTabs.push(a);
        this.jobDetailIdx = a.name;
      } else {
        this.jobDetailIdx = a.name;
      }
      this.jobType = "SHOWDETAIL";
      // this.jobListLoading = false
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
              name: (this.editableTabs.length + 1).toString(),
            });
            this.editableTabsValue = this.editableTabs[
              this.editableTabs.length - 1
            ].name;
          }
        }
      } else {
        this.editableTabs.push({
          title: data.name,
          name: (this.editableTabs.length + 1).toString(),
        });
      }
    },

    getItem() {
      jobProjectApi.list(this.listQuery).then((response) => {
        const { records } = response;
        const { total } = response;
        this.total = total;
        this.options = records;
        this.selectValue = this.options[0].name;
        let listQuery = {
          current: 1,
          size: 10,
          jobGroup: 0,
          // projectIds: '',
          triggerStatus: -1,
          jobDesc: "",
          glueType: "",
        };
        listQuery.projectIds = this.options[0].id;
        job.getList(listQuery).then((response) => {
          const { content } = response;
          this.List = content.data;
          let firstElement = content.data[0];
          let a = {};
          a.title = firstElement.jobDesc;
          a.name = firstElement.jobDesc;
          a.content = firstElement;
          this.jobDetailTabs.push(a);
          this.jobDetailIdx = a.name;
          this.jobDetailLoading = false;
        });
      });
    },

    fetchJobs(event) {
      console.log(event);
      let listQuery = {
        current: 1,
        size: 10,
        jobGroup: 0,
        // projectIds: '',
        triggerStatus: -1,
        jobDesc: "",
        glueType: "",
      };
      listQuery.projectIds = event;
      job.getList(listQuery).then((response) => {
        const { content } = response;
        this.List = content.data;
      });
    },

    createNewJob(command) {
      console.log(command);
      this.jobType = command;
      this.jobDetailIdx = command;
    },
  },
};
</script>

<style lang="scss">
.Management {
  display: flex;
  height: 100%;
  .lt {
    width: 280px;
    height: 100%;
    .top {
      height: 60px;
      line-height: 60px;
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
      .title {
        border-top: 1px solid #f8f8f8;
        height: 35px;
        line-height: 35px;
        text-align: center;
      }
      .body {
        border-top: 1px solid #f8f8f8;
        padding: 10px;
        .list {
          ul {
            padding: 2px;
            li {
              height: 20px;
              line-height: 20px;
              // background-color: rgb(218, 243, 253);
              text-align: left;
              list-style: none;
              text-indent: 0.5rem;
              margin: 5px 0px;
              cursor: pointer;
              a {
                color: rgb(0, 0, 0);
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
    margin-top: 20px;
    border: solid 1px lightgray;
    flex: 1;
    .el-tabs {
      .el-tab-pane {
        padding: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>
