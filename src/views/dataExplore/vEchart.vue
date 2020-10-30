<template>
  <v-chart style="width: 150px;height: 100px;margin: 0 auto;" :options="polar" />
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
            return '取值范围:' + params[0].axisValue + '<br>' + '当前取值:' + params[0].data
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
            barWidth: '96%',
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
    }
  },
  created() {
    if (this.data) {
      const newArr = []
      const xAxisArr = []
      for (let i = 0; i < this.data.length; i++) {
        newArr.push(this.data[i].number)
        xAxisArr.push(this.data[i].min + '—' + this.data[i].max)
      }
      this.polar.series[0].data = newArr
      this.polar.xAxis[0].data = xAxisArr
      console.log(xAxisArr, '最小值数组')
    }
  }
}
</script>

<style>

</style>
