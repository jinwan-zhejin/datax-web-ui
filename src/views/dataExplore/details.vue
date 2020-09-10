<template>
  <div class="details">
    <!-- 选项卡及上图 -->
    <div class="top">
      <div class="img">
        <h2>{{ obj.title }}</h2>
        <p class="p1">{{ obj.text }}</p>
        <div class="user">
          <a>
            <i class="el-icon-user" />
            {{ obj.title }}
          </a>
          <a>·{{ obj.id }}</a>
        </div>
      </div>
      <div class="tabs">
        <!-- 导航选项 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">Data</el-menu-item>
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
        Description
      </div>
      <!-- 折叠内容 -->
      <div class="content">
        <el-collapse v-model="activeNames" @change="handleChange">
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
              <i class="el-icon-arrow-left" />
              <span style="fontSize:16px;fontWeight:700;">data.csv</span>
              <span style="fontSize:16px;">64.07 MB</span>
            </div>
            <div class="rg">
              <a><i class="el-icon-download" /></a>
              <a><svg-icon icon-class="link" /></a>
              <a><i class="el-icon-full-screen" /></a>
            </div>
          </div>
          <el-tabs v-model="activeName">
            <el-tab-pane label="Detail" name="first">
              <div class="sort">
                <h2>About this file</h2>
                <p><span>Remote source:</span><a>https://www.kaggle.com/imoore/phd-merge-3-csvs-from-queries</a></p>
                <p>The main file that contains metadata with the assigned quality rating (Y)</p>
              </div>
              <!-- 表格 -->
              <template>
                <el-table
                  :data="tableData"
                  border
                  height="200"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    :index="indexMethod"
                    label="序号"
                  />
                  <el-table-column
                    prop="date"
                    width="180"
                  >
                    <template slot="header" slot-scope="row">
                      <i class="el-icon-key" />
                      日期
                      {{ row.date }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="姓名"
                    width="180"
                  />
                  <el-table-column
                    prop="address"
                    label="地址"
                  />
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="Compact" name="second">
              <!-- 表格 -->
              <template>
                <el-table
                  :data="tableData"
                  border
                  height="200"
                  style="width: 100%"
                >
                  <el-table-column
                    type="index"
                    :index="indexMethod"
                  />
                  <el-table-column
                    prop="date"
                    label="日期"
                    width="180"
                  />
                  <el-table-column
                    prop="name"
                    label="姓名"
                    width="180"
                  />
                  <el-table-column
                    prop="address"
                    label="地址"
                  />
                </el-table>
              </template>
            </el-tab-pane>
            <el-tab-pane label="Column" name="third">
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
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      data: [
        {
          label: 'file',
          children: [
            {
              label: '.csv'
            }
          ]
        },
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
      ibj: {}
    }
  },
  created() {
    console.log(this.$route)
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

<style lang="scss" scoped>
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
    .tit {
      height: 60px;
      line-height: 60px;
      text-indent: 20px;
    }
    .content {
      padding-bottom: 10px;
      text-indent: 20px;
    }
  }
  .charts {
    width: 100%;
    height: 400px;
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
      height: 400px;
      overflow-y: auto;
      .choose {
        border: 1px solid #cccccc;
        border-radius: 5px;
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
}
</style>
