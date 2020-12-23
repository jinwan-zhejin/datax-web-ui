<template>
  <v-chart style="width: 200px;height: 100px;margin: 0 auto;" :options="polar" />
</template>

<script>
export default {
  name: 'Echarts01',
  props: ['data'],
  data() {
    return {
      polar: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            console.log(params)
            return '标识:' + params[0].axisValue + '<br>' + '当前取值:' + params[0].data
          },
          position: function(point, params, dom, rect, size) { // point: 鼠标位置
            var tipHeight = point[1] + size.contentSize[1]; // contentSize: 提示dom 窗口大小
            if (tipHeight > size.viewSize[1]) { // viewSize: echarts 容器大小
              return [point[0] - 80, point[1] - size.contentSize[1] - 20];
            } else if (point[1] < size.contentSize[1]) {
              return [point[0] - 80, point[1] - 20];
            } else {
              return point;
            }
          }
        },
        grid: {
          top: '8%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            show: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '80%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
    }
  },
  created() {
    if (this.data) {
      console.log(this.data, 'data')
      const newArr = []
      const xAxisArr = []
      for (let i = 0; i < this.data.length; i++) {
        newArr.push(this.data[i].num)
        if (this.data[i].type && !this.data[i].name) {
          xAxisArr.push(this.data[i].type)
        } else if (this.data[i].name) {
          if (this.data[i].date) {
            xAxisArr.push(this.data[i].name + '<br>' + this.data[i].date)
          } else if (this.data[i].type) {
            xAxisArr.push(this.data[i].name + '<br>' + this.data[i].type)
          } else {
            xAxisArr.push(this.data[i].name + '')
          }
        } else if (this.data[i].ruleCode) {
          xAxisArr.push(this.data[i].ruleCode)
        } else if (this.data[i].name === null) {
          console.log(',.,.,.,.,.,')
          xAxisArr.push(this.data[i].name + '')
        }
      }
      this.polar.series[0].data = newArr
      this.polar.xAxis[0].data = xAxisArr
      console.log(xAxisArr, '类别数组')
    }
  }
}
</script>

<style>

</style>
