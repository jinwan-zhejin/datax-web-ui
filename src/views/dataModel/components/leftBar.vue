<template>
  <div>
    <div class="barContent">
      <div class="drop">
        <el-dropdown size="mini">
          <span class="el-dropdown-link">
            项目
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="btn">
        <el-button type="info" icon="el-icon-monitor" circle size="mini"></el-button>
        <el-button @click="$emit('createtab')" type="info" icon="el-icon-folder-add" circle size="mini"></el-button>
      </div>
    </div>
    <div class="tabs">
      <div
        @click="currentTab = '模型'"
        class="tab-item"
        :style="{
          'border-bottom':currentTab === '模型' ? '1px solid #E5E7EC': '1px solid white',
          'color':currentTab === '模型' ? '#409eff': ''
        }"
      >模型</div>

    </div>
    <el-input
    placeholder="请输入内容"
    prefix-icon="el-icon-search"
    v-model="inputVal">
  </el-input>
  </div>
</template>

<script>
export default {
  name: "LeftBar",
  data() {
    return {
      currentTab: "模型",
      inputVal:''
    };
  },
};
</script>

<style scoped>
.barContent {
  overflow: hidden;
}
.drop {
  float: left;
}
.btn {
  float: right;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  line-height: 28px;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.tabs {
  display: flex;
  margin: 10px 0;
}
.tab-item {
  width: 100%;
  border: 1px solid #e5e7ec;
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid white;
}
.tab-item:hover {
  color: #409eff;
  border: 1px solid #e5e7ec;
}
</style>