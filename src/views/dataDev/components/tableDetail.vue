<template>
<div class="table">
    <el-table v-show="firstShow" style="padding: 0px; margin-left: 10px" :data="tableData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
        <el-table-column v-for="item in columns" :key="item.label" :prop="item.label" :width="(item.label.toUpperCase().length*10 + 60)" :label="item.label" show-overflow-tooltip />
    </el-table>
    <el-table v-show="secondShow" style="padding: 0px; margin-left: 10px" :data="secondData" height="245" :row-style="{height: '33px'}" :cell-style="{padding: '0'}" :header-row-style="{fontWeight: '900', fontSize: '15px'}">
        <el-table-column prop="name" label="name" width="200" />
        <el-table-column prop="value" label="value" width="400" />
    </el-table>
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
export default {
    name: 'TableDetail',
    data() {
        return {
            columns: [],
            tableData: [],
            connectionId: '',
            firstShow: true,
            secondShow: false,
            secondData: []
        };
    },
    methods: {
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },

        initData(node) {
            console.log(node)
            var queryDsInfo = {}
            queryDsInfo.jdbcUrl = node.parent.parent.data.jdbcUrl
            queryDsInfo.db = node.data.schema
            queryDsInfo.username = node.parent.parent.data.secretMap.u
            queryDsInfo.password = node.parent.parent.data.secretMap.p
            queryDsInfo.datasource = node.parent.parent.data.datasource.toLowerCase()
            var sql = 'Select * from ' + node.data.schema + '.' + node.data.tableName
            this.queryData(queryDsInfo, sql)
        },

        async queryData(queryDsInfo, sql) {
            this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', true) // 按钮状态
            const host = queryDsInfo.jdbcUrl.split('://')[1].split('/')[0].split(':')[0];
            const port = queryDsInfo.jdbcUrl.split('://')[1].split('/')[0].split(':')[1];
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
                    driverId = 'mysql:mysql8'
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
            var infoErr2 = '';
            var success2 = '';
            const resInitConnection = await initConnection(params2).then(res => {
                console.log(res, 'params2')
                success2 = res
            }).catch(err => {
                console.log(err.message, 'params2_____________________')
                infoErr2 = err.message
            });
            if (infoErr2) {
                this.$message.error(infoErr2)
                this.$store.commit('graphQL/SET_SQL_BTN_STSTUS', false)
            }
            console.log(resInitConnection)
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
                        value: sql
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
            this.firstShow = true;
            this.secondShow = false;
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

.el-tabs--border-card>.el-tabs__content {
    padding: 0px;
}
</style>
