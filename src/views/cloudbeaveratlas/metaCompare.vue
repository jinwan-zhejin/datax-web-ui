<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: ,: Anybody
 * @LastEditTime: ,: 2020-11-04 17:14:24
 * @FilePath: ,: \datax-web-ui\src\views\cloudbeaveratlas\metaCompare.vue
 * @Description: 元数据比对 index
-->

<template>
  <div class="container">
    <el-container>
      <!-- 左边栏 -->
      <el-aside>
        <div class="top-search">
          <label class="title-label">
            元数据比对
          </label>
          <el-divider />
        </div>
        <div class="bottom-list">
          <!-- {{ tableData }} -->
          <label>已提交的比对请求</label>
          <el-form class="input_search">
            <el-form-item>
              <el-input
                v-model="filterText"
                prefix-icon="el-icon-search"
                placeholder="搜索任务ID"
                clearable
              />
            </el-form-item>
          </el-form>
          <!-- {{ filterTableData }} -->
          <el-scrollbar>
            <div class="list">
              <ul>
                <li v-for="(item, index) in filterTableData" :key="index" @click="handleRecordClick(item)">
                  <el-col :span="2">
                    <i class="el-icon-document" />
                  </el-col>
                  <el-col :span="22">
                    <span>{{ item.id }}&nbsp;&nbsp;{{ item.name + ' (' + item.typeName + ')' }}</span>
                  </el-col>
                </li>
              </ul>
            </div>
          </el-scrollbar>
        </div>
      </el-aside>
      <!-- 右边栏 -->
      <el-container>
        <!-- <el-main> -->
        <el-tabs v-model="tabsVal" type="border-card" closable @tab-remove="handleRemoveTab">
          <el-tab-pane v-if="tabsArray.length <= 0" label="起始页" name="0">
            起始页
          </el-tab-pane>
          <el-tab-pane
            v-for="(item, index) in tabsArray"
            :key="index"
            :label="number2String(item.id)"
            :name="number2String(item.id)"
          >
            <div class="tab-container">
              <el-scrollbar>
                <div class="text-container">
                  <MetaCompareDetails :details-info="item" @closeall="handleRemoveAllTab" />
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas';
import MetaCompareDetails from './components/metaCompareDetails'

export default {
  name: 'MetaCompare',
  filters: {
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? '0' + MM : MM;
      let d = date.getDate();
      d = d < 10 ? '0' + d : d;
      let h = date.getHours();
      h = h < 10 ? '0' + h : h;
      let m = date.getMinutes();
      m = m < 10 ? '0' + m : m;
      let s = date.getSeconds();
      s = s < 10 ? '0' + s : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s + ' (CST)';
    }
  },
  components: {
    MetaCompareDetails
  },
  data() {
    return {
      tableData: [], // 所有记录
      filterText: '', // 左列表筛选
      tabsArray: [], // 列表 保存Tab页信息
      tabsVal: '0'
    };
  },
  computed: {
    filterTableData() {
      return this.tableData.filter(item => {
        return item.id.toString().indexOf(this.filterText) > -1
      })
    },
    number2String() {
      return num => {
        return num + ''
      }
    }
  },
  watch: {},
  mounted() {},
  created() {
    // 调用接口必须先登录
    this.refreshTable();
  },
  methods: {
    /**
     * @description: 左边列表点击事件
     */
    handleRecordClick(item) {
      this.tabsVal = this.number2String(item.id)
      if (this.tabsArray.length <= 0) {
        this.tabsArray.push(item)
      } else {
        for (var i = 0; i < this.tabsArray.length; i++) {
          if (item.id === this.tabsArray[i].id) {
            break
          }
          if (i === this.tabsArray.length - 1) {
            this.tabsArray.push(item)
          }
        }
      }
    },
    /**
     * @description: 关闭当前这个tab
     */
    handleRemoveTab(tabId) {
      this.tabsArray = this.tabsArray.filter(item => this.number2String(item.id) !== tabId)
      if (this.tabsArray.length <= 0) {
        this.tabsVal = '0'
      }
    },
    handleRemoveAllTab() {
      this.tabsArray = []
      this.tabsVal = '0'
    },
    /**
     * @description: 获取所有比对记录
     */
    async refreshTable() {
      const res = await apiatlas.getAllCompareRecord();
      // console.log(res)
      if (res.code === 200) {
        this.tableData = res.content;
        // console.log(this.tableData)
      } else {
        this.$message({
          message: '获取所有比对记录失败',
          showClose: true,
          type: 'error',
          duration: 4000
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 24px 24px 35px 24px;
  height: calc(100vh - 109px);
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .el-container {
    height: 100%;
    // left
    .el-aside {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      overflow-x: hidden;
      overflow-y: hidden;
      background: #f8f8fa;
      padding: 24px 0 24px 24px;
      height: 100%;
      text-align: left;
      font-family: PingFangHK-Medium, PingFangHK;
      .top-search {
        margin-bottom: 10px;
        padding-right: 24px;
        .title-label {
          font-size: 24px;
          font-weight: normal;
          color: #333333;
        }
      }
      .bottom-list {
        label {
          color: #333333;
        }
        .input_search {
          padding-right: 24px;
        }
        .el-scrollbar {
          height: calc(100vh - 20rem);
          .list {
            padding-right: 24px;
            ul {
              padding: 0px;
              li {
                height: 24px;
                font-size: 15px;
                line-height: 24px;
                text-align: left;
                list-style: none;
                margin: 5px 0px;
                cursor: pointer;
                i {
                  color: #3d5eff;
                }
                span {
                  color: #666666;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  -webkit-box-orient: vertical;
                }
              }
              li:hover {
                background: #d9e6fd;
              }
            }
          }
        }
        .el-scrollbar >>> .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }
    // right
    .el-container {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      background: white;
      overflow: hidden;
      .el-tabs {
        width: 100%;
        height: 100%;
        .tab-container {
          padding: 10px 0 10px 10px;
          .text-container {
            padding-right: 10px;
            padding-bottom: 10px;
          }
        }
        .el-scrollbar {
          height: calc(100vh - 12rem);
        }
        .el-scrollbar >>> .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }
  }
}
</style>
