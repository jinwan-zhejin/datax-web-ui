<template>
<div v-loading="loading" class="details">
    <div class="main">
        <!-- 条件查询和操作 -->
        <div class="box-card">
            <div class="text">
                <div class="left">{{ obj.taskName }}</div>
                <p><i class="el-icon-tickets" /><span>{{ obj.tableName }}</span><i class="el-icon-s-grid" style="margin-left: 10px" /><span>{{ obj.cols }} Columns</span></p>

            </div>
        </div>
        <div class="line" />
        <!-- 下方图标结构内容 -->
        <div class="charts">
            <div class="right">
                <!-- 选项卡 -->
                <div class="choose">
                    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="Detail" name="first">
                            <!-- 表格 -->
                            <template>
                                <el-table :data="tableData" background-color="#F8F8FA" border style="width: 100%;" height="600px" ref="myTable">
                                    <el-table-column v-for="item in tableData1" :key="item.name" width="200" :prop="item.name" align="left">
                                        <template slot="header" slot-scope="scope">
                                            <div class="t_header_01">
                                                <!-- 弹出框 -->
                                                <!-- <el-popover
                            placement="bottom"
                            width="200"
                            height="250"
                            trigger="click"
                          >
                            <p><i class="el-icon-top" /><span>升序</span></p>
                            <p><i class="el-icon-bottom" /><span>降序</span></p>
                            <div class="block" style="padding:20px">
                              <el-slider
                                v-model="range"
                                range
                                :marks="marks"
                              />
                            </div>
                            <el-button type="primary" style="marginRight: 20px;">清除</el-button>
                            <el-button type="primary">应用</el-button>
                          </el-popover> -->
                                                <svg-icon style="position: absolute;left: 5%;top:50%;transform: translateY(-50%);" icon-class="xql_1" @click="visible = !visible" />
                                                <span style="marginLeft:15%">{{ item.name }}</span>
                                                <svg-icon style="position: absolute;right: 5%;top:50%;transform: translateY(-50%);" icon-class="xqr_1" @click="visible = !visible" />
                                            </div>
                                            <div class="t_header_02">
                                                <p v-show="item.type === 'string'" class="p1">{{ item.statistics }}</p>
                                                <p v-show="item.type === 'string'">Unique</p>
                                                <p v-show="item.type === 'date'" class="p2">{{ item.statistics }}</p>
                                                <p v-show="item.type === 'date'">Last Modified Date</p>
                                                <!-- <v-chart v-show="item.type === 'number'" style="width: 150px;height: 100px;margin: 0 auto;" :options="polar" /> -->
                                                <vechart v-show="item.type === 'number'" style="width: 150px;height: 100px;margin: 0 auto;" :data="item.statistics" />
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="Data" name="second">
                            <!-- 表格 -->
                            <template>
                                <el-table :data="tableData" background-color="#F8F8FA" border style="width: 100%" height="600px" ref="myTable1">
                                    <el-table-column v-for="item in tableData1" :key="item.name" width="200" :prop="item.name" align="left">
                                        <template slot="header" slot-scope="scope">
                                            <div class="t_header_01" style="border:none">
                                                <!-- <el-popover
                            placement="bottom"
                            width="200"
                            height="250"
                            trigger="click"
                          >
                            <p><i class="el-icon-top" /><span>升序</span></p>
                            <p><i class="el-icon-bottom" /><span>降序</span></p>
                            <div class="block" style="padding:20px">
                              <el-slider
                                v-model="range"
                                range
                                :marks="marks"
                              />
                            </div>
                            <el-button type="primary" style="marginRight: 20px;">清除</el-button>
                            <el-button type="primary">应用</el-button>
                          </el-popover> -->
                                                <svg-icon style="position: absolute;left: 5%;top:50%;transform: translateY(-50%);" icon-class="xql_1" @click="visible = !visible" />
                                                <span style="marginLeft:15%">{{ item.name }}</span>
                                                <svg-icon style="position: absolute;right: 5%;top:50%;transform: translateY(-50%);" icon-class="xqr_1" @click="visible = !visible" />
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="Columns" name="third">
                            <ul>
                                <li v-for="item in tableData1" :key="item.name">
                                    <div class="lt">
                                        <div class="title_lt">
                                            <p>
                                                <svg-icon icon-class="xql_1" />
                                                <span>{{ item.name }}</span>
                                            </p>
                                            <div class="unique">
                                                <vechart v-show="item.type === 'number'" style="width: 150px;height: 100px;margin: 20px;" :data="item.statistics" />
                                                <div v-show="item.type === 'string'" class="value">
                                                    <p class="v_p1">
                                                        {{ item.statistics }}
                                                    </p>
                                                    <p class="v_p2">
                                                        Unique Value
                                                    </p>
                                                </div>
                                                <div v-show="item.type === 'date'" class="value">
                                                    <p class="v_p1">
                                                        {{ item.statistics }}
                                                    </p>
                                                    <p class="v_p2">
                                                        Last Modified Date
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div class="rg">
                                        <div class="color">
                                            <div :style="{width:item.indicator.valid && item.indicator.valid.rate}" class="right" />
                                        </div>
                                        <div class="c_main">
                                            <div class="rg_txt">
                                                <p>
                                                    <span style="backgroundColor: #00B600" />
                                                    <i>Valid</i>
                                                    <i class="m_r_t">{{ item.indicator.valid && item.indicator.valid.rate }}</i>
                                                    <i class="m_t">{{ item.indicator.valid && item.indicator.valid.rate }}</i>
                                                </p>
                                                <!-- <p>
                            <span style="backgroundColor: #FFA215;" />
                            <i>错配</i>
                            <i class="m_r_t">{{ item.indicator.misssing.rate }}</i>
                            <i class="m_t">{{ item.indicator.misssing.rate }}</i>
                          </p> -->
                                                <p>
                                                    <span style="backgroundColor: #FE4646;" />
                                                    <i>Nulls</i>
                                                    <i class="m_r_t">{{ item.indicator.misssing && item.indicator.misssing.rate }}</i>
                                                    <i class="m_t">{{ item.indicator.misssing && item.indicator.misssing.value }}</i>
                                                </p>
                                                <p>
                                                    <i>Unique</i>
                                                    <i class="m_r_t">{{ item.indicator.unique && item.indicator.unique.rate }}</i>
                                                    <i class="m_t">{{ item.indicator.unique && item.indicator.unique.value }}</i>
                                                </p>
                                                <p>
                                                    <i>Most Common</i>
                                                    <i class="m_r_t">{{ item.indicator.unique && item.indicator.mostCommon.rate }}</i>
                                                    <el-tooltip class="item" effect="dark" :content="item.indicator.unique && item.indicator.mostCommon.value" placement="top-end">
                                                        <i class="m_t">{{ item.indicator.unique && item.indicator.mostCommon.value }}</i>
                                                    </el-tooltip>
                                                </p>
                                                <p v-if="item.type === 'number'">
                                                    <i>Maximum</i>
                                                    <i class="m_t">{{ item.indicator.maximum && item.indicator.maximum.value }}</i>
                                                </p>
                                                <p v-if="item.type === 'number'">
                                                    <i>Minimum</i>
                                                    <i class="m_t">{{ item.indicator.minimum && item.indicator.minimum.value }}</i>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import * as explore from '@/api/data-explore'
