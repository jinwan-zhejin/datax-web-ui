<template>
  <div ref="container" class="container">
    <!-- <el-container :style="`height:${containerHeight}px`">
      <el-aside width="30%" class="left-container">
        <div class="leftBtn">
          <el-button type="warning" icon="el-icon-plus" circle size="mini" @click="gometa">aa</el-button>
          <el-button type="warning" icon="el-icon-folder" circle size="mini"></el-button>
        </div>
        <el-input style="padding:0 5px;" placeholder="输入表格名称的一部分" clearable></el-input>
        <el-tree :props="props" :load="loadNode" lazy :render-content="renderContent"></el-tree>
      </el-aside>
      <el-container>
        <el-header>
		</el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
    <CreateNewLink :openWin="openWin" @close="openWin = false"></CreateNewLink> -->
    <!-- <iframe src="http://www.baidu.com" style="width: 100%; height: 100%"></iframe> -->
    <!-- <iframe src="http://123.56.96.151:8079/n/index.html#!/search" style="width: 100%; height: 100%"></iframe> -->
  </div>
</template>
<script>
import { list } from '@/api/datax-jdbcDatasource';
import { getTables } from '@/api/metadata-query';
import CreateNewLink from './components/createLink';
export default {
  name: 'Dbeaver',
  components: {
    CreateNewLink
  },
  data() {
    return {
      openWin: false,
      containerHeight: 500,
      props: {
        label: 'datasourceName',
        children: 'zones',
        isLeaf: 'leaf'
      }
    };
  },
  mounted() {
    // 设置容器高度
    this.containerHeight = this.$refs.container.parentElement.offsetHeight - 10;
  },

  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        // 获取数据源列表
        list({ current: 1, size: 100000 }).then((res) => {
          return resolve(res.records || []);
        });
      }
      if (node.level === 1) {
        // 获取数据源列表
        return resolve([
          {
            datasourceName: '数据库',
            id: node.data.id
          },
          {
            datasourceName: '用户',
            id: node.data.id
          },
          {
            datasourceName: '管理员',
            id: node.data.id
          },
          {
            datasourceName: '系统信息',
            id: node.data.id
          }
        ]);
      }
      if (node.level === 2 && node.data.datasourceName === '数据库') {
        // 获取数据源下的表
        getTables({ datasourceId: node.data.id }).then((res) => {
          const result = res.map((item) => {
            return {
              datasourceName: item,
              leaf: true
            };
          });
          return resolve(result || []);
        });
      }
    },
    gometa() {
      window.location.href = 'http://123.56.96.151:8079/n/index.html#!/search'
    },
    renderContent(h, { node, data, store }) {
      if (node.level === 1 || node.level === 2) {
        return (
          <span class='custom-tree-node' style='color:black'>
            <i
              class='el-icon-folder'
              style='color:orange;margin-right:3px;'
            ></i>
            <span>{node.label}</span>
          </span>
        );
      } else if (node.level === 3) {
        return (
          <span class='custom-tree-node' style='color:black'>
            <i
              class='el-icon-document'
              style='color:blue;margin-right:3px;'
            ></i>
            <span>{node.label}</span>
          </span>
        );
      }
    }
  }
};
</script>
<style  scoped>
.container {
  padding: 15px;
}
.left-container {
  background-color: white;
  border: 1px solid rgb(209, 204, 204);
  border-radius: 5px;
  padding: 0;
  /* min-height: 705px; */
}
.leftBtn {
  text-align: right;
  padding-bottom: 2px;
  padding-right: 10px;
}
</style>
