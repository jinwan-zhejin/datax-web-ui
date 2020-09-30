<!--
 * @Date: 2020-09-30 17:20:24
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-30 18:42:31
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelDetails.vue
 * @Description: 详情页
-->

<template>
  <div>
    <el-row>
      <el-col :span="24" class="topBar">
        <el-tooltip content="返回" placement="top">
          <i class="el-icon-arrow-left topArrow" @click="backToResult" />
        </el-tooltip>
        <i class="el-icon-document" />
        <span v-if="a">{{ detailsRequest.attributes.name }}（{{ detailsRequest.typeName }}）</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'RightPanelDetails',
  props: {
    detailsRequest: Object
  },
  data() {
    return {
      a: true
    }
  },
  methods: {
    backToResult() {
      this.$emit('changepage', 'atlasResult')
    }
  }
}
</script>

<style lang="scss" scoped>
.topBar {
  margin: 20px auto 15px 20px;
  font-size: 2.8em;
  display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
  -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
  overflow: hidden; /*超出的文本隐藏*/
  text-overflow: ellipsis; /* 溢出用省略号*/
  -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
  .topArrow {
    font-weight: bold;
    color: rgb(192, 192, 192);
    cursor: pointer;
  }
  .topArrow:hover {
    color: rgb(143, 143, 143);
  }
  i {
    font-weight: bold;
    color: #006ad4;
  }
}
</style>
