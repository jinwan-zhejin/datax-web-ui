<!--
 * @Date: 2020-10-13 16:53:00
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-23 18:45:25
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\search.vue
 * @Description: 搜索组件
-->
<template>
  <div style="margin-bottom: 15px">
    <el-row>
      <el-col :span="24">
        <div class="searchBar">
          <el-input v-model="searchEntityName" size="medium" prefix-icon="el-icon-search" placeholder="查找实体" clearable>
            <i slot="suffix" class="el-input__icon el-icon-caret-bottom" style="cursor: pointer;" @click="showSearchCardFun" />
          </el-input>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="searchBarCard">
          <el-collapse-transition>
            <el-card v-show="showSearchCard" key="card1" shadow="always" class="card-text">
              <el-row style="margin-bottom: 15px;">
                <span style="line-height: 32px;">
                  高级<i class="el-icon-question" style="cursor: pointer;" @click="advanced=true" />
                </span>
                <el-tooltip style="float:right; position:relative;" content="刷新" placement="top">
                  <el-button size="mini" type="primary" plain @click="test">
                    <i class="el-icon-refresh" />
                  </el-button>
                </el-tooltip>
              </el-row>
              <el-row style="margin-top: 15px;">
                通过类型查找
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-select v-model="entityType" size="small" filterable placeholder="请选择实体" clearable>
                    <el-option
                      v-for="(item, index) in entities"
                      :key="index"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin-top: 15px;">
                通过查询语句查找
              </el-row>
              <el-row :span="24">
                <el-input v-model="searchByQuery" placeholder="通过查询语句查找 例.where name=&quot;sales_fact&quot;" />
              </el-row>
              <el-row style="margin-top: 15px;">
                <el-button plain type="primary" @click="clearCardInput">清空</el-button>
                <el-button plain type="primary" style="float:right; position:relative;" @click="searchEntity">搜索</el-button>
              </el-row>
            </el-card>
          </el-collapse-transition>
          <el-collapse-transition>
            <el-card v-show="showResultCard && !showSearchCard" key="card2" shadow="always" class="card-text">
              <el-row>
                <el-col style="margin-top:10px;color:#909399;font-size:16px;">实体</el-col>
                <el-table :data="tableEntities" :show-header="false">
                  <el-table-column label="nothing">
                    <template v-slot:default="{ row }">
                      <div style="cursor: pointer;" @click="gotoDetails(row)">
                        <i class="el-icon-document" style="color: #409eff" />
                        {{ row.displayText }}({{ row.typeName }})
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-col style="margin-top:10px;color:#909399;font-size:16px;">建议</el-col>
                <el-table :data="tableSuggest" :show-header="false">
                  <el-table-column label="nothing">
                    <template v-slot:default="{ row }">
                      <div style="cursor: pointer;" @click="gotoResult(row.suggest)">
                        {{ row.suggest }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-card>
          </el-collapse-transition>
        </div></el-col>
    </el-row>
    <el-dialog class="dialog" :visible.sync="advanced" width="40%" title="进阶搜寻查询" :before-close="handleClose" :append-to-body="true" :show-close="true">
      <!-- <div slot="title" class="dialog-title"></div> -->
      <div>使用DSL（特定于域的语言）构建查询</div>
      <ul>
        <li>
          <span>单次查询</span>
          <el-row>
            <el-col>
              数据库，其中name="Reporting"选择名称，所有者
            </el-col>
          </el-row>
        </li>
        <li>
          <span>通过...分组</span>
          <el-row>
            <el-col>
              从国家（地区）的客户组中选择计数（客户ID），国家
            </el-col>
          </el-row>
        </li>
        <li>
          <span>订单</span>
          <el-row>
            <el-col>
              数据库，其中name="Reporting"选择名称，所有者订单按名称限制10偏移5
            </el-col>
          </el-row>
        </li>
        <li>
          <span>限制</span>
          <el-row>
            <el-col>
              数据库，其中name="Reporting"选择名称，所有者限制10偏移量0
            </el-col>
          </el-row>
        </li>
      </ul>
      <a href="http://atlas.apache.org/#/SearchAdvance" style="color:#409eff"><i class="el-icon-info" />更多示例查询和用例</a>
      <div slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click="advanced = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'

export default {
  name: 'Search',
  props: {
    entities: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      searchEntityName: '', // 查找实体名称
      showSearchCard: false, // 搜索Card
      entityType: '', // 搜索Card -select
      searchByQuery: '', // card查找
      tableEntities: [],
      tableSuggest: [],
      advanced: false // 高级dialog
    }
  },
  computed: {
    showResultCard: {
      get() {
        return this.searchEntityName !== ''
      },
      set(val) {
        if (!val) {
          this.searchEntityName = ''
        }
      }
    }
  },
  watch: {
    entities: {
      handler(val) {
        this.entities = val
      },
      deep: true
    },
    searchEntityName: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.showSearchCard = false
        }
        if (val !== '') {
          this.getQuickSearch()
          this.getQuickSuggest()
        }
      }
    },
    showSearchCard: {
      handler(val) {
        if (!val) {
          this.entityType = ''
          this.searchByQuery = ''
        }
      }
    }
  },
  methods: {
    test(info) {
      console.log(info)
    },
    /**
     * @description: card面板清空按钮
     */
    clearCardInput() {
      this.dataBaseType = ''
      this.searchByQuery = ''
    },
    /**
     * @description: 查找实体
     */
    searchEntity() {
      return console.log('查找实体')
    },
    /**
     * @description: 搜索卡片开闭状态
     */
    showSearchCardFun() {
      this.showSearchCard = !this.showSearchCard
    },
    /**
     * @description: 获取快速查找结果
     */
    async getQuickSearch() {
      const res = await apiatlas.getQuickSearch(this.searchEntityName)
      if (res.status === 200 && res.statusText === 'OK') {
        this.tableEntities = res.data.searchResults.entities
        // console.log(this.tableEntities)
      } else {
        this.$message({
          message: '获取快速查找结果失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 获取快速查找建议
     */
    async getQuickSuggest() {
      const res = await apiatlas.getQuickSuggest(this.searchEntityName)
      if (res.status === 200 && res.statusText === 'OK') {
        this.tableSuggest = []
        var temp = res.data.suggestions
        for (var i in temp) {
          this.tableSuggest.push({
            suggest: temp[i]
          })
        }
      } else {
        this.$message({
          message: '获取快速查找建议失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 向上一级组件发送数据
     * @param {object} item detail数据
     */
    gotoDetails(item) {
      this.showSearchCard = false
      this.showResultCard = false
      this.$router.replace({
        name: 'atlasDetails',
        query: this.$route.query,
        params: {
          guid: item.guid
        }
      })
    },
    /**
     * @description: 向上一级组件发送数据
     * @param {object} suggest result数据
     */
    gotoResult(suggest) {
      this.showSearchCard = false
      this.showResultCard = false
      // this.$emit('changeresult', 'query'.concat('?').concat(suggest))
      console.log(suggest);
      this.$router.replace({
        name: 'atlasResult',
        query: {
          query: suggest
        }
      })
    },
    /**
     * @description: 处理dialog关闭事件
     */
    handleClose() {
      this.advanced = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .searchBar {
    position: relative;
    left: 12.5%;
    width: 75%;
  }
  .searchBarCard {
    position: absolute;
    z-index: 999;
    left: 12.5%;
    width: 75%;
    .el-card {
      .el-row {
        .el-col {
          ::v-deep .el-select {
            width: 100%;
          }
        }
      }
    }
    .card-text {
      font-size: 14px;
    }
  }
  ::v-deep .el-dialog__body {
    font-size: 16px;
    h1 {
      font-size: 18px;
    }
    ul {
      margin: 10px;
      li {
        margin-bottom: 8px;
        span::before {
          content: " • ";
        }
        .el-row {
          .el-col {
            margin: 10px;
          }
        }
      }
    }
  }
</style>
