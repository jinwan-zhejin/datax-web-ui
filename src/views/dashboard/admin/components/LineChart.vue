<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log(this.chartData, 'this.chartData')
      this.setOptions(this.chartData)
    },
    setOptions({ failData, successData, dayList, projName } = {}) {
      const t = {
        xAxis: {
          data: dayList,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: []
        },
        series: [{
          name: '失败',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: failData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '成功',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: successData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      }
      if (failData) {
        if (failData.length <= 0) {
          t.tooltip.formatter = function(params) {
            return `日期: ${params[0].axisValue}<br>
            项目: ${dayList.indexOf(params[0].axisValue) > -1 ? projName[dayList.indexOf(params[0].axisValue)] : '未知项'}<br>
            任务数: ${params[0].data}`
          }
        } else {
          t.legend.data = ['失败', '成功']
        }
      }
      this.chart.setOption(t)
    }
  }
}
</script>
