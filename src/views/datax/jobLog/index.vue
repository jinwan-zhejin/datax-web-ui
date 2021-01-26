<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card ">
        <div class="text item">
          <div class="left">日志管理</div>
          <el-col class="left-description">
            管理任务执行打印的日志。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form
        class="search-bar"
        label-position="right"
        label-width="auto"
        :inline="true"
      >
        <el-form-item label="任务名称：">
          <el-input
            v-model="listQuery.jobName"
            clearable
            size="small"
            placeholder="任务名称"
          />
        </el-form-item>
        <el-form-item label="执行器：">
          <el-select v-model="listQuery.jobGroup" placeholder="执行器">
            <el-option
              v-for="item in executorList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="结果类型：">
          <el-select v-model="listQuery.logStatus" placeholder="类型">
            <el-option
              v-for="item in logStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >搜 索</el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="reSet"
          >重 置</el-button>
        </el-form-item>
      </el-form>
      <el-form
        class="action-bar"
        label-position="right"
        label-width="auto"
        :inline="true"
      >
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-delete"
            @click="handlerDelete"
          >清除记录</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        highlight-current-row
        :header-cell-style="{ background: '#fafafc', color: '#666666' }"
      >
        <!-- height="calc(100vh - 385px)" -->
        <el-table-column align="center" label="任务名称" width="200">
          <template slot-scope="scope">{{ scope.row.jobDesc }}</template>
        </el-table-column>
        <el-table-column label="调度时间" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.triggerTime }}</template>
        </el-table-column>
        <el-table-column label="调度结果" align="center" width="100">
          <template slot-scope="scope">
            <span :style="`color:${scope.row.triggerCode == 500 ? 'red' : ''}`">
              {{
                statusList.find(t => t.value === scope.row.triggerCode).label
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="调度备注" align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" trigger="click">
              <h5 v-html="triggerMsg(scope.row.triggerMsg)" />
              <el-button slot="reference" type="text">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="执行时间" align="center" width="200">
          <template slot-scope="scope">{{ scope.row.handleTime }}</template>
        </el-table-column>
        <el-table-column label="执行结果" align="center">
          <template slot-scope="scope">
            <span :style="`color:${scope.row.handleCode == 500 ? 'red' : ''}`">
              {{ statusList.find(t => t.value === scope.row.handleCode).label }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="执行备注" align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="400" trigger="click">
              <h5 v-html="handleMsg(scope.row.handleMsg)" />
              <el-button slot="reference" type="text">查看</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="{ row }">
            <el-button
              v-show="row.executorAddress"
              type="text"
              @click="handleViewJobLog(row)"
            >日志查看</el-button>
            <el-divider
              v-show="
                row.executorAddress &&
                  (row.handleCode === 0 && row.triggerCode === 200)
              "
              direction="vertical"
            />
            <el-button
              v-show="row.handleCode === 0 && row.triggerCode === 200"
              type="text"
              @click="killRunningJob(row)"
            >
              终止任务
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        style="float: right; margin: 0;"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="fetchData"
      />
    </div>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="center"
        label-width="100px"
      >
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="执行器">
              <el-input size="medium" value="全部" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="任务">
              <el-input size="medium" value="全部" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :offset="5">
            <el-form-item label="清除数据">
              <el-select
                v-model="temp.deleteType"
                placeholder="请选择清除数据时段"
                style="width: 100%"
              >
                <el-option
                  v-for="item in deleteTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="deleteLog">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="日志查看" :visible.sync="dialogVisible" width="60%">
      <div class="log-container">
        <pre :loading="logLoading" v-text="logContent" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">
          关闭
        </el-button>
        <el-button size="small" type="primary" @click="loadLog">
          刷新日志
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as log from '@/api/datax-job-log';
import * as job from '@/api/datax-job-info';
import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import { translaterMaster } from '@/utils/dictionary';

export default {
  name: 'JobLog',
  components: { Pagination },
  directives: { waves },
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
  data() {
    return {
      dialogVisible: false,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        jobGroup: 0,
        jobId: '',
        jobName: '',
        logStatus: -1,
        filterTime: '',
        userId: ''
      },
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      executorList: '',
      textMap: {
        create: 'Clear'
      },
      rules: {},
      temp: {
        deleteType: 1,
        jobGroup: 0,
        jobId: 0
      },
      statusList: [
        { value: 500, label: '失败' },
        { value: 502, label: '失败(超时)' },
        { value: 200, label: '成功' },
        { value: 0, label: '无' }
      ],
      deleteTypeList: [
        { value: 1, label: '清理一个月之前日志数据' },
        { value: 2, label: '清理三个月之前日志数据' },
        { value: 3, label: '清理六个月之前日志数据' },
        { value: 4, label: '清理一年之前日志数据' },
        { value: 5, label: '清理一千条以前日志数据' },
        { value: 6, label: '清理一万条以前日志数据' },
        { value: 7, label: '清理三万条以前日志数据' },
        { value: 8, label: '清理十万条以前日志数据' },
        { value: 9, label: '清理所有日志数据' }
      ],
      logStatusList: [
        { value: -1, label: '类型 - 全部' },
        { value: 1, label: '成功' },
        { value: 2, label: '失败' },
        { value: 3, label: '进行中' }
      ],
      // 日志查询参数
      jobLogQuery: {
        executorAddress: '',
        triggerTime: '',
        id: '',
        fromLineNum: 1
      },
      // 日志内容
      logContent: '',
      // 显示日志
      logShow: false,
      // 日志显示加载中效果
      logLoading: false
    };
  },
  computed: {
    /**
     * @description: 调度备注
     */
    triggerMsg() {
      return resource => {
        const items = resource.split('<br>');
        items.forEach(element => {
          if (element.indexOf('</span>') > -1 || element === '') {
            return;
          } else {
            var temp = element.split('：');
            // console.log();
            resource = resource.replace(
              element,
              '<span style="color:#999999;">' +
                translaterMaster(temp[0]) +
                '</span>：<span style="color:#333333;">' +
                temp[1] +
                '</span>'
            );
          }
        });
        return resource;
      };
    },
    /**
     * @description: 执行备注 格式化+翻译
     */
    handleMsg() {
      return resource => {
        if (resource === null) {
          return '无';
        } else if (resource.indexOf('{') <= -1) {
          return resource;
        } else {
          var temp = '';
          const reg = /^[A-Z]+$/;
          var temp1 = resource.split('{');
          var temp1Array = temp1[0].split('');
          for (var i = 0; i < temp1Array.length; i++) {
            if (reg.test(temp1Array[i])) {
              temp1Array[i] = '_' + temp1Array[i];
            }
          }
          temp1Array = temp1Array.join('');
          temp += `<span style="color:#666666;font-size:16px;">${translaterMaster(
            temp1Array
          )}</span><br>{<br>`;
          var temp2 = temp1[1].substring(0, temp1[1].length - 1);
          var temp21 = temp2.split(', ');
          for (i = 0; i < temp21.length; i++) {
            var temp22 = temp21[i].split('=')[0];
            var temp2Array = temp22.split('');
            for (var k = 0; k < temp2Array.length; k++) {
              if (reg.test(temp2Array[k])) {
                temp2Array[k] = '_' + temp2Array[k];
              }
            }
            temp2Array = temp2Array.join('');
            temp += `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#999999;">${translaterMaster(
              temp2Array
            )}：</span><span style="color:#333333;">${
              temp21[i].split('=')[1]
            }</span><br>`;
          }
          temp += `}`;
          // console.log(temp);
          return temp;
        }
      };
    }
  },
  created() {
    this.fetchData();
    this.getExecutor();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      const param = Object.assign({}, this.listQuery);
      if (localStorage.getItem('userId') === '1') {
        console.log(localStorage.getItem('userId'))
        param.userId = 0
      } else {
        console.log('2')
        param.userId = parseInt(localStorage.getItem('userId'))
      }
      const urlJobId = this.$route.query.jobId;
      if (urlJobId > 0 && !param.jobId) {
        param.jobId = urlJobId;
      } else if (!urlJobId && !param.jobId) {
        param.jobId = 0;
      }
      log.getList(param).then(response => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        console.log(this.list);
        this.listLoading = false;
      });
    },
    getExecutor() {
      job.getExecutorList().then(response => {
        const { content } = response;
        this.executorList = content;
        const defaultParam = { id: 0, title: '执行器 - 全部' };
        this.executorList.unshift(defaultParam);
        this.listQuery.jobGroup = this.executorList[0].id;
      });
    },
    handlerDelete() {
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    deleteLog() {
      log
        .clearLog(this.temp.jobGroup, this.temp.jobId, this.temp.deleteType)
        .then(response => {
          this.fetchData();
          this.dialogFormVisible = false;
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          });
        });
      // const index = this.list.indexOf(row)
    },
    // 查看日志
    handleViewJobLog(row) {
      // const str = location.href.split('#')[0]
      // window.open(`${str}#/ router的name `)
      this.dialogVisible = true;

      this.jobLogQuery.executorAddress = row.executorAddress;
      this.jobLogQuery.id = row.id;
      this.jobLogQuery.triggerTime = Date.parse(row.triggerTime);
      if (this.logShow === false) {
        this.logShow = true;
      }
      // window.open(`#/data/log?executorAddress=${this.jobLogQuery.executorAddress}&triggerTime=${this.jobLogQuery.triggerTime}&id=${this.jobLogQuery.id}&fromLineNum=${this.jobLogQuery.fromLineNum}`)
      this.loadLog();
    },
    // 获取日志
    loadLog() {
      this.logLoading = true;
      if (this.$store.state.taskAdmin.logViewType === 0) {
        log
          .viewJobLog(
            this.jobLogQuery.executorAddress,
            this.jobLogQuery.triggerTime,
            this.jobLogQuery.id,
            this.jobLogQuery.fromLineNum
          )
          .then(response => {
            // 判断是否是 '\n'，如果是表示显示完成，不重新加载
            if (response.content.logContent === '\n') {
              // this.jobLogQuery.fromLineNum = response.toLineNum - 20;
              // 重新加载
              // setTimeout(() => {
              //   this.loadLog()
              // }, 2000);
            } else {
              this.logContent = response.content.logContent;
            }
            this.logLoading = false;
          });
      } else if (this.$store.state.taskAdmin.logViewType === 1) {
        log
          .viewJobLogVirtual(
            this.jobLogQuery.executorAddress,
            this.jobLogQuery.triggerTime,
            this.jobLogQuery.id,
            this.jobLogQuery.fromLineNum
          )
          .then(response => {
            // 判断是否是 '\n'，如果是表示显示完成，不重新加载
            if (response.content.logContent === '\n') {
              // this.jobLogQuery.fromLineNum = response.toLineNum - 20;
              // 重新加载
              // setTimeout(() => {
              //   this.loadLog()
              // }, 2000);
            } else {
              this.logContent = response.content.logContent;
            }
            this.logLoading = false;
          });
      }
    },
    killRunningJob(row) {
      log.killJob(row).then(response => {
        this.fetchData();
        this.dialogFormVisible = false;
        this.$notify({
          title: 'Success',
          message: 'Kill Successfully',
          type: 'success',
          duration: 2000
        });
      });
    },
    /**
     * @description: 重置
     */
    reSet() {
      this.listQuery.jobName = ''
      this.listQuery.jobGroup = this.executorList[0].id
      this.listQuery.logStatus = this.logStatusList[0].value
      this.fetchData()
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .el-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
      border: 0 !important;
      border-radius: 0;
      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000a6;
        margin: 15px 24px;
      }
    }
  }
  .main {
    padding: 24px;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;
    .search-bar {
      background: #ffffff;

      >>> .el-form-item__label {
        font-weight: normal;
        font-size: 15px;
        line-height: 42px;
      }
    }
  }
}
.log-container {
  margin-bottom: 20px;
  background: #f5f5f5;
  width: 100%;
  height: 400px;
  overflow: scroll;
  pre {
    display: block;
    padding: 10px;
    margin: 0 0 10.5px;
    word-break: break-all;
    word-wrap: break-word;
    color: #334851;
    background-color: #f5f5f5;
    // border: 1px solid #ccd1d3;
    border-radius: 1px;
  }
}
.el-table {
  >>> th {
    background: #fafafc;
  }
}
.el-form {
  >>> .el-form-item__label {
    font-size: 16px;
    font-family: PingFangHK-Medium, PingFangHK;
    font-weight: 500;
  }
}
>>> .el-dialog__footer {
  border-top: 1px solid #f3f3f3;
  padding: 20px;
}
.el-select {
  >>> .el-input .el-input__inner {
    text-overflow: ellipsis;
  }
}
</style>
