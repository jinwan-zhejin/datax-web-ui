<template>
  <div>
    <div class="barContent">
      <div class="drop">
        <el-dropdown size="mini">
          <span class="el-dropdown-link">
            {{ title }}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in state.projectList" :key="item.id" :command="item.name" @click.native="handleCommand(item.name)">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="btn">
        <!-- <el-button type="info" icon="el-icon-monitor" circle size="mini"></el-button> -->
        <el-tooltip content="新建模型">
          <el-button type="info" icon="el-icon-folder-add" circle size="mini" @click="$emit('createtab')" />
        </el-tooltip>
      </div>
    </div>
    <div class="tabs">
      <div
        class="tab-item"
        :style="{
          'border-bottom':state.currentTab === '模型' ? '1px solid #E5E7EC': '1px solid white',
          'color':state.currentTab === '模型' ? '#409eff': ''
        }"
        @click="state.currentTab = '模型'"
      >模型</div>

    </div>
    <el-input
      v-model="state.inputVal"
      placeholder="请输入内容"
      prefix-icon="el-icon-search"
    />
  </div>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'
import { list } from '@/api/datax-job-project'
export default {
  setup() {
    const state = reactive({
      currentTab: '模型',
      inputVal: '',
      projectList: []
    });
    const title = ref('项目');
    onMounted(() => {
      getProjectList();
    });

    function getProjectList() {
      list({ pageNo: 1, pageSize: 99999 }).then(res => {
        state.projectList = res.records;
      })
    }

    function handleCommand(name) {
      console.log(name);
      title.value = name;
    }
    return {
      state,
      title,
      handleCommand
    }
  }
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
