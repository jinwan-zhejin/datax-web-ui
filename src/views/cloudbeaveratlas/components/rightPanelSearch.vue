<!--
 * @Date: 2020-09-28 17:35:47
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-14 14:25:25
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelSearch.vue
 * @Description: 右半部分查找 子组件
-->
<template>
  <div>
    <div style="height: 100%">
      <div id="create">
        <el-button type="success" plain size="medium" icon="el-icon-circle-plus" @click="createDialogShow = true">新建实体</el-button>
      </div>
      <!-- <el-row style="top:20%">
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
                    高级<i class="el-icon-question" style="cursor: pointer;" @click="test" />
                  </span>
                  <el-tooltip style="float:right; position:relative;" content="刷新" placement="top">
                    <el-button size="mini" type="success" plain @click="test">
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
                        v-for="item in entities"
                        :key="item.name"
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
                  <el-button type="success" @click="clearCardInput">清空</el-button>
                  <el-button style="float:right; position:relative;" type="success" @click="searchEntity">搜索</el-button>
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
      </el-row> -->
      <Search class="search" :entities="entities" @changedetail="changeDetail" @changeresult="changeResult" />
    </div>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'
import Search from './search'

export default {
  name: 'RightPanelSearch',
  components: {
    Search
  },
  props: {
    entities: Object
  },
  data() {
    return {
      searchEntityName: '', // 查找实体名称
      showSearchCard: false, // 搜索Card
      entityType: '', // 搜索Card -select
      searchByQuery: '', // card查找
      tableEntities: [],
      tableSuggest: []
    }
  },
  computed: {
    showResultCard: {
      get() {
        return this.searchEntityName !== ''
      },
      set(val) {
        this.searchEntityName = val
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
        // console.log(res.data.searchResults.entities)
        this.tableEntities = res.data.searchResults.entities
        console.log(this.tableEntities)
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
    gotoDetails(item) {
      this.$emit('changedetail', JSON.stringify(item))
    },
    gotoResult(suggest) {
      this.$emit('changeresult', 'query'.concat('?').concat(suggest))
    },
    /**
     * @description: 担任转述人，向父组件原封不动转述子组件内容
     * @param {string} objectJson detail传值
     */
    changeDetail(objectJson) {
      this.$emit('changedetail', objectJson)
    },
    /**
     * @description: 担任转述人，向父组件原封不动转述子组件内容
     * @param {string} string result传值
     */
    changeResult(string) {
      this.$emit('changeresult', string)
    }
  }
}
</script>

<style lang="scss" scoped>
  #create {
    .el-button {
      z-index: 999;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    ::v-deep .el-button--success {
      color:  #409EFF;
      background-color:#fff;
      border-color: #409EFF;
    }
    ::v-deep .el-button--success:hover {
      color:  #fff;
      background-color:#409EFF;
      border-color: #409EFF;
    }
  }
  .search {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 72%;
    ::v-deep .searchBar {
      .el-input__inner {
        font-size: 16px;
        height: 52px;
        line-height:52px;
      }
    }
  }

</style>
