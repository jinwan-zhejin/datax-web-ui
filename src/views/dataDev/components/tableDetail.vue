<template>
<el-tabs type="border-card">
    <el-tab-pane label="结果">
        <el-table class="table" :data="tableData" style="width: 100%;min-height:350px;" max-height="350">
            <el-table-column v-for="item in columns" :key="item.label" :prop="item.label" :label="item.label" width="130" />
        </el-table>
    </el-tab-pane>
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

        async initData(node) {
            console.log(node)
            this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', true) // 按钮状态
            const host = node.parent.parent.data.jdbcUrl.split('://')[1].split('/')[0].split(':')[0]
            const port = node.parent.parent.data.jdbcUrl.split('://')[1].split('/')[0].split(':')[1]
            const databaseName = node.data.schema
            // const userName = node.parent.parent.data.secretMap.u
            // const password = node.parent.parent.data.secretMap.p

            const userName = 'root';
            const password = 'Q2P88YjE4b23';
            var driverId;

            switch (node.parent.parent.data.datasource.toLowerCase()) {
                case 'mysql':
                    driverId = 'mysql:mysql8'
                    break;
                case 'oracle':
                    driverId = 'mysql:mysql8'
                    break;
                case 'hive':
                    driverId = 'mysql:mysql8'
                    break;
                case 'impala':
                    driverId = 'mysql:mysql8'
                    break;
                default:
                    this.$notify.info("")
                    this.$notify({
                        title: '消息',
                        message: '请联系管理员获取该数据库查询功能',
                        type: 'info',
                        duration: 2000
                    });
                    return
            }
            console.log(driverId, 'driverid');
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
            console.log(resCreateConnection, 'response');
            this.connectionId = resCreateConnection.data.createConnection.id;
            const params2 = {
                id: this.connectionId,
                credentials: {
                    userName: userName,
                    userPassword: password
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
                // query: this.$store.state.graphQL.codeMirrorVal, // sql语句
                query: 'Select * from ' + node.data.schema + '.' + node.data.tableName, // sql语句
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

<style lang="scss">
.border-card {
    .el-tabs {
        .el-tab-pane {
            height: 400px;
        }
    }
}

.el-table::before {
    height: 0;
}
</style>
