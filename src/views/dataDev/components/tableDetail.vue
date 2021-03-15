<template>
  <div class="table">
    <el-tabs v-model="tabsActive" type="border-card">
      <el-tab-pane name="res">
        <span slot="label">
          {{ tabLabel['res'] }}
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
      <el-tab-pane name="hisSql">
        <span slot="label">
          {{ tabLabel['hisSql'] }}
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
          <el-table-column label="执行语句" width="200" align="center">
            <template slot-scope="scope">
              <a @click="echoResult(scope.row)">{{ scope.row.sqlContent }}</a>
            </template>
          </el-table-column>
          <el-table-column label="数据源" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.datasourceId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="databaseSchema" label="数据库" width="150" align="center" />
          <el-table-column prop="sqlStatus" label="执行状态" width="150" align="center" />
          <el-table-column prop="submitTime" label="提交时间" width="150" align="center" />
          <el-table-column width="150" align="center">
            <template slot="header">
              <el-select v-model="isSaveMode" @change="getSqlList">
                <el-option :value="0" label="SQL临时查询" />
                <el-option :value="1" label="已保存SQL查询" />
              </el-select>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.isSaved === 0 ? 'SQL临时查询' : '已保存SQL查询' }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sqlResult" label="执行结果" width="150" align="center" /> -->
          <el-table-column v-if="isSaveMode === 1" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="deleteHis(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: right; margin: 10px 0;"
          :current-page="pagination.current"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
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
import * as sqlhisApi from '@/graphQL/graphQL-history'
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
      /** SQL语句执行历史 */
      sqlHistoryData: [],
      tabLabel: {
        'res': '当前查询结果',
        'hisSql': 'SQL查询历史'
      },
      /** 分页 */
      pagination: {
        total: 0,
        current: 1,
        size: 10
      },
      /** isSaved=0表示临时查询历史，isSaved=1表示保存了的历史 */
      isSaveMode: 0
    };
  },
  computed: {
    getPagination() {
      return {
        size: this.pagination.size,
        current: this.pagination.current
      }
    },
    getBasedInfo() {
      return {
        projectId: this.$store.state.taskAdmin.sqlParams.projectId,
        datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId,
        schema: this.$store.state.taskAdmin.sqlParams.schema
      }
    }
  },
  watch: {
    tabsActive: {
      handler(val) {
        switch (val) {
          case 'res':
            break
          case 'hisSql':
            this.getSqlList()
            break
          default:
            break
        }
      }
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
        this.tableLoading = false
        return
      }
      if (sql.trim() === '') {
        this.$notify({
          title: '警告',
          message: '请先选中需要执行的SQL！',
          type: 'warning',
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
      this.autoSaveSql(sql)
      this.tableLoading = false
      this.firstShow = true;
      this.secondShow = false;
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
    },
    /**
     * @description:保存时添加历史
     */
    saveSql(sql) {
      if (sql.trim() === '') {
        this.$notify({
          title: '警告',
          message: '请先编辑需要执行的SQL！',
          type: 'warning',
          duration: 2000
        });
        return
      }
      sqlhisApi.saveSql({
        datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId, // 数据源id
        projectId: this.$store.state.taskAdmin.sqlParams.projectId, // 项目id
        databaseSchema: this.$store.state.taskAdmin.sqlParams.schema, // 数据库schema
        sqlResult: {
          columns: this.columns,
          tableData: this.tableData
        }, // sql执行结果
        sqlStatus: 1, // 1：成功  0：失败
        sqlContent: sql, // sql语句
        submitUser: parseInt(localStorage.getItem('userId')) // 提交用户id
      }).then(response => {
        console.log(response)
        if (response.code === 0) {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '错误',
            message: '保存失败',
            type: 'error',
            duration: 2000
          })
        }
      }).catch(_ => {
        this.$notify({
          title: '错误',
          message: '保存失败.',
          type: 'error',
          duration: 2000
        })
      })
    },
    /**
     * @description: 执行时添加历史
     */
    autoSaveSql(sql) {
      sqlhisApi.autoSaveSql({
        datasourceId: this.$store.state.taskAdmin.sqlParams.datasourceId, // 数据源id
        projectId: this.$store.state.taskAdmin.sqlParams.projectId, // 项目id
        databaseSchema: this.$store.state.taskAdmin.sqlParams.schema, // 数据库schema
        sqlResult: {
          columns: this.columns,
          tableData: this.tableData
        }, // sql执行结果
        sqlStatus: 1, // 1：成功  0：失败
        sqlContent: sql, // sql语句
        submitUser: parseInt(localStorage.getItem('userId')) // 提交用户id
      })
        .then(response => {
          if (response.code === 0) {
            console.log(response)
          }
        }).catch(_ => {
          this.$notify({
            title: '错误',
            message: '自动保存失败.',
            type: 'error',
            duration: 2000
          })
        })
    },
    /**
     * @description: 获取sql自动保存的历史记录
     */
    getSqlList(val = null) {
      this.tableLoading = true
      const searchParams = Object.assign(Object.assign({}, this.getPagination), this.getBasedInfo)
      if (this.isSaveMode === 0) {
        sqlhisApi.getSqlListTemp(searchParams)
          .then(response => {
            if (response.code === 0) {
              this.sqlHistoryData = response.content.records
              this.pagination.total = response.content.total
            }
            this.tableLoading = false
          }).catch(error => {
            console.log(error)
            this.tableLoading = false
          })
      } else {
        sqlhisApi.getSqlListSaved(searchParams)
          .then(response => {
            if (response.code === 0) {
              this.sqlHistoryData = response.content.records
              this.pagination.total = response.content.total
            }
            this.tableLoading = false
          }).catch(error => {
            console.log(error)
            this.tableLoading = false
          })
      }
    },
    /**
     * @description: 删除手动保存
     */
    deleteHis(id) {
      sqlhisApi.deleteSaved(id)
        .then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: response.msg,
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '错误',
              message: '删除失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(_ => {
          this.$notify({
            title: '错误',
            message: '删除失败.',
            type: 'error',
            duration: 2000
          })
        })
    },
    /**
     * @description: 文件导出
     */
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
    },
    /**
     * @description: 页面尺寸改变
     */
    handleSizeChange(size) {
      this.pagination.size = size
      this.pagination.current = 1
      this.getSqlList()
    },
    /**
     * @description: 当前页码改变
     */
    handleCurrentChange(current) {
      this.pagination.current = current
      this.getSqlList()
    },
    /**
     * @description: 回显结果
     */
    echoResult(row) {
      this.columns = row.sqlResult.columns
      this.tableData = row.sqlResult.tableData
      this.tabsActive = 'hisSql'
      this.$emit('echoResult', row)
    }
  }
};
</script>

<style lang="scss" scoped>
.table {
  .el-tabs {
        .el-tab-pane {
          .el-table {
            .el-table-column {
              .el-select {
                height: 28px;
                >>> .el-input__inner {
                  height: 28px !important;
                  line-height: 28px !important;
                }
              }
            }
          }
        }
    }
}

.border-card {
    border: none;
    .el-tabs {
        border-right: none;
        box-shadow: none;
        // border-bottom: none;
        .el-tab-pane {
          height: 400px;

          .el-table {
            .el-table-column {
              .el-select {
                height: 28px;
                >>> .el-input__inner {
                  height: 28px !important;
                  line-height: 28px !important;
                }
              }
            }
          }
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
