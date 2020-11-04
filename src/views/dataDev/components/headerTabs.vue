<template>
  <div class="header">
    <div class="aside">
      <div class="top">
        <el-row>
          <el-col :span="16">
            <el-select v-model="selectValue" placeholder="请选择" @change="selectMethod">
              <el-option
                v-for="item in projectArray"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-col>
          <el-col style="textAlign: right;" :span="8">
            <el-dropdown>
              <i class="el-icon-menu" />
              <el-dropdown-menu>
                <el-dropdown-item>新建查询</el-dropdown-item>
                <el-dropdown-item>删除查询</el-dropdown-item>
                <el-dropdown-item>编辑查询</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="tree">
        <div class="search">
          <el-input
            v-model="searchModel"
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
          />
        </div>
        <!-- 数据源tree -->
        <div class="dataTree">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="dataTree"
            :props="defaultProps"
            lazy
            :default-expand-all="true"
            highlight-current
            accordion
            node-key="id"
            :filter-node-method="filterNode"
            @node-expand="handleNodeClick"
            @node-collapse="handleCollapse"
          />
        </div>
        <!-- 数据库tree -->
      </div>
    </div>
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      closable
    >
      <!-- :editable="true" -->
      <!-- @tab-remove="removeTab" -->
      <!-- @edit="handleTabsEdit" -->
      <el-tab-pane
        v-for="(item) in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <DataDevContent />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DataDevContent from './content';
import * as jobProjectApi from '@/api/datax-job-project';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import { getTables, getColumns, getTableListWithComment, getTableSchema, getTableList } from '@/api/metadata-query';
export default {
  // name: "HeaderTabs",
  components: {
    DataDevContent
  },
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 2,
      projectArray: [
        {
          value: '123',
          label: '123'
        }
      ],
      selectValue: '',
      searchModel: '',
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      arrQuery: {
        current: 1,
        size: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dataTree: [],
      firstId: ''
    };
  },
  watch: {
    'searchModel': function(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getProJectList()
  },
  mounted() {
    this.handleTabsEdit('', 'add');
  },
  methods: {
    addTab(targetName) {
      const newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: '未命名的查询',
        name: newTabName
        // content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    handleCollapse(data) {
      console.log(data, '关闭节点')
    },
    // 选中树
    handleNodeClick(data) {
      console.log(data, 'data')
      for (let i = 0; i < this.dataTree.length; i++) {
        if (this.dataTree[i].id === data.id) {
          this.firstId = data.id
          getTableSchema({ datasourceId: data.id }).then((res) => {
            const arr = []
            for (let j = 0; j < res.length; j++) {
              arr.push({
                id: new Date().getTime() + j,
                name: res[j],
                children: []
              })
            }
            console.log(arr, 'arr')
            for (let i = 0; i < this.dataTree.length; i++) {
              if (!this.dataTree[i].children) {
                if (this.dataTree[i] === data) {
                  this.$set(this.dataTree[i], 'children', arr)
                }
              }
            }
            console.log(this.dataTree)
          })
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取项目数据
    async getProJectList() {
      try {
        const { records } = await jobProjectApi.list(this.listQuery);
        this.projectArray = records;
        console.log(this.projectArray, 'projectArray');
        console.log(records)
        if (this.selectValue === '') {
          console.log(this.projectArray[0].name, 'name')
          this.selectValue = this.projectArray[0].name
          this.getDataSourceList()
        }
      } catch (error) {
        console.log(error);
      }
    },
    selectMethod() {
      this.getDataSourceList()
    },
    // 根据项目获取数据源
    getDataSourceList() {
      // this.arrQuery.name = this.selectValue
      for (let i = 0; i < this.projectArray.length; i++) {
        if (this.projectArray[i].name === this.selectValue) {
          this.arrQuery.projectId = this.projectArray[i].id;
        }
      }
      datasourceApi.getJobList(this.arrQuery).then((response) => {
        for (let i = 0; i < response.records.length; i++) {
          response.records[i].name = response.records[i].datasourceName + '—' + response.records[i].jdbcUrl.split('//')[1].split('/')[0]
        }
        this.dataTree = response.records;
      });
    },
    // 根据数据库获取表
    tableList(data, id) {
      getTableListWithComment({
        id: id,
        schema: data.name
      }).then(res => {
        console.log('res', res);
        // this.tableList = res;
        if (res) {
          for (let i = 0; i < this.dataTree.length; i++) {
            if (this.dataTree[i].id === id) {
              for (let j = 0; j < this.dataTree[i].children.length; j++) {
                if (this.dataTree[i].children[j] === data) {
                  this.$set(this.dataTree[i].children[j], 'children', res)
                }
              }
            }
          }
        }
      })
    },
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        const newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: '未命名的查询',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      }
    }
  }
};
</script>

<style lang="scss"scoped>
/* .header >>> .el-tabs__nav-scroll{
    border: 1px solid;
} */
.header {
  overflow: hidden;
  // border-radius: 8px;
  background: #f0f0f2;
  .aside {
    width: 25%;
    height: 100%;
    overflow: auto;
    padding: 10px;
    float: left;
    .top {
      height: 74px;
      line-height:60px;
      margin-bottom: 20px;
      border-bottom: 1px solid rgba(0,0,0,.1);
    }
  }
  .el-tabs {
    width: 75%;
    float: right;
  }
}
// .header >>> .el-tabs {
//   width: 75%;
//   float: right;
// }
.header >>> .el-tabs__new-tab {
  float: left;
  margin-right: 10px;
}
.header >>> .el-tabs__header {
  background-color: #F8F8fA;
}
.header >>> .el-tabs__new-tab {
  background-color: #ffffff;
}
.header >>> .is-active {
  background-color: #ffffff;
}
.header >>> .el-input__icon {
  line-height: 32px;
}
</style>
