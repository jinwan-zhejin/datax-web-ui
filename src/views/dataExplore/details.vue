<template>
  <div class="details">
    <div class="main">
      <!-- 条件查询和操作 -->
      <div class="box-card">
        <div class="text">
          <div class="left">{{ obj.taskName }}</div>
          <p><i class="el-icon-tickets" /><span>{{ obj.tableName }}</span></p>
        </div>
      </div>
      <div class="line" />
      <!-- 下方图标结构内容 -->
      <div class="charts">
        <div class="right">
          <!-- 选项卡 -->
          <div class="choose">
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="数据详情" name="first">
                <!-- 表格 -->
                <template>
                  <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      prop="date"
                      width="180"
                      align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <div class="t_header_01">
                          <el-popover
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
                            <span slot="reference">
                              <i style="float:left;transform:rotate(90deg);marginTop:43px;" class="el-icon-key" @click="visible = !visible" />
                              <span style="marginLeft:10px">日期</span>
                              <i style="float:right;" class="el-icon-s-data" @click="visible = !visible" />
                            </span>
                          </el-popover>
                        </div>
                        <div class="t_header_02">
                          <span>{{ obj.rows }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      width="180"
                      align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <div class="t_header_01">
                          <el-popover
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
                            <span slot="reference">
                              <i style="float:left;" class="el-icon-s-order" />
                              <span style="marginLeft:10px">姓名</span>
                              <i style="float:right;" class="el-icon-s-data" />
                            </span>
                          </el-popover>
                        </div>
                        <div class="t_header_02">
                          <span>{{ obj.number }}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="address"
                      align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <div class="t_header_01">
                          <el-popover
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
                            <span slot="reference">
                              <i style="float:left;" class="el-icon-s-order" />
                              <span style="marginLeft:10px">地址</span>
                              <i style="float:right;" class="el-icon-s-data" />
                            </span>
                          </el-popover>
                        </div>
                        <div class="t_header_02">
                          <span>{{ obj.number }}</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-tab-pane>
              <el-tab-pane label="协议" name="second">
                <!-- 表格 -->
                <!-- <template>
                  <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                  >
                    <el-table-column
                      v-for="item in tableData"
                      :key="item"
                      width="180"
                      :prop="item"
                      align="center"
                    >
                      <template slot="header" slot-scope="scope">
                        <div class="t_header_01">
                          <el-popover
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
                            <div class="btn">
                              <el-button type="primary" size="mini" style="marginRight: 20px;float: left;">清除</el-button>
                              <el-button type="primary" size="mini" style="float: right;">应用</el-button>
                            </div>
                            <span slot="reference">
                              <i style="float:left;transform:rotate(90deg);marginTop:43px;" class="el-icon-key" @click="visible = !visible" />
                              <span style="marginLeft:10px">日期</span>
                              <i style="float:right;" class="el-icon-s-data" @click="visible = !visible" />
                            </span>
                          </el-popover>
                        </div>
                        <div class="t_header_02">
                          <span>{{ obj.rows }}</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </template> -->
              </el-tab-pane>
              <el-tab-pane label="字段" name="third">
                <ul>
                  <li>
                    <div class="title">
                      <i class="el-icon-key" /><strong style="marginLeft:10px">Id</strong>
                      <p>Post Id</p>
                    </div>
                    <div class="body">
                      <div class="lt" />
                      <div class="rg">
                        <div class="band" />
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Valid</span>
                          </div>
                          <div class="txt_rg">
                            <span>60.0k</span>
                            <span style="color:#ccc;">100%</span>
                          </div>
                        </div>
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Mismatched</span>
                          </div>
                          <div class="txt_rg">
                            <span>0</span>
                            <span style="color:#ccc;">0%</span>
                          </div>
                        </div>
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Missing</span>
                          </div>
                          <div class="txt_rg">
                            <span>0</span>
                            <span style="color:#ccc;">0%</span>
                          </div>
                        </div>
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Mean</span>
                          </div>
                          <div class="txt_rg">
                            <span>45.8m</span>
                            <span style="color:#ccc;" />
                          </div>
                        </div>
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Std. Deviation</span>
                          </div>
                          <div class="txt_rg">
                            <span>7.12m</span>
                            <span style="color:#ccc;" />
                          </div>
                        </div>
                        <div class="txt">
                          <div class="txt_lt">
                            <span>Quantiles</span>
                          </div>
                          <div class="txt_rg">
                            <span>34.6m</span>
                            <span style="color:#ccc;">Min</span>
                          </div>
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
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
          tag: '家'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1517 弄',
          zip: 200333,
          tag: '公司'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1519 弄',
          zip: 200333,
          tag: '家'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1516 弄',
          zip: 200333,
          tag: '公司'
        }
      ],
      Compact: [
      ],
      activeName: 'first',
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      data: [
        {
          label: 'columns',
          children: [
            {
              label: 'String'
            },
            {
              label: 'Id'
            },
            {
              label: 'DateTime'
            }
          ]
        }
      ],
      isTags: false,
      ibj: {},
      activeDesc: '1',
      activeSummary: '1',
      range: [0, 100],
      marks: {
        0: '34.6m',
        100: '60.5m'
      },
      userName: '',
      activeIndex: '1'
    }
  },
  created() {
    console.log(this.$route)
    this.userName = localStorage.getItem('roles').split('_')[1].split('"')[0]
    if (this.$route.query !== {}) {
      this.obj = this.$route.query
      console.log(this.obj)
    }
    console.log('1231242314')
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
    handleClick(val) {
      console.log(val)
    },
    // 获取表格数据
    getTableData() {
      const params = {
        datasourceId: this.obj.jdbcDatasourceId,
        tableName: this.obj.tableName
      }
      explore.getTableData(params).then(res => {
        const arr = [].concat.apply([], res.data)
        console.log(arr)
        if (res.code === 0) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i]
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取其他表格数据
    getOtherData() {
      const params = {
        datasourceId: this.obj.jdbcDatasourceId,
        tableName: this.obj.tableName
      }
      explore.getTwoData(params).then(res => {
        console.log(res)
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
      height: 600px;
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
                .el-table__header-wrapper {
                  .cell {
                    padding: 0px;
                    .t_header_01 {
                      width: 100%;
                      height: 100px;
                      line-height: 100px;
                      border-bottom: 1px solid rgb(230, 230, 230);
                      padding-bottom: 10px;
                      padding: 0px 10px;
                      cursor: pointer;
                      .el-popover {
                        p {
                          i {
                            margin-right: 20px;
                          }
                        }
                      }
                      i {
                        margin-top:50px;
                        transform: translateY(-50%);
                        cursor: pointer;
                      }
                    }
                    .t_header_02 {
                      height: 100px;
                      line-height: 100px;
                      padding: 0px 10px;
                      span {
                        font-weight: 700px;
                        color: skyblue;
                        font-size: 24px;
                      }
                      p {
                        height: 20px;
                        font-size: 16px;
                        padding: 0px;
                        margin: 0px;
                      }
                    }
                  }
                }
              }
              ul {
                padding: 0px;
                li {
                  list-style: none;
                  border-bottom: 1px solid #cccccc;
                  margin-bottom: 10px;
                  .title {
                    p {
                      font-size: 14px;
                    }
                  }
                  .body {
                    overflow: hidden;
                    .lt {
                      float: left;
                      width: 40%;
                      height: 200px;
                      // background-color: skyblue;
                    }
                    .rg {
                      float: right;
                      width: 60%;
                      height: 200px;
                      .band {
                        width: 100%;
                        height: 8px;
                        background-color: rgb(113, 223, 186);
                      }
                      .txt {
                        overflow: hidden;
                        height: 20px;
                        line-height: 20px;
                        .txt_lt {
                          float: left;
                          text-indent: 10px;
                          span {
                            font-size: 14px;
                          }
                        }
                        .txt_rg {
                          float: right;
                          span {
                            font-size: 14px;
                            margin: 0px 10px;
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
