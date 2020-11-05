<template>
<el-container>
    <!-- <el-aside width="25%" class="contentLeft">
      <div class="dataBase">
        <p class="P-tit">数据连接</p>
        <el-select v-model="dataBaseid" style="width:100%" clearable placeholder="请选择数据库">
          <el-option
            v-for="item in dataBaseList"
            :key="item.id"
            :label="item.datasourceName"
            :value="item.id"
          />
        </el-select>
        <p class="P-tit">模式</p>
        <el-select
          v-model="schemaId"
          style="width:100%;"
          clearable
          placeholder="请选择Schema"
          @change="getTableList"
        >
          <el-option v-for="item in SchemaList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="table">
        <span>
          查看表结构
          <em>({{ tableList.length }} in {{ dataBaseid }})</em>
        </span>
        <el-select
          v-model="tableId"
          style="margin-top:10px;width:100%"
          clearable
          placeholder="请选择表"
          @change="selectTable"
        >
          <el-option v-for="item in tableList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
      <div>
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <p class="tableName">{{ tableName }}</p>
            </template>
            <div class="disnone" style="max-height:360px;overflow:scroll;">
              <div v-for="(item) in columnList" :key="item">{{ item }}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-aside> -->
    <el-main style="padding:0px;height:100%;">
        <CodeMirror :sql-height="sqlHeight" :table-list="tableList" :column-list="columnList" @querysql="runQuery" />
        <div class="dragBar">
            <span @mousedown="dragging = true" @mouseup="dragging = false" @mousemove="setTableHeight">==</span>
        </div>
        <TableDetail ref="table" :table-height="tableHeight" />

    </el-main>
</el-container>
</template>

<script>
import {
    list
} from '@/api/datax-jdbcDatasource';
import {
    getTables,
    getTableColumns,
    getTableSchema,
    getTableList,
    getTableListWithComment
} from '@/api/metadata-query';
import CodeMirror from './codeMirrror';
import TableDetail from './tableDetail';
export default {
    name: 'DataDevContent',
    components: {
        CodeMirror,
        TableDetail,
        name: 'DataDevContent',
        components: {
            CodeMirror,
            TableDetail
        },
        props: ['dblparams'],
        data() {
            return {
                activeNames: [],
                dataBaseList: [],
                tableList: [],
                SchemaList: [],
                columnList: [],
                dataBaseid: '',
                schemaId: '',
                tableName: '',
                dragging: false, // 是否拖拽,
                sqlHeight: 200,
                tableHeight: 300,
                tableId: '',
                tableNameWithComment: ''
            };
        },
        watch: {
            dataBaseid() {
                this.getSchema();
            },
            dblparams(val) {
                console.log(val, '等级')
                if (val.level === 3) {
                    this.runQuery()
                }
            }
        },
        created() {
            this.getDataBaseList();
        },
        methods: {
            // 获取数据库列表
            getDataBaseList() {
                list({
                    current: 1,
                    size: 100000
                }).then((res) => {
                    this.dataBaseList = res.records;
                    this.dataBaseid = res.records[0].id;
                    this.getSchema();
                });
            },

            // 获取schema
            getSchema() {
                getTableSchema({
                    datasourceId: this.dataBaseid
                }).then((res) => {
                    this.SchemaList = res;
                }).catch(err => {
                    console.log(err);
                });
            },
            data() {
                return {
                    activeNames: [],
                    dataBaseList: [],
                    tableList: [],
                    SchemaList: [],
                    columnList: [],
                    dataBaseid: '',
                    schemaId: '',
                    tableName: '',
                    dragging: false, // 是否拖拽,
                    sqlHeight: 200,
                    tableHeight: 300,
                    tableId: '',
                    tableNameWithComment: ''
                };
            },
            watch: {
                dataBaseid() {
                    this.getSchema();
                }
            },
            created() {
                this.getDataBaseList();
            },
            methods: {
                // 获取数据库列表
                getDataBaseList() {
                    list({
                        current: 1,
                        size: 100000
                    }).then((res) => {
                        this.dataBaseList = res.records;
                        this.dataBaseid = res.records[0].id;
                        this.getSchema();
                    });
                },

                // 获取schema
                getSchema() {
                    getTableSchema({
                        datasourceId: this.dataBaseid
                    }).then((res) => {
                        this.SchemaList = res;
                    }).catch(err => {
                        console.log(err);
                    });
                },

                // getTableList
                getTableList() {
                    // getTableList({ id: this.dataBaseid, schema: this.schemaId })
                    //   .then(res => {
                    //     console.log('res', res);
                    //     this.tableList = res;
                    //   })
                    getTableListWithComment({
                            id: this.dataBaseid,
                            schema: this.schemaId
                        })
                        .then(res => {
                            console.log('res', res);
                            this.tableList = res;
                        })
                },
                // 获取字段
                getClo() {
                    getTableColumns({
                        // getColumns({
                        datasourceId: this.dataBaseid,
                        tableName: this.tableName,
                        schema: this.schemaId
                    }).then((res) => {
                        console.log(res)
                        this.columnList = res.datas;
                    });
                },
                // 选择表
                selectTable(val) {
                    this.tableNameWithComment = val
                    this.tableName = val.split(' ')[0];
                    this.getClo();
                    this.activeNames = ['1']
                },
                // 拖拽设置表格高度
                setTableHeight(e) {
                    const _this = this;
                    if (this.dragging) {
                        const top = e.target.offsetTop; // 获取鼠标距离父元素顶的高度
                        const height = e.target.parentNode.parentNode.offsetHeight;
                        console.log(top, height);
                        const sqlHeightRate = (top / height).toFixed(2);
                        const tableHeightRate = 1 - sqlHeightRate;
                        // this.sqlHeight = sqlHeightRate * height;
                        // this.tableHeight = tableHeightRate * height;
                    }
                },
                // 执行sql
                runQuery() {
                    this.$refs.table.initData()
                },
                previewData(params) {
                    this.$refs.table.initData(params)
                }
            }
        }
    }
};
</script>

<style scoped>
.contentLeft {
    background: white;
    padding: 0 15px 0 15px;
    min-height: 630px;
    border-right: 1px solid #F0EDED;
}

.dataBase {
    margin-top: 20px;
}

.dataBase,
.table {
    padding: 0 0 20px;
    width: 100%;
    /* border-bottom: 1px solid rgb(245, 241, 241); */
}

.dragBar {
    display: none;
    color: #cfd8dc;
    text-align: center;
}

.dragBar span {
    cursor: row-resize;
}

.tableName {
    color: green;
    font-weight: bolder;
    font-size: 16px;
}

.P-tit {
    padding: 10px 0px;
}

.disnone::-webkit-scrollbar {
    display: none;
}
</style>
