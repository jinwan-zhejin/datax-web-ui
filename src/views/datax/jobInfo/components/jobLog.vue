<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="任务ID" width="80">
        <template slot-scope="scope">{{ scope.row.jobId }}</template>
      </el-table-column>
      <el-table-column align="center" label="任务描述">
        <template slot-scope="scope">{{ scope.row.jobDesc }}</template>
      </el-table-column>
      <el-table-column label="调度时间" align="center">
        <template slot-scope="scope">{{ scope.row.triggerTime }}</template>
      </el-table-column>
      <el-table-column label="调度结果" align="center" width="100">
        <!-- <template slot-scope="scope">
          <span :style="`color:${scope.row.triggerCode == 500 ? 'red' : ''}`">{{
            statusList.find((t) => t.value === scope.row.triggerCode).label
          }}</span></template
        > -->
      </el-table-column>
      <el-table-column label="调度备注" align="center">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="click">
            <h5 v-html="scope.row.triggerMsg" />
            <el-button slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center">
        <template slot-scope="scope">{{ scope.row.handleTime }}</template>
      </el-table-column>
      <el-table-column label="执行结果" align="center">
        <!-- <template slot-scope="scope">
          <span :style="`color:${scope.row.handleCode == 500 ? 'red' : ''}`">{{
            statusList.find((t) => t.value === scope.row.handleCode).label
          }}</span></template
        > -->
      </el-table-column>
      <el-table-column label="执行备注" align="center">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="400" trigger="click">
            <h5 v-html="scope.row.handleMsg" />
            <el-button slot="reference">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button
            v-show="row.executorAddress"
            type="primary"
            @click="handleViewJobLog(row)"
            >日志查看</el-button
          >
          <el-button
            v-show="row.handleCode === 0 && row.triggerCode === 200"
            type="primary"
            @click="killRunningJob(row)"
          >
            终止任务
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog append-to-body title="日志查看" :visible.sync="dialogVisible" width="95%">
      <div class="log-container">
        <pre :loading="logLoading" v-text="logContent" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          关闭
        </el-button>
        <el-button type="primary" @click="loadLog">
          刷新日志
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as log from "@/api/datax-job-log";
import * as job from '@/api/datax-job-info'

export default {
  props: ["id"],
  data() {
    return {
      listLoading: false,
      list: [],
      dialogVisible: false,
      listQuery: {
        current: 1,
        size: 10,
        jobGroup: 0,
        jobId: this.id,
        logStatus: -1,
        filterTime: "",
      },
     // 日志内容
      logContent: '',
      // 显示日志
      logShow: false,
      // 日志显示加载中效果
      logLoading: false,
       // 日志查询参数
      jobLogQuery: {
        executorAddress: '',
        triggerTime: '',
        id: '',
        fromLineNum: 1
      },
      // handleViewJobLog: false,
      dialogVisible:false,
    };
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      const param = Object.assign({}, this.listQuery);
      //   const urlJobId = this.$route.query.jobId;
      //   if (urlJobId > 0 && !param.jobId) {
      //     param.jobId = urlJobId;
      //   } else if (!urlJobId && !param.jobId) {
      //     param.jobId = 0;
      //   }
      log.getList(param).then((response) => {
        const { content } = response;
        this.total = content.recordsTotal;
        this.list = content.data;
        this.listLoading = false;
      });
    },

    // 查看日志
    handleViewJobLog(row) {
      // const str = location.href.split('#')[0]
      // window.open(`${str}#/ router的name `)
      this.dialogVisible = true

      this.jobLogQuery.executorAddress = row.executorAddress
      this.jobLogQuery.id = row.id
      this.jobLogQuery.triggerTime = Date.parse(row.triggerTime)
      if (this.logShow === false) {
        this.logShow = true
      }
      // window.open(`#/data/log?executorAddress=${this.jobLogQuery.executorAddress}&triggerTime=${this.jobLogQuery.triggerTime}&id=${this.jobLogQuery.id}&fromLineNum=${this.jobLogQuery.fromLineNum}`)
      this.loadLog()
    },
    // 获取日志
    loadLog() {
      this.logLoading = true
      log.viewJobLog(this.jobLogQuery.executorAddress, this.jobLogQuery.triggerTime, this.jobLogQuery.id,
        this.jobLogQuery.fromLineNum).then(response => {
        // 判断是否是 '\n'，如果是表示显示完成，不重新加载
        if (response.content.logContent === '\n') {
          // this.jobLogQuery.fromLineNum = response.toLineNum - 20;
          // 重新加载
          // setTimeout(() => {
          //   this.loadLog()
          // }, 2000);
        } else {
          this.logContent = response.content.logContent
        }
        this.logLoading = false
      })
    },
  },

  created() {
      this.fetchData()
  }
};
</script>

<style>
</style>