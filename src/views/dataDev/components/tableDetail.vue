<template>
  <div class="table">
    <el-tabs v-model="tabsActive" type="border-card">
      <el-tab-pane name="res">
        <span slot="label">
          {{ tabLabel[tabsActive] }}
          <el-dropdown v-if="tabsActive === 'res' && tableData.length > 0" style="margin-left: 10px;" placement="top">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.stop="fileSaver('tableRes1', 'xlsx')">导出为Excel</el-dropdown-item>
              <el-dropdown-item @click.native.stop="fileSaver('tableRes1', 'csv')">导出为CSV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-table v-show="firstShow" ref="tableRes1" v-loading="tableLoading" style="padding: 0px; margin-right: 10px" :data="tableData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
          <el-table-column v-for="item in columns" :key="item.label" :prop="item.label" :width="(item.label.toUpperCase().length*10 + 60)" :label="item.label" show-overflow-tooltip align="center" />
        </el-table>
        <el-table v-show="secondShow" ref="tableRes2" v-loading="tableLoading" style="padding: 0px; margin-right: 10px" :data="secondData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
          <el-table-column prop="name" label="name" width="200" align="center" />
          <el-table-column prop="value" label="value" width="400" align="center" />
        </el-table>
      </el-tab-pane>
      <!-- <el-tab-pane label="历史结果" name="hisRes">
        <el-select
          v-model="hisResVal"
          filterable
          clearable
          style="width: 100%; margin-top: 2px;"
          placeholder="请选择查看执行结果"
        >
          <el-option v-for="item in hisResList" :key="item.name" :label="item.name" :value="item.value" />
        </el-select>
        <el-table v-loading="tableLoading" style="padding: 0px; margin-right: 10px" :data="resHistoryData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
          <el-table-column v-for="item in hisResColumns" :key="item.label" :prop="item.label" :width="(item.label.toUpperCase().length*10 + 60)" :label="item.label" show-overflow-tooltip align="center" />
        </el-table>
      </el-tab-pane> -->
      <el-tab-pane name="hisSql">
        <span slot="label">
          {{ tabLabel[tabsActive] }}
          <el-dropdown v-if="tabsActive === 'hisSql' && sqlHistoryData.length > 0" style="margin-left: 10px;" placement="top">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.stop="fileSaver('tableHisSql', 'xlsx')">导出为Excel</el-dropdown-item>
              <el-dropdown-item @click.native.stop="fileSaver('tableHisSql', 'csv')">导出为CSV</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-table ref="tableHisSql" v-loading="tableLoading" :data="sqlHistoryData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
          <el-table-column prop="id" label="序号" width="80" align="center" />
          <el-table-column prop="sql" label="执行语句" width="200" align="center">
            <template slot-scope="scope">
              <a>{{ scope.row }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="datasource" label="数据源" width="150" align="center" />
          <el-table-column prop="database" label="数据库" width="150" align="center" />
          <el-table-column prop="status" label="执行状态" width="150" align="center" />
          <el-table-column prop="createTime" label="创建时间" width="150" align="center" />
          <el-table-column prop="runTime" label="执行时长" width="150" align="center" />
          <el-table-column prop="result" label="结果信息" width="150" align="center" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  createConnection,
  initConnection,
  sqlContextCreate,
  asyncSqlExecuteQuery,
  getAsyncTaskInfo,
  getSqlExecuteTaskResults
} from '@/graphQL/graphQL';
import {
  getResultHistoryList,
  getResultHistory,
  getSQLHistory
} from '@/graphQL/graphQL-history'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'TableDetail',
  data() {
    return {
      columns: [],
      tableData: [],
      connectionId: '',
      firstShow: true,
      secondShow: false,
      secondData: [],
      tableLoading: false,
      tabsActive: 'res',
      /** 执行结果历史 */
      resHistoryData: [],
      /** 历史结果List */
      hisResList: [],
      /** 结果历史select值 */
      hisResVal: '',
      /** 历史结果表头 */
      hisResColumns: [],
      /** SQL语句执行历史 */
      sqlHistoryData: [],
      tabLabel: {
        'res': '当前查询结果',
        'hisSql': 'SQL查询历史'
      }
    };
  },
  watch: {
    tabsActive: {
      handler(val) {
        switch (val) {
          case 'res':
            break
          case 'hisRes':
            this.getResultHistoryList()
            break
          case 'hisSql':
            this.getSQLHistory()
            break
          default:
            break
        }
      }
    },
    hisResVal: {
      handler(val) {
        this.getResultHistory(val)
      },
      immediate: true
    }
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },

    initData(dsInfo, node) {
      console.log('dsInfo', dsInfo);
      console.log('node', node)
      var queryDsInfo = {}
      queryDsInfo.jdbcUrl = dsInfo.jdbcUrl
      queryDsInfo.db = node.data.schema
      queryDsInfo.username = dsInfo.secretMap?.u
      queryDsInfo.password = dsInfo.secretMap?.p
      queryDsInfo.datasource = dsInfo.datasource.toLowerCase()
      var sql = 'Select * from ' + node.data.schema + '.' + node.data.tableName
      console.log(queryDsInfo, 'queryDsInfo')
      this.queryData(queryDsInfo, sql)
    },

    async queryData(queryDsInfo, sql) {
      this.tableLoading = true
      if (queryDsInfo.jdbcUrl === undefined || queryDsInfo.jdbcUrl === '') {
        this.$notify({
          title: '错误',
          message: '未指定SQL查询数据源信息，请单击数据库以选中',
          type: 'error',
          duration: 2000
        });
        return
      }
      if (sql.trim() === '') {
        this.$notify({
          title: '警告',
          message: '请先选中需要执行的SQL！',
          type: 'warn',
          duration: 2000
        });
        return
      }
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', true) // 按钮状态
      sql = sql.replace(';', '')
      // console.log(sql, 'sql')
      console.log(queryDsInfo.jdbcUrl, 'queryDsInfo.jdbcUrl')
      const host = (queryDsInfo.jdbcUrl || '').split('://')[1].split('/')[0].split(':')[0];
      const port = (queryDsInfo.jdbcUrl || '').split('://')[1].split('/')[0].split(':')[1];
      const databaseName = queryDsInfo.db
      const userName = queryDsInfo.username
      const password = queryDsInfo.password

      var driverId;
      switch (queryDsInfo.datasource) {
        case 'mysql':
          driverId = 'mysql:mysql8'
          break;
        case 'oracle':
          driverId = 'oracle:oracle_thin'
          break;
        case 'hive':
          driverId = 'generic:apache_hive2'
          break;
        case 'impala':
          driverId = 'generic:cloudera_impala'
          break;
        default:
          this.$notify.info('')
          this.$notify({
            title: '消息',
            message: '请联系管理员获取该数据库查询功能',
            type: 'info',
            duration: 2000
          });
          return
      }

      // 1、创建链接
      const params1 = {
        config: {
          name: databaseName + '@' + host,
          driverId: driverId,
          host: host,
          port: port,
          databaseName: databaseName,
          authModelId: 'native',
          credentials: {
            userName: userName,
            userPassword: password
          }
        }
      };

      const resCreateConnection = await createConnection(params1);
      console.log(resCreateConnection, 'create connection');

      if (resCreateConnection.data == null) {
        this.$notify({
          title: '错误',
          message: resCreateConnection.message,
          type: 'error',
          duration: 2000
        });
        this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
      }

      this.connectionId = resCreateConnection.data.createConnection.id;

      // 2、初始化连接
      const params2 = {
        id: this.connectionId,
        credentials: {
          userName: userName,
          userPassword: password
        }
      };
      var infoErr2 = '';
      var success2 = '';
      const resInitConnection = await initConnection(params2).then(res => {
        console.log(res, 'params2')
        success2 = res
      }).catch(err => {
        infoErr2 = err.message
      });
      if (infoErr2) {
        this.$message.error(infoErr2)
        this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
      }
      console.log(resInitConnection)

      // 3、创建sqlcontext
      const params3 = {
        connectionId: success2.data.connection.id
      };
      const resSqlContextCreate = await sqlContextCreate(params3);
      const params4 = {
        connectionId: this.connectionId,
        contextId: resSqlContextCreate.data.context.id,
        query: sql, // sql语句
        filter: {
          offset: 0,
          limit: 200,
          constraints: []
        }
      };
      const resAsyncSqlExecuteQuery = await asyncSqlExecuteQuery(params4);
      const params5 = {
        taskId: resAsyncSqlExecuteQuery.data.taskInfo.id,
        removeOnFinish: false
      };
      let queryStatus = '';
      let resGetAsyncTaskInfo;
      while (queryStatus !== 'Finished') {
        resGetAsyncTaskInfo = await getAsyncTaskInfo(params5);
        queryStatus = resGetAsyncTaskInfo.data.taskInfo.status;
        if (resGetAsyncTaskInfo.data.taskInfo.error) {
          this.$message.error(resGetAsyncTaskInfo.data.taskInfo.error);
          this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
          break;
        }
      }
      console.log(queryStatus, 'queryStatus');
      const params6 = {
        taskId: resGetAsyncTaskInfo.data.taskInfo.id
      };
      const resGetSqlExecuteTaskResults = await getSqlExecuteTaskResults(params6);
      if (resGetSqlExecuteTaskResults) {
        this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
        console.log(resGetSqlExecuteTaskResults.data.result.statusMessage, 'second_table');
        if (resGetSqlExecuteTaskResults.data.result.results[0].updateRowCount) {
          this.firstShow = false;
          this.secondShow = true;
          this.secondData = []
          this.secondData.push({
            name: 'updateRowCount',
            value: resGetSqlExecuteTaskResults.data.result.results[0].updateRowCount
          })
          this.secondData.push({
            name: 'query',
            value: sql.replace(';', '')
          })
          //   const time = new Date()
          this.secondData.push({
            name: 'time',
            value: new Date().toLocaleString('cn', {
              hour12: false
            })
          })
        } else {
          this.firstShow = true;
          this.secondShow = false;
        }
      }
      if (!resGetSqlExecuteTaskResults.data.result.results[0].resultSet) return;
      const columns = resGetSqlExecuteTaskResults.data.result.results[0].resultSet.columns;
      const rows = resGetSqlExecuteTaskResults.data.result.results[0].resultSet.rows;
      this.columns = columns;
      this.tableData = rows.map((ele) => {
        const obj = {};
        ele.forEach((fieldVal, index) => {
          obj[columns[index].name] = fieldVal;
        });
        return obj;
      });
      this.tableLoading = false
      this.firstShow = true;
      this.secondShow = false;
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
    },
    /**
     * @description: 获取历史结果列表
     */
    getResultHistoryList() {
      this.hisResList = [
        { name: '执行结果1', value: 1 },
        { name: '执行结果2', value: 2 }
      ]
      this.tableLoading = true
      getResultHistoryList().then(response => {
        console.log(response)
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
    },
    /**
     * @description: 获取历史结果
     */
    getResultHistory() {
      this.tableLoading = true
      getResultHistory().then(response => {
        console.log(response)
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
    },
    /**
     * @description: 获取SQL查询历史
     */
    getSQLHistory() {
      this.tableLoading = true
      getSQLHistory().then(response => {
        console.log(response)
        this.tableLoading = false
      }).catch(error => {
        console.log(error)
        this.tableLoading = false
      })
    },
    fileSaver(tableRef, exportType) {
      this.$nextTick(() => {
        const wb = XLSX.utils.table_to_book(this.$refs[tableRef].$el)
        const wbout = XLSX.write(wb, { bookType: exportType, bookSST: true, type: 'array' })
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.tabLabel[this.tabsActive].concat('.').concat(exportType))
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      })
    }
  }
};
</script>

<style lang="scss">
.table {
}

.border-card {
    border: none;
    .el-tabs {
        border-right: none;
        box-shadow: none;
        // border-bottom: none;
        .el-tab-pane {
          height: 400px;
        }
    }
    >>>.el-tabs--border-card {
        border-right: none;
    }
}

.el-table::before {
    height: 0;
}

.el-tabs--border-card>.el-tabs__content {
    padding: 0px;
}
.el-tabs--border-card>.el-tabs__header {
    border-bottom: none;
}

</style>
