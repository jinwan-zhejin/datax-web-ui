<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-21 18:49:31
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\metaCompare.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div>
    <el-tabs v-model="compareType" style="margin-top: 20px; margin-left: 20px" @tab-click="handleClick">
      <el-tab-pane label="时间版本比对" name="time">
        <div class="filter-container">
          <!-- <el-input v-model="listQuery.entityName" placeholder="全部" style="width: 200px" /> -->
          <!-- <el-select v-model="listQuery.entityType" placeholder="Entity类型"> -->
          <!-- <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" /> -->
          <!-- </el-select> -->
          <!-- <el-input v-model="listQuery.entityName" placeholder="任务提交时间From" style="width: 200px" />
          <el-input v-model="listQuery.entityName" placeholder="任务提交时间To" style="width: 200px" /> -->
          <el-select v-model="queryList.guid" placeholder="选择guid">
            <el-option v-for="item in queryList.guidList" :key="item.value" :label="item.name.indexOf('null')>-1?item.value:item.name" :value="item.value" />
          </el-select>
          <el-button size="small" type="primary" icon="el-icon-search" @click="refreshTableGuid">
            搜索
          </el-button>
          <el-button size="small" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleClear">
            清除
          </el-button>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="任务id" min-width="75" />
          <el-table-column label="Entity名称" min-width="100">
            <template v-slot:default="{ row }">
              {{ row.name===null?'Null':row.name }}
            </template>
          </el-table-column>
          <el-table-column label="Entity类型" min-width="100">
            <template v-slot:default="{ row }">
              {{ row.typeName===null?'Null':row.typeName }}
            </template>
          </el-table-column>
          <el-table-column label="基线时间" min-width="160">
            <template v-slot:default="{ row }">
              {{ row.timestamp1 | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="待比较时间" min-width="160">
            <template v-slot:default="{ row }">
              {{ row.timestamp2 | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="任务提交时间" min-width="160" sortable />
          <!-- <el-table-column prop="progress" label="比较进度" width="120" sortable align="center" /> -->
          <el-table-column label="操作" min-width="100">
            <template v-slot:default="{ row }">
              <el-button type="text" size="small" @click="getDetails(row.id)">查看比对结果</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="空间版本比对" name="dimen">空间版本比对</el-tab-pane> -->
    </el-tabs>
    <el-dialog :visible.sync="dialogVisible" width="75%" height="50%">
      <el-form>
        <el-form-item>
          <el-row>
            <el-col>
              版本不同：{{ compare.difference === '' ? '无' : compare.difference }}
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12">
          <!-- {{ compare.params1 }} -->
          基线时间版本
          <json-viewer :value="compare.params1" :expand-depth="10" expanded :copyable="false" sort />
        </el-col>
        <el-col :span="12">
          待比较时间版本
          <json-viewer :value="compare.params2" :expand-depth="10" expanded :copyable="false" sort />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
import * as apiatlas from '@/api/datax-metadata-atlas'
import { translaterMaster } from './utils/dictionary'

export default {
  name: 'MetaCompare',
  filters: {
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s + ' (CST)';
    }
  },
  data() {
    return {
      listQuery: {},
      tableData: '', // 所有记录
      dialogVisible: false,
      // 比对数据解析
      compare: {
        // json1
        // params1: { 'relationshipAttributes': { 'db': { 'guid': 'f2e53e7b-dc67-4417-85b4-dc89cf3ef7bf' }}, 'provenanceType': 0, 'classifications': [{ 'removePropagationsOnEntityDelete': false, 'entityStatus': 'ACTIVE', 'typeName': 'MYSQL_FINANCE', 'entityGuid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'propagate': true, 'validityPeriods': [] }, { 'removePropagationsOnEntityDelete': false, 'entityStatus': 'ACTIVE', 'typeName': 'MYSQL_CLASSIFIED', 'entityGuid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'propagate': true, 'validityPeriods': [], 'attributes': { 'tag': 'test' }}], 'proxy': false, 'typeName': 'mysql_test3_table', 'guid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'attributes': { 'charset': '{"displayName":"utf8mb4","description":"UTF-8 Unicode"}', 'maxDataLength': '0', 'avgRowLength': '0', 'qualifiedName': 'jdbc:mysql://192.168.72.139:3306/gulimall_oms.mq_message', 'dataLength': '16K', 'autoIncrement': 0, 'description': '', 'dataFree': '0', 'updateTime': '2020-10-13 18:04:11', 'indexLength': '0', 'engine': '{"displayName":"InnoDB","description":"Supports transactions, row-level locking, and foreign keys"}', 'createTime': '2020-08-23 21:29:23.0', 'rowFormat': 'Dynamic', 'name': 'mq_message', 'collation': '{"displayName":"utf8mb4_general_ci"}', 'rowCount': 0 }, 'version': 0, 'isIncomplete': false },
        params1: '',
        // json2
        // params2: { 'relationshipAttributes': { 'db': { 'guid': 'f2e53e7b-dc67-4417-85b4-dc89cf3ef7bf' }}, 'provenanceType': 0, 'classifications': [{ 'removePropagationsOnEntityDelete': false, 'entityStatus': 'ACTIVE', 'typeName': 'MYSQL_FINANCE', 'entityGuid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'propagate': true, 'validityPeriods': [] }, { 'removePropagationsOnEntityDelete': false, 'entityStatus': 'ACTIVE', 'typeName': 'MYSQL_CLASSIFIED', 'entityGuid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'propagate': true, 'validityPeriods': [], 'attributes': { 'tag': 'test' }}], 'proxy': false, 'typeName': 'mysql_test3_table', 'guid': '781222c4-be96-4d4f-a3ce-b9a5244ad548', 'attributes': { 'charset': '{"displayName":"utf8mb4","description":"UTF-8 Unicode"}', 'maxDataLength': '0', 'avgRowLength': '0', 'qualifiedName': 'jdbc:mysql://192.168.72.139:3306/gulimall_oms.mq_message', 'dataLength': '16K', 'autoIncrement': 0, 'description': '', 'dataFree': '0', 'updateTime': '2020-10-13 18:04:11', 'indexLength': '0', 'engine': '{"displayName":"InnoDB","description":"Supports transactions, row-level locking, and foreign keys"}', 'createTime': '2020-08-23 21:29:23.0', 'rowFormat': 'Dynamic', 'name': 'mq_message', 'collation': '{"displayName":"utf8mb4_general_ci"}', 'rowCount': 0 }, 'version': 0, 'isIncomplete': false },
        params2: '',
        // 不同 content
        difference: ''
      },
      queryList: {
        guid: '',
        guidList: []
      },
      activeNames: 'metaJobs',
      compareType: 'time',
      searchTreeList: '',
      identChar: 0,
      taskList: [{
        label: '浙江省发改委数据仓 (3)',
        children: [{
          label: '人口库比对'
        },
        {
          label: '工商库比对'
        },
        {
          label: '经营信息库比对'
        }
        ]
      },
      {
        label: '快速入门 (2)',
        children: [{
          label: 'DataElit测试库和生产库比对'
        },
        {
          label: 'DataElit开发库和测试库比对'
        }
        ]
      }
      ]
    }
  },
  watch: {

  },
  mounted() {

  },
  created() {
    // 调用接口必须先登录
    this.refreshTable()
  },
  methods: {
    handleChange() {

    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleClick() {

    },
    handleClear() {
      this.queryList.guid = ''
    },
    fetchData() {

    },
    /**
     * @description: 获取所有比对记录
     */
    async refreshTable() {
      const res = await apiatlas.getAllCompareRecord()
      // console.log(res)
      if (res.code === 200) {
        this.tableData = res.content
        console.log(this.tableData)
        this.queryList.guidList = []
        for (var i in this.tableData) {
          this.queryList.guidList.push({
            name: this.tableData[i].name === null ? 'null' : this.tableData[i].name + ' (' + this.tableData[i].typeName + ')',
            value: this.tableData[i].guid
          })
        }
      } else {
        this.$message({
          message: '获取所有比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    async refreshTableGuid() {
      const res = await apiatlas.getGuidAllCompareRecord(this.queryList.guid)
      if (res.code === 200) {
        this.tableData = res.content
      } else {
        this.$message({
          message: '获取该Guid下所有比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.queryList.guid = ''
      }
    },
    /**
     * @description: 获取比对具体信息
     */
    async getDetails(id) {
      const res = await apiatlas.getOneCompareRecord(id)
      if (res.code === 200) {
        this.compare.params2 = res.content.substring(res.content.indexOf('{json2=') + '{json2='.length, res.content.indexOf(', json1='))
        this.compare.params1 = res.content.substring(res.content.indexOf(', json1=') + ', json1='.length, res.content.indexOf(', contrast'))
        this.compare.difference = res.content.substring(res.content.indexOf(', contrast=') + ', contrast='.length, res.content.length - 1).replace('null', '')
        this.compare.params2 = JSON.parse(this.compare.params2)
        this.compare.params1 = JSON.parse(this.compare.params1)
        this.compare.difference = this.compare.difference.substring(1, this.compare.difference.length - 1)
        if (this.compare.difference.indexOf(':') > -1) {
          this.compare.difference = translaterMaster(this.compare.difference.split(':')[0])
          console.log(this.compare.difference);
        }
        // this.compare.difference = '[' + this.compare.difference + ']'
        this.dialogVisible = true
      } else {
        this.$message({
          message: '获取该比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
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
            color: #3D5FFF;
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
        color: #3D5FFF;
        right: 5px;
    }

    ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #3D5FFF;
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
