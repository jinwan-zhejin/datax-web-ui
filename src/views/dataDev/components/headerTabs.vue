<template>
<div class="header">
    <div class="aside">
        <div class="top">
            <el-row>
                <el-col :span="16">
                    <el-select v-model="selectValue" placeholder="请选择" @change="selectMethod">
                        <el-option v-for="item in projectArray" :key="item.id" :label="item.name" :value="item.name" />
                    </el-select>
                </el-col>
                <el-col style="textAlign: right;" :span="8">
                    <svg-icon style="cursor: pointer;" class="el-icon-plus" icon-class="jiatianjiawenjian-" @click="addTab" />
                </el-col>
            </el-row>
        </div>
        <div class="tree">
            <div class="search">
                <el-input v-model="searchModel" placeholder="请输入关键字" prefix-icon="el-icon-search" />
            </div>
            <!-- 数据源tree -->
            <div class="dataTree">
                <el-tree ref="tree" class="filter-tree" :data="dataTree" :props="defaultProps" lazy highlight-current node-key="id" :filter-node-method="filterNode" @node-expand="handleNodeExpand" @node-click="handleNodeClick">
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span style="fontSize: 14px;">
                            <svg-icon v-if="node.level == 1 && data.datasource === 'mysql'" icon-class="yunshujukuRDSMySQL" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'oracle'" icon-class="ORACLE" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'postgresql'" icon-class="postgresql" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'spark'" icon-class="spark" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'sqlserver'" icon-class="sqlserver1" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'impala'" icon-class="Impala" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'hive'" icon-class="Hive" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'hbase'" icon-class="HBASE" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'greenplum'" icon-class="Greenplum-x" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'db2'" icon-class="db" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'clickhouse'" icon-class="clickhouse" />
                            <svg-icon v-if="node.level == 1 && data.datasource === 'mongodb'" icon-class="ziyuan" />
                            <!-- <svg-icon v-if="node.level == 2" icon-class="database" /> -->
                            <i v-if="node.level == 2" class="el-icon-coin" />
                            <svg-icon v-if="node.level == 3" icon-class="table1" />
                            <svg-icon v-if="node.level == 4 && data.type === 'varchar' || data.type === 'text' || data.type === 'mediumtext' || data.type === 'char' || data.type === 'longtext'" icon-class="text" />
                            <svg-icon v-if="node.level == 4 && data.type === 'number' || data.type === 'double' || data.type === 'int' || data.type === 'bigint' || data.type === 'tinyint' || data.type === 'float' || data.type === 'decimal' || data.type === 'smallint'" icon-class="Group" />
                            <i v-if="node.level == 4 && data.type === 'date' || data.type === 'timestamp' || data.type === 'datetime' || data.type === 'time'" class="el-icon-date" />
                            <svg-icon v-if="node.level == 4 && data.type === 'enum'" icon-class="enumeratekeysini" />
                            <svg-icon v-if="node.level == 4 && data.type === 'set'" icon-class="main-set" />
                            <svg-icon v-if="node.level == 4 && data.type === 'blob' || data.type === 'longblob'" icon-class="Blobshangchuanwenjian" />
                            {{ data.name }}
                        </span>
                    </span>
                </el-tree>
            </div>
            <!-- 数据库tree -->
        </div>
    </div>

    <el-tabs v-model="editableTabsValue" class="tabs1" type="border-card" closable @tab-remove="removeTab">
        <!-- @tab-remove="removeTab" -->
        <!-- @edit="handleTabsEdit" -->
        <el-tab-pane v-for="(item) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
            <DataDevContent ref="content" :parentlist="sourceList" />
        </el-tab-pane>

    </el-tabs>
</div>
</template>

<script>
import DataDevContent from './content';
import * as jobProjectApi from '@/api/datax-job-project';
import * as datasourceApi from '@/api/datax-jdbcDatasource';
import {
    getTables,
    getColumns,
    getTableListWithComment,
    getTableSchema,
    getTableList,
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
            searchModel: '',
            listQuery: {
                pageNo: 1,
                pageSize: 10
            },
            arrQuery: {
                current: 1,
                size: 10
            },
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: (data, node) => {
                    if (node.level == 4) {
                        return true
                    }
                }
            },
            dataTree: [],
            firstId: '',
            treeClickCount: '',
            ByVal: {},
            sourceList: []
        };
    },
    watch: {
        'searchModel': function (val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.getProJectList()
    },
    mounted() {
        this.handleTabsEdit('', 'add');
    },
    methods: {
        handleNodeClick(data, node, nodeComp) {
            if (node.level == 3) {
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
            console.log(data, 'data')
            console.log(node.level, 'level')
            if (node.level == 1) {
                getTableSchema({
                    datasourceId: data.id
                }).then((res) => {
                    console.log(res)
                    const arr = []
                    for (let j = 0; j < res.length; j++) {
                        arr.push({
                            id: new Date().getTime() + j,
                            name: res[j],
                            dsid: data.id
                        })
                    }
                    this.$refs.tree.updateKeyChildren(data.id, arr);
                }).catch(err => {
                    console.log(err);
                })
            } else if (node.level == 2) {
                getTableListWithComment({
                    id: data.dsid,
                    schema: data.name
                }).then(res => {
                    console.log('res', res);
                    // this.tableList = res;
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
                    this.$refs.tree.updateKeyChildren(data.id, arr);
                })
            } else if (node.level == 3) {
                getTableColumns({
                    datasourceId: data.dsid,
                    tableName: data.tableName,
                    schema: data.schema
                }).then((res) => {
                    console.log(res.datas)
                    const arr = []
                    for (let j = 0; j < res.datas.length; j++) {
                        arr.push({
                            id: new Date().getTime() + j,
                            name: res.datas[j].COLUMN_NAME + ' (' + res.datas[j].DATA_TYPE + ')' + ' - ' + res.datas[j].COLUMN_COMMENT,
                            type: res.datas[j].DATA_TYPE
                        })
                    }
                    this.$refs.tree.updateKeyChildren(data.id, arr);
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
            // this.arrQuery.name = this.selectValue
            for (let i = 0; i < this.projectArray.length; i++) {
                if (this.projectArray[i].name === this.selectValue) {
                    this.arrQuery.projectId = this.projectArray[i].id;
                }
            }
            datasourceApi.getJobList(this.arrQuery).then((response) => {
                console.log(response, '数据源接口返回信息');
                for (let i = 0; i < response.records.length; i++) {
                    response.records[i].name = response.records[i].datasourceName + ' - ' + response.records[i].jdbcUrl.split('//')[1].split('/')[0]
                }
                this.dataTree = response.records;
                this.sourceList = response.records; // 传给子组件的数据
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
        }
    }
}
</script>

<style lang="scss">
.header {
    overflow: hidden;
    // border-radius: 8px;
    background: #f0f0f2;
    display: flex;

    .aside {
        width: 330px;
        min-height: 500px;
        max-height: 700px;
        overflow: scroll;
        padding: 10px;

        .top {
            height: 74px;
            line-height: 60px;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }

        .tree {
            .search {
                margin-bottom: 15px;
            }

            .dataTree {
                // width: 400px;
                background-color: #f0f0f2;

                .el-tree {
                    background: none;
                }
            }
        }
    }

    .tabs1 {
        flex: 1;
        overflow: auto;

        .el-tabs__header {
            margin: 0px;
        }
    }
}

.header>>>.el-tabs__new-tab {
    float: left;
    margin-right: 10px;
}

.header>>>.el-tabs__header {
    background-color: #ffffff;
}

.header>>>.el-tabs__new-tab {
    background-color: #ffffff;
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
</style>
