<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <div v-if="isLoading" v-loading="loading" class="Loading" />

    <el-row v-else :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>成功</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="successCount" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>失败</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="failCount" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>正在执行</span>
            <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="runningCount" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>数据源连接数</span>
            <el-tooltip class="item" effect="dark" content="所有数据源数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.connectDataSource" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>质量规则数</span>
            <el-tooltip class="item" effect="dark" content="质量规则总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.configedRule" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>通用规则数</span>
            <el-tooltip class="item" effect="dark" content="通用规则总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.generalRule" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>个性化规则数</span>
            <el-tooltip class="item" effect="dark" content="个性化规则总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.personalRule" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>规则统计数</span>
            <el-tooltip class="item" effect="dark" content="对于已经应用到质量规则任务中的规则统计数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.usedRule.length" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>表</span>
            <el-tooltip class="item" effect="dark" content="所有数据源的所有表的数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.table" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>数据库</span>
            <el-tooltip class="item" effect="dark" content="所有数据源的schema或者database数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.database" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>项目数据源</span>
            <el-tooltip class="item" effect="dark" content="所有项目数据源总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.itemDataSource" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>项目总数</span>
            <el-tooltip class="item" effect="dark" content="所用项目总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.item" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>项目用户总数</span>
            <el-tooltip class="item" effect="dark" content="所有项目用户总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.itemUser" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>项目任务总数</span>
            <el-tooltip class="item" effect="dark" content="所有项目任务总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.itemTask" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>项目任务分布统计</span>
            <el-tooltip class="item" effect="dark" content="项目任务数量分布" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.itemTaskDistribution[2].num" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>接口总数</span>
            <el-tooltip class="item" effect="dark" content="接口列表里的接口总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.interfaceNum" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>未审核接口总数</span>
            <el-tooltip class="item" effect="dark" content="未审核接口总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.approvingInterface" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>拒绝接口数</span>
            <el-tooltip class="item" effect="dark" content="提交注册后但是拒绝的接口数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.rejectInterface" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>审核通过接口总数</span>
            <el-tooltip class="item" effect="dark" content="提交注册并审核通过接口总数" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.passInterface" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>任务类型分布统计</span>
            <el-tooltip class="item" effect="dark" content="所有项目任务按类别统计数量" placement="top-start">
              <i class="el-icon-info" />
            </el-tooltip>
          </div>
          <div class="content">
            <span>
              <count-to :start-val="0" :end-val="KPI.taskTypeDistribution[0].num" :duration="3200" class="card-panel-num" />
            </span>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;margin-top:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>-->
      <!--<el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>-->
      <!--<el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>-->
    </el-row>

    <!--<el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'
import * as dashborad from '@/api/dashborad'
import CountTo from 'vue-count-to'

const lineChartData = {
  chartInfo: {
    failData: [],
    successData: [],
    dayList: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    CountTo
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.chartInfo,
      KPI: '',
      runningCount: '',
      failCount: '',
      successCount: '',
      loading: true,
      isLoading: true
    }
  },
  created() {
    this.chartInfo()
    this.getDataKPI()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getDataKPI() {
      dashborad.getKPI().then(res => {
        console.log(res)
        if (res.code === 200) {
          localStorage.setItem('AllDataKPI', JSON.stringify(res.content))
          this.KPI = res.content
          this.loading = false
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    chartInfo() {
      dashborad.chartInfo().then(response => {
        const { content } = response
        this.lineChartData.successData = content.triggerDayCountSucList
        this.lineChartData.failData = content.triggerDayCountFailList
        this.lineChartData.dayList = content.triggerDayList
        localStorage.setItem('countSucTotal', content.triggerCountSucTotal)
        localStorage.setItem('countRunningTotal', content.triggerCountRunningTotal)
        localStorage.setItem('countFailTotal', content.triggerCountFailTotal)
        this.successCount = content.triggerCountSucTotal
        this.failCount = content.triggerCountFailTotal
        this.runningCount = content.triggerCountRunningTotal
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .Loading {
    height: 800px;
    width: 100%;
    background-color:#99a9bf;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #3679d6;
  }
  .bg-purple {
    background: #ffffff;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    height: 160px;
    padding: 20px;
    margin-top: 20px;
    overflow: hidden;
    .title {
      height: 40px;
      line-height:40px;
      font-size: 24px;
      font-weight: '700';
      color: #9298a5;
      margin-bottom: 20px;
      i {
        float: right;
        margin: 5px;
      }
    }
    .content {
      span {
        font-size: 50px;
        font-weight: '700';
        color: #000;
      }
    }
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
