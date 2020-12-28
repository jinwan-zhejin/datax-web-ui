<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <div v-loading="isLoading" class="statistics">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>项目</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push({ name: 'jobProject' })">
                <span>项目总数</span>
                <el-tooltip class="item" effect="dark" content="所用项目总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.item" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目数据源</span>
                <el-tooltip class="item" effect="dark" content="所有项目数据源总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.itemDataSource" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目用户总数</span>
                <el-tooltip class="item" effect="dark" content="所有项目用户总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.itemUser" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目任务总数</span>
                <el-tooltip class="item" effect="dark" content="所有项目任务总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.itemTask" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目任务分布统计</span>
                <el-tooltip class="item" effect="dark" content="项目任务数量分布" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col v-if="!isLoading">
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.itemTaskDistribution" /> -->
                <pie-chart :chart-data="transformArrPieChart(KPI.itemTaskDistribution)" />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目任务类型分布</span>
                <el-tooltip class="item" effect="dark" content="项目任务类型分布" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col v-if="!isLoading">
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.itemTaskTypeDistribution" /> -->
                <bar-chart :chart-data="transformArrBarChart(KPI.itemTaskTypeDistribution)" />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>项目任务运行状态分布</span>
                <el-tooltip class="item" effect="dark" content="项目任务运行状态分布" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col v-if="!isLoading">
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.itemTaskRunStateDistribution" /> -->
                <line-chart :chart-data="transformArrBarChart2(KPI.itemTaskRunStateDistribution)" />
              </el-col>
            </el-card>
            <!-- {{ KPI.itemTaskRunStateDistribution }} -->
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>数据源</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>数据源连接数</span>
                <el-tooltip class="item" effect="dark" content="所有数据源数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="KPI.connectDataSource" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(KPI.connectDataSource, KPI.itemDataSource)"
                  :width="100"
                  type="dashboard"
                  :percentage="toPercentNum(KPI.connectDataSource, KPI.itemDataSource)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>数据库</span>
                <el-tooltip class="item" effect="dark" content="所有数据源的schema或者database数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.database" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>表</span>
                <el-tooltip class="item" effect="dark" content="所有数据源的所有表的数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.table" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>任务</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>成功</span>
                <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="successCount" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(successCount, KPI.itemTask)"
                  :width="100"
                  color="#67c23a"
                  type="dashboard"
                  :percentage="toPercentNum(successCount, KPI.itemTask)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>失败</span>
                <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="failCount" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(failCount, KPI.itemTask)"
                  :width="100"
                  color="#f56c6c"
                  type="dashboard"
                  :percentage="toPercentNum(failCount, KPI.itemTask)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>正在执行</span>
                <el-tooltip class="item" effect="dark" content="指标说明" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="runningCount" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(runningCount, KPI.itemTask)"
                  :width="100"
                  color="#f56c6c"
                  type="dashboard"
                  :percentage="toPercentNum(runningCount, KPI.itemTask)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push('/datax/job/jobInfo')">
                <span>任务类型分布统计</span>
                <el-tooltip class="item" effect="dark" content="所有项目任务按类别统计数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.taskTypeDistribution" /> -->
                <pie-chart :chart-data="transformArrPieChart(KPI.taskTypeDistribution)" />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>任务统计分布(按照执行器)</span>
                <el-tooltip class="item" effect="dark" content="任务按照执行器统计分布" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.taskExecutorDistribution" /> -->
                <pie-chart :chart-data="transformArrPieChart(KPI.taskExecutorDistribution)" />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>任务结果统计</span>
                <el-tooltip class="item" effect="dark" content="成功失败统计" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <line-chart :chart-data="lineChartData" />
              </el-col>
            </el-card>
            <!-- {{ lineChartData }} -->
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>规则</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push({ name: 'general' })">
                <span>通用规则数</span>
                <el-tooltip class="item" effect="dark" content="通用规则总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.generalRule" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push({ name: 'dqNotify' })">
                <span>质量规则数</span>
                <el-tooltip class="item" effect="dark" content="质量规则总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.configedRule" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push({ name: 'individuation' })">
                <span>个性化规则数</span>
                <el-tooltip class="item" effect="dark" content="个性化规则总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.personalRule" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>规则统计</span>
                <el-tooltip class="item" effect="dark" content="对于已经应用到质量规则任务中的规则统计数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col v-if="!isLoading">
                <!-- <vechart style="width: 100%;height: 120px;" :data="KPI.usedRule" /> -->
                <pie-chart :chart-data="transformArrPieChart2(KPI.usedRule)" />
              </el-col>
            </el-card>
            <!-- {{ KPI.usedRule }} -->
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>接口</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix click" @click="$router.push('/data/list')">
                <span>接口总数</span>
                <el-tooltip class="item" effect="dark" content="接口列表里的接口总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col>
                <span>
                  <count-to :start-val="0" :end-val="KPI.interfaceNum" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>审核通过接口总数</span>
                <el-tooltip class="item" effect="dark" content="提交注册并审核通过接口总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="KPI.passInterface" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(KPI.passInterface, KPI.interfaceNum)"
                  :width="100"
                  color="#67c23a"
                  type="dashboard"
                  :percentage="toPercentNum(KPI.passInterface, KPI.interfaceNum)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>未审核接口总数</span>
                <el-tooltip class="item" effect="dark" content="未审核接口总数" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="KPI.approvingInterface" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(KPI.approvingInterface, KPI.interfaceNum)"
                  :width="100"
                  color="#e6a23c"
                  type="dashboard"
                  :percentage="toPercentNum(KPI.approvingInterface, KPI.interfaceNum)"
                />
              </el-col>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>拒绝接口数</span>
                <el-tooltip class="item" effect="dark" content="提交注册后但是拒绝的接口数量" placement="top-start">
                  <i class="el-icon-info" />
                </el-tooltip>
              </div>
              <el-col :span="12">
                <span>
                  <count-to :start-val="0" :end-val="KPI.rejectInterface" :duration="3200" class="card-panel-num" />
                </span>
              </el-col>
              <el-col :span="12">
                <el-progress
                  v-if="toPercentNum(KPI.rejectInterface, KPI.interfaceNum)"
                  :width="100"
                  color="#f56c6c"
                  type="dashboard"
                  :percentage="toPercentNum(KPI.rejectInterface, KPI.interfaceNum)"
                />
              </el-col>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
