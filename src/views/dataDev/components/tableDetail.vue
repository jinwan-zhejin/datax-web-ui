<template>
  <el-tabs type="border-card">
    <el-tab-pane label="结果">
      <el-table class="table" :data="tableData" style="width: 100%;min-height:100px;" max-height="350">
        <el-table-column
          v-for="item in columns"
          :key="item.label"
          :prop="item.label"
          :label="item.label"
          width="130"
        />
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="历史查询">历史查询</el-tab-pane>
  </el-tabs>
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
export default {
  name: 'TableDetail',
  data() {
    return {
      columns: [],
      tableData: [],
      connectionId: ''
    };
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    async initData() {
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', true) // 按钮状态
      const params1 = {
        config: {
          name: 'demo01@47.103.79.104',
          driverId: 'mysql:mysql8',
          host: '47.103.79.104',
          port: '3307',
          databaseName: 'demo01',
          authModelId: 'native',
          credentials: {
            userName: 'root',
            userPassword: '1QAZ@wsx'
          }
        }
      };
      const resCreateConnection = await createConnection(params1);
      console.log(resCreateConnection, 'response');
      this.connectionId = resCreateConnection.data.createConnection.id;
      const params2 = {
        id: this.connectionId,
        credentials: {
          userName: 'root',
          userPassword: '1QAZ@wsx'
        }
      };
      const resInitConnection = await initConnection(params2);
      const params3 = {
        connectionId: resInitConnection.data.connection.id
      };
      const resSqlContextCreate = await sqlContextCreate(params3);
      const params4 = {
        connectionId: this.connectionId,
        contextId: resSqlContextCreate.data.context.id,
        query: this.$store.state.graphQL.codeMirrorVal, // sql语句
        filter: { offset: 0, limit: 200, constraints: [] }
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
      this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
    }
  }
};
</script>

