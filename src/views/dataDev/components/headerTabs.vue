<template>
  <div class="header">
    <div class="aside">
      <div class="top">
        <el-row>
          <el-col :span="16">
            <el-select v-if="showInput" v-model="selectValue" placeholder="请选择" @change="selectMethod">
              <el-option v-for="item in projectArray" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>
          <el-col style="textAlign: right;" :span="4">
            <el-popover ref="dspopover" placement="right" trigger="click">
              <div style="font-weight: bold; font-size: 15px">当前数据源连接</div>
              <div>{{ selectedDsName }}</div>
              <div style="margin-top: 10px; font-weight: bold; font-size: 15px">数据库/Schema</div>
              <div>{{ selectedDbName }}</div>
            </el-popover>
            <el-tooltip class="item" effect="dark" content="当前数据源" placement="top-start">
              <i v-popover:dspopover class="el-icon-coin" />
            </el-tooltip>
          </el-col>
          <el-col style="textAlign: center;" :span="4">
            <el-tooltip class="item" effect="dark" content="新建查询" placement="top-start">
              <i class="el-icon-folder-add" @click="addTab" />
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <div class="tree">
        <el-select
          v-if="dataSourceList.length > 0"
          v-model="datasourceSelectedId"
          style="width: 100%; margin-bottom: 15px;"
          filterable
          clearable
          placeholder="请选择数据源/输入关键字"
          no-data-text="无数据源"
          no-match-text="无匹配数据源"
          @change="getSchemas"
        >
          <el-option
            v-for="item in dataSourceList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          >
            <svg-icon v-if="dataSourceIcon.hasOwnProperty(item.datasource)" :icon-class="dataSourceIcon[item.datasource]" />
            {{ item.name }}
          </el-option>
        </el-select>
        <!-- 数据源tree -->
        <div v-if="schemaTreeData.length > 0" class="search">
          <el-input v-model="searchTree" placeholder="请输入Schema关键字筛选" prefix-icon="el-icon-search" clearable />
        </div>
        <div class="treeData">
          <el-tree ref="schemaTree" v-loading="schemaTreeLoading" :data="schemaTreeData" :props="defaultProps" lazy highlight-current node-key="id" :filter-node-method="filterNode" @node-expand="handleNodeExpand" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span style="fontSize: 14px;">
                <!-- <svg-icon v-if="node.level == 1" icon-class="database" /> -->
                <svg-icon v-if="node.level == 1" icon-class="database" />
                <svg-icon v-if="node.level == 2" icon-class="table1" />
                <svg-icon v-if="node.level == 3 && typeIsText(data.type)" icon-class="text" />
                <svg-icon v-if="node.level == 3 && typeIsNumber(data.type)" icon-class="Group" />
                <i v-if="node.level == 3 && typeIsDate(data.type)" class="el-icon-date" />
                <svg-icon v-if="node.level == 3 && data.type === 'enum'" icon-class="enumeratekeysini" />
                <svg-icon v-if="node.level == 3 && data.type === 'set'" icon-class="main-set" />
                <svg-icon v-if="node.level == 3 && data.type === 'blob' || data.type === 'longblob'" icon-class="Blobshangchuanwenjian" />
                {{ data.name }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
    <!-- 右半部分Tabs -->
    <el-tabs v-model="editableTabsValue" class="tabs1" type="border-card" closable @tab-remove="removeTab">
      <!-- @tab-remove="removeTab" -->
      <!-- @edit="handleTabsEdit" -->
      <el-tab-pane v-for="(item) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        <DataDevContent ref="content" :parentlist="sourceList" :tlist="tableList" :clist="columnList" />
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import DataDevContent from './content';
import * as jobProjectApi from '@/api/datax-job-project';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import {
  getTableListWithComment,
  getTableSchema,
  getTableColumns
} from '@/api/metadata-query';
export default {
  // name: "HeaderTabs",
  components: {
    DataDevContent
  },
  data() {
    return {
      editableTabsValue: '2',
      editableTabs: [],
      tabIndex: 0,
      projectArray: [{
        value: '123',
        label: '123'
      }],
      selectValue: '',
      searchTree: '',
      listQuery: {
        pageNo: 1,
        pageSize: 100,
        userId: ''
      },
      arrQuery: {
        current: 1,
        size: 10
      },
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          if (node.level === 3) {
            return true
          }
        }
      },
      firstId: '',
      treeClickCount: '',
      ByVal: {},
      sourceList: [],
      currentNode: {},
      selectedDatasource: {},
      selectedDbName: '',
      selectedDsName: '',
      tableList: [],
      columnList: [],
      showInput: false,
      /** 数据源ICON */
      dataSourceIcon: {
        'mysql': 'yunshujukuRDSMySQL',
        'oracle': 'ORACLE',
        'postgresql': 'postgresql',
        'spark': 'spark',
        'sqlserver': 'sqlserver1',
        'impala': 'Impala',
        'hive': 'Hive',
        'hbase': 'HBASE',
        'greenplum': 'Greenplum-x',
        'db2': 'db',
        'clickhouse': 'clickhouse',
        'mongodb': 'ziyuan'
      },
      /** 下拉框选中的datasource */
      datasourceSelectedId: '',
      datasourceSelected: {},
      /** schema Tree */
      schemaTreeData: [],
      schemaTreeLoading: false,
      /** 数据源列表 */
      dataSourceList: []
    };
  },
  computed: {
    typeIsText() {
      return type => type === 'varchar' || type === 'text' || type === 'mediumtext' || type === 'char' || type === 'longtext'
    },
    typeIsNumber() {
      return type => type === 'number' || type === 'double' || type === 'int' || type === 'bigint' || type === 'tinyint' || type === 'float' || type === 'decimal' || type === 'smallint'
    },
    typeIsDate() {
      return type => type === 'date' || type === 'timestamp' || type === 'datetime' || type === 'time'
    }
  },
  watch: {
    searchTree(val) {
      this.$refs.schemaTree.filter(val);
    },
    '$store.state.project.currentItem': {
      deep: true,
      handler: function(newValue, oldValue) {
        if (oldValue) {
          this.arrQuery.projectId = newValue.split('/')[0]
          this.getDataSourceList()
        }
      }
    }
  },
  created() {
    if (sessionStorage.getItem('strParam')) {
      this.arrQuery.projectId = sessionStorage.getItem('strParam').split('/')[0]
    }
    if (localStorage.getItem('userId') === '1') {
      this.showInput = true
    } else {
      this.showInput = false
    }
    this.getProJectList()
  },
  mounted() {
    this.handleTabsEdit('', 'add');
  },
  methods: {
    handleNodeClick(data, node, nodeComp) {
      console.log(node, 'node')
      if (node.level === 1) {
        this.selectedDbName = node.data.name
        this.selectedDsName = this.datasourceSelected.name // node.parent.data => this.datasourceSelected
        this.selectedDatasource.jdbcUrl = this.datasourceSelected.jdbcUrl
        this.selectedDatasource.db = node.data.name
        this.selectedDatasource.username = this.datasourceSelected.secretMap?.u
        this.selectedDatasource.password = this.datasourceSelected.secretMap?.p
        this.selectedDatasource.datasource = this.datasourceSelected.datasource.toLowerCase()
        console.log(this.selectedDatasource)
        for (let i = 0; i < this.editableTabs.length; i++) {
          this.$refs.content[i].setQueryParams(this.selectedDatasource)
        }
      }

      if (node.level === 2) {
        for (let i = 0; i < this.editableTabs.length; i++) {
          if (this.editableTabs[i].name === this.editableTabsValue) {
            this.$refs.content[i].previewData(node)
            break
          }
        }
      }
    },
    addTab(targetName) {
      const newTabName = ++this.tabIndex + '';
      this.editableTabs.push({
        title: '未命名的查询',
        name: newTabName
        // content: "New Tab content",
      });
      console.log(this.editableTabs);
      this.editableTabsValue = newTabName;
    },
    handleDelete(name) {
      console.log(name);
      for (let i = 0; i < this.editableTabs.length; i++) {
        if (this.editableTabs[i].name === name) {
          this.editableTabs.splice(i, 1);
          this.tabIndex = i + ''
          console.log(this.tabIndex, 'index')
          this.editableTabsValue = this.tabIndex;
        }
      }
    },
    handleNodeExpand(data, node) {
      // console.log(data, 'data')
      // console.log(node.level, 'level')
      if (node.level === 1) {
        getTableListWithComment({
          id: data.dsid,
          schema: data.name
        }).then(res => {
          console.log('res', res);
          this.tableList = res;
          const arr = []
          for (let j = 0; j < res.length; j++) {
            arr.push({
              id: new Date().getTime() + j,
              name: res[j].name + ' ' + res[j].comment,
              dsid: data.dsid,
              schema: data.name,
              tableName: res[j].name
            })
          }
          this.$refs.schemaTree.updateKeyChildren(data.id, arr);
        })
      } else if (node.level === 2) {
        getTableColumns({
          datasourceId: data.dsid,
          tableName: data.tableName,
          schema: data.schema
        }).then((res) => {
          console.log(res.datas)
          this.columnList = res.datas
          const arr = []
          for (let j = 0; j < res.datas.length; j++) {
            arr.push({
              id: new Date().getTime() + j,
              name: res.datas[j].COLUMN_NAME + ' (' + res.datas[j].DATA_TYPE + ')' + ' - ' + res.datas[j].COLUMN_COMMENT,
              type: res.datas[j].DATA_TYPE
            })
          }
          this.$refs.schemaTree.updateKeyChildren(data.id, arr);
        });
      } else {
        console.log('最后一级')
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取项目数据
    async getProJectList() {
      this.listQuery.userId = parseInt(localStorage.getItem('userId'))
      try {
        const {
          records
        } = await jobProjectApi.list(this.listQuery);
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
      if (localStorage.getItem('userId') === '1') {
        // for (let i = 0; i < this.projectArray.length; i++) {
        //   if (this.projectArray[i].name === this.selectValue) {
        //     this.arrQuery.projectId = this.projectArray[i].id;
        //   }
        // }
        this.arrQuery.projectId = this.selectValue;
      }
      datasourceApi.getJobList(this.arrQuery).then((res) => {
        console.log(res, '数据源接口返回信息');
        console.log(res.code, 'code')
        for (let i = 0; i < res.records.length; i++) {
          res.records[i].name = res.records[i].datasourceName + ' - ' + res.records[i].jdbcUrl.split('//')[1].split('/')[0]
        }
        this.dataSourceList = res.records;
        this.sourceList = res.records; // 传给子组件的数据
      });
    },

    removeTab(targetName) {
      if (this.editableTabs.length > 1) {
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
      } else {
        this.$message.info('最后一个,请勿删除')
      }
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
    },
    /**
     * @description: 获取schema
     */
    getSchemas(id) {
      this.datasourceSelected = this.dataSourceList.find(item => item.id === id)
      this.schemaTreeLoading = true
      getTableSchema({
        datasourceId: id
      }).then(response => {
        const arr = []
        for (let i = 0; i < response.length; i++) {
          arr.push({
            id: new Date().getTime() + i,
            name: response[i], // schema名称
            dsid: id // dataSource Id
          })
        }
        this.schemaTreeData = arr
        this.schemaTreeLoading = false
      }).catch(err => {
        console.log(err);
        this.schemaTreeLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.header {
    overflow: hidden;
    // border-radius: 8px;
    background: #f6f9fb;
    display: flex;
    height: calc(100vh - 50px);
    .aside {
        width: 360px;
        min-height: 600px;
        overflow: scroll;
        overflow-x: auto;
        padding: 10px;

        .top {
            height: 42px;
            line-height: 26px;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }

        .tree {
            .search {
                margin-bottom: 15px;
            }

            .treeData {
                // width: 400px;
                background-color: #f6f9fb;

                .el-tree {
                    background: none;

                    .el-loading-mask {
                      background: transparent;
                    }
                }
            }
        }
    }

    .aside::-webkit-scrollbar {
      display: none;
    }

    .tabs1 {
        flex: 1;
        overflow: auto;
        box-shadow: 0 0;
        border-left: none;
        border-top: 1px solid #F5F7FA;
        .el-tabs__header {
          margin: 0px;
          .el-tabs__nav-wrap {
            height: 32px;
            line-height: 32px;
          }
        }
        .el-tabs--border-card {
          box-shadow: none;
          border-left: none;
          border-bottom: none;
        }
        border-bottom: none;
    }
}

.header>>>.el-tabs--border-card {
  box-shadow: none;
  border: none;
  border-bottom: none;
}

.header>>>.el-tabs__new-tab {
    float: left;
    margin-right: 10px;
}

.header>>>.el-tabs__header {
    background-color: #ffffff;
    border-top: 1px solid #F5F7FA;
    .el-tabs__nav-wrap {
      height: 32px;
      line-height: 32px;
    }
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item {
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  box-shadow: none;
  border-left: none;
  border-bottom: none;
}

.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  border-right-color: #fff;
}

.header>>>.el-tabs__new-tab {
    background-color: #ffffff;
}

.header .tabs1 .el-tabs--border-card {
  border-top: 1px solid #F5F7FA;
  border-right: none;
}

.el-tabs .el-tabs--top .el-tabs--border-card {
  box-shadow: none;
  border-right: none;
  border-bottom: none;
}

.header>>>.is-active {
    background-color: #ffffff;
}

.header>>>.el-tree-node__expand-icon {
    display: none;
}

.header>>>.el-tree-node>.el-tree-node__children {
    overflow: none;
}

.el-tabs--border-card>.el-tabs__content {
    padding: 0px;
}

.el-tree-node:focus>.el-tree-node__content {
    background-color: #bbb !important;
}

.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #bbb;
}
</style>