// import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import vechart from './components/vEchart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
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
    // PanelGroup,
    LineChart,
    CountTo,
    vechart,
    // RaddarChart,
    PieChart,
    BarChart
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.chartInfo,
      KPI: '',
      runningCount: 0,
      failCount: 0,
      successCount: 0,
      isLoading: true
    }
  },
  computed: {
    // name、value对应
    transformArrPieChart() {
      return arr => {
        const temp = []
        if (arr) {
          arr.forEach(ele => {
            temp.push({
              name: ele.type || ele.name || '未知项',
              value: ele.num
            })
          })
          return temp
        }
        return temp
      }
    },
    transformArrPieChart2() {
      return arr => {
        const temp = []
        if (arr) {
          arr.forEach(ele => {
            temp.push({
              name: ele.ruleCode || '未知项',
              value: ele.num
            })
          })
          return temp
        }
        return temp
      }
    },
    // 提取X轴，Y轴，按格式处理数据
    transformArrBarChart() {
      return arr => {
        const temp = []
        const tempX = [] // type
        const tempY = [] // name
        if (arr) {
          arr.forEach(ele => {
            // null => '未知'
            for (var i in ele) {
              if (ele[i] === null) {
                ele[i] = '未知项'
              }
            }
            if (tempX.indexOf(ele.type) <= -1) {
              tempX.push(ele.type)
            }
            if (tempY.indexOf(ele.name) <= -1) {
              tempY.push(ele.name)
            }
          })
        }
        if (tempX) {
          tempY.forEach(ty => {
            var tyArrData = []
            tempX.forEach(tx => {
              const k = arr.filter(item => {
                return (item.type === tx && item.name === ty)
              })
              if (k.length > 0) {
                tyArrData.push(k[0].num)
              } else {
                tyArrData.push(0)
              }
            })
            temp.push({
              xArr: tempX,
              name: ty,
              type: 'bar',
              stack: 'vistors',
              barWidth: '60%',
              data: tyArrData
            })
          })
          return temp
        }
      }
    },
    transformArrBarChart2() {
      return arr => {
        const temp = {}
        const tempX = []
        const tempY = []
        const tempZ = []
        if (arr) {
          arr.forEach(ele => {
            // null => '未知'
            for (var i in ele) {
              if (ele[i] === null) {
                ele[i] = '未知项'
              }
            }
            tempX.push(ele.date)
            tempY.push(ele.name)
            tempZ.push(ele.num)
          })
          temp.failData = []
          temp.successData = tempZ
          temp.dayList = tempX
          temp.projName = tempY
          return temp
        }
      }
    },
    toPercentNum() {
      // 分子 分母
      return (nu, de) => {
        return parseInt((nu * 100 / de).toFixed(0))
      }
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
    height: 200px;
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
  .statistics > .el-card {
    background: transparent;
  }
  .statistics {
    .box-card {
      >>> .el-card__header {
        border: 0 !important;
        padding-bottom: 0;
      }
      .clearfix > span {
        font-size: 24px;
      }
      .el-row {
        .el-col {
          .el-card {
            margin: 10px 0;
            .clearfix > span {
              font-size: 16px;
              color: #9298A5;
            }
            .clearfix {
              .el-tooltip {
                float: right;
                padding: 3px 0
              }
            }
            .el-col > span {
              font-size: 50px;
              line-height: 103px;
            }
          }
        }
      }
    }
    .box-card + .box-card {
      margin-top: 20px;
    }
  }
}

.click:hover {
  cursor: pointer;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
