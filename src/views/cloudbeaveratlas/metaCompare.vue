<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-30 18:41:23
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside style="width: 20%; min-width: 252px; height: 500px;" class="left-container">
        <div class="topSearch">
          <el-input v-model="searchTreeList" style="padding: 5px 0;" prefix-icon="el-icon-search" placeholder="搜索元数据比对任务" clearable />
        </div>

      <el-tree default-expand-all :indent="identChar" :data="taskList" @node-click="handleNodeClick"></el-tree>

      </el-aside>
      <el-container>
        <el-main class="right-container">
          <!-- <RightPanelTable :search-request="searchByListItem" /> -->
          this is main
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import * as apiatlas from '@/api/datax-metadata-atlas'

export default {
  name: 'MetaCompare',
  data() {
    return {
      activeNames: 'metaJobs',
      searchTreeList: '',
      identChar: 0,
      taskList: [
        {
          label: '浙江省发改委数据仓 (3)',
          children: [
            {
              label: '人口库比对',
            },
            {
              label: '工商库比对',
            },
            {
              label: '经营信息库比对',
            }
          ]
        },
        {
          label: '快速入门 (2)',
          children: [{
            label: 'DataElit测试库和生产库比对',
          },
          {
            label: 'DataElit开发库和测试库比对',
          }]
        },
        ],
    }
  },
  watch: {

  },
  mounted() {

  },
  created() {
    // 调用接口必须先登录

  },
  methods: {
    handleChange() {

    },
    handleNodeClick(data) {
      console.log(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
}
.left-container {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  background-color: transparent;
  border-right: 1px solid rgb(209, 204, 204);
  padding: 5px;
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  .topSearch {
    height: 79px;
    .searchLabel {
      font-size: 18px;
      font-weight: normal;
      color: dimgray;
    }
  }
  .el-collapse {
    height: calc(100vh - 219px);
    overflow-y: auto;
    ::v-deep .el-collapse-item__header {
      color: #409EFF;
      font-size: 15px;
      font-weight: bold;
      flex: 1 0 auto;
      order: -1;
      .collapse-title {
        flex: 1 0 100%;
        order: 1;
      }
    }
  }
  .el-button {
    color: #409EFF;
    right: 5px;
  }
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #409EFF;
    color: white;
  }
  ::v-deep .el-tree-node__content:hover {
    background-color: #d9e6fd;
    // color: #fff;
  }
}
.right-container {
  height: calc(100vh - 132px);
}
.leftBtn {
  text-align: right;
  padding-bottom: 2px;
  padding-right: 10px;
}
.el-dialog {
  .el-row {
    .el-col {
      ::v-deep .el-select {
        width: 100%;
      }
    }
  }
}
.form-ring {
  margin-top: 5px;
  width: 100%;
  padding: 15px;
  border-style: dashed;
  border-radius: 20px;
  // border:3px solid rgba(201, 201, 201, 0.7);
  border-color: rgba(201, 201, 201, 0.7);
}
</style>
