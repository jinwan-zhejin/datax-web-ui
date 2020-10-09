<!--
 * @Date: 2020-09-28 17:35:47
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-09 15:56:05
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelSearch.vue
 * @Description: 右半部分查找 子组件
-->
<template>
  <div>
    <div style="height: 100%">
      <div id="create">
        <el-button type="success" plain size="medium" icon="el-icon-circle-plus" @click="createDialogShow = true">新建实体</el-button>
      </div>
      <el-row style="top:20%">
        <el-col :span="24">
          <div id="searchBar">
            <el-input v-model="searchEntityName" size="medium" prefix-icon="el-icon-search" placeholder="查找实体" clearable>
              <i slot="suffix" class="el-input__icon el-icon-caret-bottom" style="cursor: pointer;" @click="showSearchCard = !showSearchCard" />
            </el-input>
          </div>
        </el-col>
        <el-col :span="24">
          <transition name="el-zoom-in-top">
            <div id="searchBarCard">
              <el-card v-show="showSearchCard" shadow="always" class="card-text">
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
                    <el-select v-model="dataBaseType" size="small" filterable placeholder="请选择">
                      <el-option
                        v-for="item in dataBaseTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
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
            </div>
          </transition>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
export default {
  name: 'RightPanelSearch',
  data() {
    return {
      searchEntityName: '', // 查找实体名称
      searchByQuery: '', // card查找
      showSearchCard: false, // 搜索Card
      dataBaseType: '', // 搜索Card -select
      dataBaseTypeOptions: [{ // 搜索Card -select options
        value: 'adls_gen2_account',
        label: 'adls_gen2_account'
      }, {
        value: 'adls_gen2_blob',
        label: 'adls_gen2_blob'
      }, {
        value: 'adls_gen2_child',
        label: 'adls_gen2_child'
      }, {
        value: 'adls_gen2_container',
        label: 'adls_gen2_container'
      }, {
        value: 'adls_gen2_directory',
        label: 'adls_gen2_directory'
      }]
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
  #searchBar {
    position: relative;
    top: 200px;
    // transform: translateY(-40%);
    .el-input {
      ::v-deep .el-input__inner {
        height: 52px;
        line-height:52px;
        border-color: rgba(88, 88, 88, 0.6);
      }
    }
  }
  #searchBarCard {
    position: relative;
    top: 200px;
    // transform: translateY(-56%);
    .el-card {
      .el-row {
        ::v-deep .el-button--success {
          font-size: 16px;
          font-weight: bold;
          color:  #409EFF;
          background-color:#fff;
          border-color: #409EFF;
        }
        ::v-deep .el-button--success:hover {
          color:  #fff;
          background-color:#409EFF;
          border-color: #409EFF;
        }
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

</style>
