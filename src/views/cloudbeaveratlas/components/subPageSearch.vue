<!--
 * @Date: 2020-09-28 17:35:47
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-11-02 13:34:05
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\subPageSearch.vue
 * @Description: 右半部分查找 子组件
-->
<template>
  <div>
    <el-row>
      <!-- <div id="create">
        <el-button type="primary" plain size="medium" icon="el-icon-plus" @click="createDialogShow = true">新建实体</el-button>
      </div> -->
      <el-col>
        <Search class="search" :entities="entities" @changedetail="changeDetail" @changeresult="changeResult" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'
import Search from './search'

export default {
  name: 'SubPageSearch',
  components: {
    Search
  },
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
  created() {

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
  }
  .el-row {
    overflow: hidden;
    .el-col {
      padding-top: calc(15vh);
      height: calc(100vh - 250px);
    }
  }
  .search {
    // position: absolute;
    // top: 45%;
    // transform: translateY(-45%);
    // z-index: 999;
    width: 100%;
    ::v-deep .searchBar {
      .el-input__inner {
        font-size: 16px;
        height: 52px;
        line-height:52px;
      }
    }
    ::v-deep .searchBarCard {
      height: calc(45vh);
      overflow-y: auto;
    }
  }

</style>
