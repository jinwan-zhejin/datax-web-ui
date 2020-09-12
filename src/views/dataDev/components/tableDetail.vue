<template>
  <el-tabs type="border-card">
    <el-tab-pane label="结果">
      <el-table :data="tableData" style="width: 100%" max-height="350">
        <el-table-column
          v-for="item in columns"
          :key="item.label"
          :prop="item.label"
          :label="item.label"
          width="120"
        >
        </el-table-column>
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
  getSqlExecuteTaskResults,
} from "@/graphQL/graphQL";
export default {
  name: "TableDetail",
  data() {
    return {
      columns: [],
      tableData: [],
      connectionId: "",
    };
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    initData() {
      let params = {
        config: {
          name: "demo01@47.103.79.104",
          driverId: "mysql:mysql8",
          host: "47.103.79.104",
          port: "3307",
          databaseName: "demo01",
          authModelId: "native",
          credentials: {
            userName: "root",
            userPassword: "1QAZ@wsx",
          },
        },
      };
      createConnection(params)
        .then((res) => {
          this.connectionId = res.data.createConnection.id;
          return res.data.createConnection.id;
        })
        .then((res) => {
          let params = {
            id: res,
            credentials: {
              userName: "root",
              userPassword: "1QAZ@wsx",
            },
          };
          initConnection(params)
            .then((res) => {
              // console.log(res);
              return res.data.connection.id;
            })
            .then((res) => {
              let params = { connectionId: res };
              sqlContextCreate(params)
                .then((res) => {
                  return res.data.context.id;
                })
                .then((res) => {
                  let params = {
                    connectionId: this.connectionId,
                    contextId: res,
                    query: this.$store.state.graphQL.codeMirrorVal, //sql语句
                    filter: { offset: 0, limit: 200, constraints: [] },
                  };
                  asyncSqlExecuteQuery(params)
                    .then((res) => {
                      return res.data.taskInfo.id;
                    })
                    .then((res) => {
                      let params = { taskId: res, removeOnFinish: false };
                      setTimeout(() => {
                        getAsyncTaskInfo(params)
                          .then((res) => {
                            if (res.data.taskInfo.status === "Finished") {
                              return res.data.taskInfo.id;
                            }
                          })
                          .then((res) => {
                            let params = {
                              taskId: res,
                            };
                            getSqlExecuteTaskResults(params).then((res) => {
                              console.log(res, "----");
                              if (!res.data.result.results[0].resultSet) return;
                              let columns =
                                res.data.result.results[0].resultSet.columns;
                              let rows =
                                res.data.result.results[0].resultSet.rows;
                              this.columns = columns;
                              // let rows = my_query_result.rows;
                              this.tableData = rows.map((ele) => {
                                let obj = {};
                                ele.forEach((fieldVal, index) => {
                                  obj[columns[index].name] = fieldVal;
                                });
                                return obj;
                              });
                            });
                          });
                      }, 3000);
                    });
                });
            });
        });
    },
  },
  computed: {
    // codeMirrorVal() {
    //   return this.$store.state.graphQL.codeMirrorVal;
    // },
  },
  mounted() {
    this.initData();
  },
};
</script>