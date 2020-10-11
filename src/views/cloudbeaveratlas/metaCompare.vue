<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-30 18:41:23
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
<el-tabs v-model="compareType" @tab-click="handleClick" style="margin-top: 20px; margin-left: 20px">
    <el-tab-pane label="时间版本比对" name="time">
        <div class="filter-container">
            <el-input v-model="listQuery.entityName" placeholder="全部" style="width: 200px" />
            <el-select v-model="listQuery.entityType" placeholder="Entity类型">
                <el-option v-for="item in executorList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
            <el-input v-model="listQuery.entityName" placeholder="任务提交时间From" style="width: 200px" />
            <el-input v-model="listQuery.entityName" placeholder="任务提交时间To" style="width: 200px" />
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">
                搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handlerDelete">
                清除
            </el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="taskId" label="任务id" width="150">
            </el-table-column>
            <el-table-column prop="entityName" label="Entity名称" width="160">
            </el-table-column>
            <el-table-column prop="entityType" label="Entity类型" width="160">
            </el-table-column>

            <el-table-column prop="baselineTime" label="基线时间" width="160">
            </el-table-column>
            <el-table-column prop="toTime" label="待比较时间" width="160">
            </el-table-column>
            <el-table-column prop="submitTime" label="任务提交时间" width="160" sortable>
            </el-table-column>
            <el-table-column prop="progress" label="比较进度" width="120" sortable align="center">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看比对结果</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-tab-pane>
    <el-tab-pane label="空间版本比对" name="dimen">空间版本比对</el-tab-pane>
</el-tabs>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'

export default {
    name: 'MetaCompare',
    data() {
        return {
            listQuery: {},
            tableData: [{
                taskId: 'hgfhhjjj-oiu-poiss',
                entityName: '_dummy_sqljob2',
                entityType: 'mysql_test3_table',
                baselineTime: '2020-09-09 18:09:01',
                toTime: '2020-09-19 18:09:01',
                submitTime: '2020-10-11 18:09:01',
                progress: '90%',
            }, {
                taskId: 'hgfhhjjj-oiu-poiss',
                entityName: '_dummy_sqljob2',
                entityType: 'mysql_test3_table',
                baselineTime: '2020-09-09 18:09:01',
                toTime: '2020-09-19 18:09:01',
                submitTime: '2020-10-09 19:09:01',
                progress: '100%',
            }, ],
            activeNames: 'metaJobs',
            compareType: 'time',
            searchTreeList: '',
            identChar: 0,
            taskList: [{
                    label: '浙江省发改委数据仓 (3)',
                    children: [{
                            label: '人口库比对',
                        },
                        {
                            label: '工商库比对',
                        },
                        {
                            label: '经营信息库比对',
                        }
                    ]
                },
                {
                    label: '快速入门 (2)',
                    children: [{
                            label: 'DataElit测试库和生产库比对',
                        },
                        {
                            label: 'DataElit开发库和测试库比对',
                        }
                    ]
                },
            ],
        }
    },
    watch: {

    },
    mounted() {

    },
    created() {
        // 调用接口必须先登录

    },
    methods: {
        handleChange() {

        },
        handleNodeClick(data) {
            console.log(data);
        },
        handleClick() {

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
            color: #409EFF;
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
        color: #409EFF;
        right: 5px;
    }

    ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: #409EFF;
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