import vechart from './vEchart.vue'
export default {
    components: {
        vechart
    },
    data() {
        return {
            tableData: [],
            tableData1: [],
            C_Name: [],
            Compact: [],
            activeName: 'first',
            visible: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data: [{
                label: 'columns',
                children: [{
                        label: 'String'
                    },
                    {
                        label: 'Id'
                    },
                    {
                        label: 'DateTime'
                    }
                ]
            }],
            isTags: false,
            loading: true,
            loading1: true,
            ibj: {},
            activeDesc: '1',
            activeSummary: '1',
            range: [0, 100],
            marks: {
                0: '34.6m',
                100: '60.5m'
            },
            userName: '',
            activeIndex: '1',
            polar: {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: '8%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true,
                        show: false
                    }
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '96%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                }]
            },
            dataTable: [{
                    name: 'id',
                    value: 1,
                    title: 'ID',
                    arr: [{
                            min: 1,
                            max: 5,
                            number: 4
                        },
                        {
                            min: 4,
                            max: 9,
                            number: 7
                        },
                        {
                            min: 16,
                            max: 35,
                            number: 29
                        },
                        {
                            min: 1,
                            max: 28,
                            number: 20
                        }
                    ]
                },
                {
                    name: 'name',
                    value: 1,
                    title: '名字',
                    arr: [{
                            min: 1,
                            max: 5,
                            number: 8
                        },
                        {
                            min: 4,
                            max: 9,
                            number: 3
                        },
                        {
                            min: 16,
                            max: 35,
                            number: 34
                        },
                        {
                            min: 1,
                            max: 28,
                            number: 23
                        }
                    ]
                },
                {
                    name: 'age',
                    value: 1,
                    title: '年龄',
                    arr: [{
                            min: 1,
                            max: 5,
                            number: 4
                        },
                        {
                            min: 4,
                            max: 9,
                            number: 7
                        },
                        {
                            min: 16,
                            max: 35,
                            number: 29
                        },
                        {
                            min: 1,
                            max: 28,
                            number: 20
                        }
                    ]
                }
            ],
            ListData: [{
                    name: '张三',
                    id: 3,
                    age: 19
                },
                {
                    name: '李四',
                    id: 4,
                    age: 19
                }
            ],
            pageNumber: 1,
            pageSize: 10, //  
            total: ""
        }
    },
    mounted() {
        this.lazyLoad()
        this.lazyLoad1()
    },

    created() {
        console.log(this.$route)
        this.userName = localStorage.getItem('roles').split('_')[1].split('"')[0]
        if (this.$route.query !== {}) {
            this.obj = this.$route.query
            console.log(this.obj)
        }
        this.getTableData()
        this.getOtherData()
    },
    methods: {
        indexMethod(index) {
            return index
        },
        handleSelect(val) {
            console.log(val)
        },

        // 获取表格数据
        getTableData() {
            const params = {
                datasourceId: this.obj.jdbcDatasourceId,
                tableName: this.obj.tableName,
                pageSize: this.pageSize,
                pageNumber: this.pageNumber
            }
            explore.getTableData(params).then(res => {
                const arr = []
                console.log(res)
                this.total = res.total
                let obj = {}
                let newObj = {}
                for (let i = 0; i < res.datas.length; i++) {
                    obj = {}
                    for (let j = 0; j < res.datas[i].length; j++) {
                        obj = Object.assign(obj, res.datas[i][j])
                        if (j === res.datas[i].length - 1) {
                            newObj = obj
                        }
                    }
                    arr.push(newObj)
                }
                console.log(obj)
                console.log(arr, '______')
                this.tableData.push(...arr)
                this.loading = false
            }).catch(err => {
                console.log(err)
            })
        },
        lazyLoad() {
            console.log('监听表格dom对象的滚动事件')
            const that = this
            const dom = that.$refs.myTable.bodyWrapper
            dom.addEventListener('scroll', function () {
                const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
                console.log('scroll', scrollDistance)
                if (scrollDistance <= 0) { // 等于0证明已经到底，可以请求接口
                    if (that.pageNumber < Math.ceil(that.total / that.pageNumber)) { // 当前页数小于总页数就请求
                        that.pageNumber++; // 当前页数自增
                        // 请求接口的代码
                        that.getTableData()
                    }
                }
            })
        },
        lazyLoad1() {
            console.log('监听表格dom对象的滚动事件')
            const that = this
            const dom1 = that.$refs.myTable1.bodyWrapper
            dom1.addEventListener('scroll', function () {
                const scrollDistance = dom1.scrollHeight - dom1.scrollTop - dom1.clientHeight;
                console.log('scroll1', scrollDistance)
                if (scrollDistance <= 0) { // 等于0证明已经到底，可以请求接口
                    if (that.pageNumber < Math.ceil(that.total / that.pageNumber)) { // 当前页数小于总页数就请求
                        that.pageNumber++; // 当前页数自增
                        // 请求接口的代码
                        that.getTableData()
                    }
                }
            })
        },
        handleClick(val) {
            console.log(val)
            if (val.label === 'Data') {
                this.tableData = []
                this.total = ''
                this.pageNumber = 1
                this.pageSize = 10
                this.getTableData()
            } else if (val.label === 'Detail') {
                this.tableData = []
                this.total = ''
                this.pageNumber = 1
                this.pageSize = 10
                this.getTableData()
            }
        },
        // 获取其他表格数据
        getOtherData() {
            const params = {
                datasourceId: this.obj.jdbcDatasourceId,
                tableName: this.obj.tableName
            }
            explore.getTwoData(params).then(res => {
                console.log(res)
                this.tableData1 = res
                this.loading1 = false
                // this.polar.series[0].data = []
                // for (let i = 0; i < res.length; i++) {
                //   if (res[i].type === 'number') {
                //     for (let j = 0; j < res[i].statistics.length; j++) {
                //       this.polar.series[0].data.push(res[i].statistics[j].number)
                //     }
                //   }
                // }
                console.log(this.polar.series[0].data)
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style lang="scss">
.details {
    padding: 20px;

    .main {
        background-color: #fff;
        overflow: hidden;
        border-radius: 8px;

        .box-card {
            overflow: hidden;
            height: 84px;
            border-radius: 4px;
            padding: 0px;

            .text {
                margin-left: 24px;

                .left {
                    font-size: 24px;
                    font-family: PingFangHK-Medium, PingFangHK;
                    font-weight: 500;
                    color: #333333;
                    margin-top: 24px;
                }

                p {
                    font-size: 14px;
                    margin-top: 10px;

                    i {
                        margin-right: 8px;
                    }
                }
            }
        }

        .line {
            height: 1px;
            background: #F3F3F3;
        }

        .charts {
            width: 100%;
            // height: 600px;
            overflow: hidden;
            position: relative;
            margin-top: 20px;

            .left {
                width: 30%;
                float: left;

                .dataSize {
                    font-size: 16px;
                }

                a {
                    color: skyblue;

                    i {
                        margin-right: 10px;
                    }
                }

                .lt_tree {
                    width: 25%;
                    position: absolute;
                    bottom: 0px;
                    border-top: 1px solid #ccc;
                    border-bottom: 1px solid #ccc;

                    .el-tree {
                        margin: 10px 0px;
                    }
                }
            }

            .right {
                width: 100%;
                float: right;
                height: 100%;
                overflow-y: auto;

                .choose {
                    border-radius: 5px;
                    height: 100%;
                    padding: 20px;

                    .ch_top {
                        height: 60px;
                        line-height: 60px;
                        overflow: hidden;

                        .lt {
                            float: left;

                            span {
                                margin: 0px 10px;
                            }
                        }

                        .rg {
                            float: right;

                            a {
                                margin: 0px 20px;
                            }
                        }
                    }

                    .el-tabs {
                        .el-tab-pane {
                            .sort {
                                width: 100%;
                                height: 80px;

                                h2 {
                                    font-size: 20px;
                                    color: skyblue;
                                    margin: 10px;
                                }

                                p {
                                    margin: 5px;
                                    padding: 0px;

                                    a {
                                        color: skyblue;
                                    }
                                }
                            }

                            .el-table {
                                margin-top: 10px;

                                th {
                                    padding: 0px;
                                }

                                .el-table__header-wrapper {
                                    .cell {
                                        padding: 0px;

                                        .t_header_01 {
                                            width: 100%;
                                            height: 48px;
                                            line-height: 48px;
                                            overflow: hidden;
                                            text-overflow: ellipsis; //超出部分以省略号显示
                                            white-space: nowrap;
                                            text-align: left;
                                            border: none;
                                            background-color: #F8F8FA;
                                            padding-bottom: 10px;
                                            padding: 0px 10px;
                                            position: relative;
                                            cursor: pointer;

                                            i::before {
                                                position: absolute;
                                            }
                                        }

                                        .t_header_02 {
                                            height: 100px;
                                            padding: 0px 10px;
                                            position: relative;

                                            .p1 {
                                                font-weight: 700px;
                                                position: absolute;
                                                top: 40px;
                                                transform: translateY(-50%);
                                                color: skyblue;
                                                font-size: 24px;
                                            }

                                            .p2 {
                                                font-weight: 700px;
                                                position: absolute;
                                                top: 40px;
                                                transform: translateY(-50%);
                                                color: skyblue;
                                                font-size: 16px;
                                            }

                                            p {
                                                height: 20px;
                                                text-align: left;
                                                font-size: 16px;
                                                position: absolute;
                                                top: 70px;
                                                transform: translateY(-50%);
                                                padding: 0px;
                                                margin-left: 10px;
                                            }
                                        }
                                    }
                                }
                            }

                            ul {
                                padding: 0px;

                                li {
                                    list-style: none;
                                    border-radius: 2px;
                                    border: 1px solid #E0E0E0;
                                    margin-bottom: 10px;
                                    width: 100%;
                                    height: 204px;
                                    padding: 20px;
                                    overflow: hidden;

                                    .lt {
                                        float: left;
                                        width: 40%;

                                        .title_lt {
                                            span {
                                                margin-left: 20px;
                                            }
                                        }

                                        .unique {
                                            width: 100%;
                                            height: 100%;

                                            .value {
                                                margin-top: 16px;
                                                margin-left: 22px;

                                                .v_p1 {
                                                    font-size: 24px;
                                                    font-family: PingFangHK-Medium, PingFangHK;
                                                    font-weight: 500;
                                                    color: #1774FF;
                                                    margin-bottom: 8px;
                                                }

                                                .v_p2 {
                                                    font-size: 14px;
                                                    font-family: PingFangHK-Regular, PingFangHK;
                                                    font-weight: 400;
                                                    color: #333333;
                                                }
                                            }
                                        }
                                    }

                                    .rg {
                                        width: 50%;
                                        float: right;

                                        .color {
                                            width: 100%;
                                            height: 8px;
                                            background: #FE4646;
                                            border-radius: 0px 1px 1px 0px;

                                            .right {
                                                height: 8px;
                                                background-color: #00B600;
                                                border-radius: 0px 1px 1px 0px;
                                            }
                                        }

                                        .c_main {
                                            margin-top: 20px;

                                            .rg_txt {
                                                p {
                                                    height: 24px;
                                                    line-height: 24px;
                                                    position: relative;

                                                    span {
                                                        margin-right: 10px;
                                                        width: 8px;
                                                        height: 8px;
                                                        display: inline-block;
                                                    }

                                                    .m_t {
                                                        width: 70px;
                                                        position: absolute;
                                                        right: 20%;
                                                        overflow: hidden;
                                                        text-overflow: ellipsis; //超出部分以省略号显示
                                                        white-space: nowrap;
                                                    }

                                                    .m_r_t {
                                                        width: 70px;
                                                        overflow: hidden;
                                                        text-overflow: ellipsis; //超出部分以省略号显示
                                                        white-space: nowrap;
                                                        position: absolute;
                                                        right: 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        .el-popover {
            padding: 20px;

            .block {
                padding: 20px;

                .el-slider__marks-text {
                    width: 40px;
                }
            }
        }
    }
}
</style>
