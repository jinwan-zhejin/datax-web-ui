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
          formatter: function() {
            return '123123' + '<br>' + 'aaa'
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
              alignWithLabel: true,
              show: false
            }
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
      for (let i = 0; i < this.data.length; i++) {
        newArr.push(this.data[i].number)
      }
      this.polar.series[0].data = newArr
    }
  }
}
</script>

<style>

</style>
