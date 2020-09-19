<template>
  <div class="details">
    <!-- 选项卡及上图 -->
    <div class="top">
      <div class="img">
        <h2>{{ obj.taskName }}</h2>
        <p class="p1">{{ obj.intro }}</p>
        <div class="user">
          <a>
            <i class="el-icon-user" />
            {{ userName }}
          </a>
        </div>
      </div>
      <div class="tabs">
        <!-- 导航选项 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">数据</el-menu-item>
          <!-- <el-menu-item index="2">Tasks</el-menu-item>
          <el-menu-item index="3">Notebooks</el-menu-item>
          <el-menu-item index="4">Discussion</el-menu-item>
          <el-menu-item index="5">Activity</el-menu-item>
          <el-menu-item index="6">Metadata</el-menu-item> -->
        </el-menu>
        <!-- 下载 -->
        <!-- <div class="down">
          <el-button type="default" round>Download</el-button>
          <el-button type="info" round>New Notebook</el-button>
        </div> -->
      </div>
    </div>
    <!-- tags标签栏 -->
    <div v-show="isTags" class="tags">
      <el-row>
        <el-col :span="4">
          <el-popover
            placement="bottom"
            title="标题"
            width="200"
            trigger="hover"
            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
          >
            <span slot="reference">
              <i class="el-icon-s-cooperation" />
              <strong>Usability</strong>
            </span>
          </el-popover>
        </el-col>
        <el-col :span="10">
          <i class="el-icon-s-flag" /><strong>License</strong>
        </el-col>
        <el-col :span="10">
          <i class="el-icon-collection-tag" /><strong>Tags</strong>
        </el-col>
      </el-row>
    </div>
    <!-- 描述折叠框 -->
    <div class="folding">
      <div class="tit">
        描述
      </div>
      <!-- 折叠内容 -->
      <div class="content">
        <el-collapse v-model="activeDesc">
          <el-collapse-item title="详细描述" name="1">
            <div style="text-indent:2rem;">&nbsp;&nbsp;{{ obj.description }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 描述折叠框 -->
    <div class="folding">
      <div class="tit">
        概括
      </div>
      <!-- 折叠内容 -->
      <div class="content">
        <el-collapse v-model="activeSummary">
          <el-collapse-item title="Summary" name="1">
            <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 下方图标结构内容 -->
    <div class="charts">
      <!-- <div class="left">
        <h4>
          Data Explorer
        </h4>
        <p class="dataSize">64.07 MB</p>
        <a><i class="el-icon-document" />data.csv</a>
        <div class="lt_tree">
          <h4>
            Summary
          </h4>
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
        </div>
      </div> -->
      <div class="right">
        <!-- 选项卡 -->
        <div class="choose">
          <div class="ch_top">
            <div class="lt">
              <span style="fontSize:16px;fontWeight:700;">{{ obj.tableName }}</span>
              <span style="fontSize:16px;">{{ obj.size }}</span>
            </div>
            <div class="rg">
              <a><i class="el-icon-download" /></a>
            </div>
          </div>
          <el-tabs v-model="activeName">
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
</template>

<script>
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
      userName: ''
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
  },
  methods: {
    indexMethod(index) {
      return index
    }
  }
}
</script>

<style lang="scss">
.details {
  padding: 50px;
  .top {
    border: 1px solid #cccccc;
    margin-bottom: 20px;
    .img {
      width: 100%;
      height: 300px;
      background: url('../../assets/dataset-cover.png');
      background-size: 100%;
      padding: 0px 20px;
      padding-top: 100px;
      position: relative;
      h2 {
        margin: 0px;
        color: #ffffff;
        // text-indent: 20px;
      }
      .p1 {
        font-size: 20px;
        color: #fff;
      }
      .user {
        width: 100%;
        height: 60px;
        line-height: 60px;
        position: absolute;
        bottom: 0;
        a {
          color: #fff;
        }
      }
    }
    .tabs {
      overflow: hidden;
      .el-menu {
        float: left;
        border: none;
        width: 60%;
        box-shadow: -10px 0px 20px -10px #ccc inset;
      }
      .down {
        float: right;
        width: 40%;
        height: 60px;
        line-height: 60px;
        .el-button {
          margin-left: 20px;
        }
      }
    }
  }
  .tags {
    width: 100%;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 10px 0px;
    .el-row {
      .el-col {
        text-align: center;
        i {
          margin-right: 20px;
          color: #002000;
        }
      }
    }
  }
  .folding {
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 5px;
    margin-bottom: 20px;
    .tit {
      height: 60px;
      line-height: 60px;
      text-indent: 20px;
    }
    .content {
      padding-bottom: 10px;
      .el-collapse {
        .el-collapse-item {
          .el-collapse-item__header {
            text-indent: 20px;
          }
        }
      }
    }
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
        border: 1px solid #cccccc;
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
</style>
