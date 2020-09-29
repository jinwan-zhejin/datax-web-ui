<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-09-29 18:17:10
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside style="width: 30%; min-width: 252px;" class="left-container">
        <div class="topSearch">
          <label class="searchLabel">搜索</label>
          <el-input v-model="searchTreeList" style="padding: 5px 0;" prefix-icon="el-icon-search" placeholder="搜索实体、分类、词汇表" clearable />
        </div>
        <el-collapse v-model="collapseActiveName">
          <div v-for="(item, index) in collapseList" :key="index">
            <el-collapse-item :name="index+1">
              <div slot="title" class="collapse-title">
                <div style="min-width: 222px;">
                  {{ item.collapseNameCN }}
                  <el-tooltip style="position: relative;float:right;margin-right:30px;" content="更多" placement="top">
                    <el-button type="text" plain size="medium">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#409EFF;" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="item.showFlat = !item.showFlat">
                            <i :class="{'el-icon-s-operation':item.showFlat, 'el-icon-s-grid':!item.showFlat}" style="color:#409EFF;font-weight:bold;" />{{ item.showFlat?'Show flat tree':'Show group tree' }}
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <i class="el-icon-download" style="color:#409EFF;font-weight:bold;" />Download Import template
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <i class="el-icon-upload2" style="color:#409EFF;font-weight:bold;" />Import Business Metadata
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip style="position: relative;float:right;margin-right:10px;" content="显示空服务类型" placement="top">
                    <el-button type="text" plain size="medium" @click="test(item.collapseName)">
                      <i class="el-icon-turn-off" style="font-size:20px;" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip style="position: relative;float:right;" content="刷新" placement="top">
                    <el-button type="text" plain size="medium" @click.stop.native="item.refreshFun">
                      <i class="el-icon-refresh" style="font-size:18px;" />
                    </el-button>
                  </el-tooltip>
                </div>
              </div>
              <div style="overflow-y:auto;">
                <el-tree ref="lefttree" :data="item.collapseDataToShow" default-expand-all highlight-current :props="index===3?glossariesProps:defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClick" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-aside>
      <el-container>
        <el-main class="right-container">
          <!-- <RightPanelSearch /> -->
          <RightPanelTable :search-request="searchByListItem" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import RightPanelSearch from './components/rightPanelSearch'
import RightPanelTable from './components/rightPanelTable'
import * as apiatlas from '@/api/datax-metadata-atlas'

export default {
  name: 'DbeaverAltas',
  components: {
    // CreateNewLink
    RightPanelSearch,
    RightPanelTable
  },
  data() {
    return {
      searchTreeList: '', // 搜索树
      collapseActiveName: [], // collapse手风琴
      createDialogShow: false, // 创建实体dialog显示
      /* 存点选的实体和分类列表项
       * typeName 实体类型
       * classification 分类
       * termName 术语
       * businessmetadata 业务元数据
       */
      searchByListItem: {
        params: {
          excludeDeletedEntities: true,
          includeSubClassifications: true,
          includeSubTypes: true,
          includeClassificationAttributes: true,
          entityFilters: null,
          tagFilters: null,
          attributes: [],
          limit: 25,
          offset: 0,
          typeName: null,
          classification: null,
          termName: null
        },
        businessMetadata: null
      },
      /* 折叠面板
       * collapseName 面板名（EN）
       * collapseNameCN 面板名（CN）
       * collapseData 面板数据 - 所有数据
       *  - label 面板数据显示
       *  - value 面板数据值
       * collapseDataToShow 面板数据 - 有值
       * collapseDataToShow 面板数据 - 用于显示
       * showFlat show flat tree / show group tree
       * refreshFun 刷新按钮事件
       */
      collapseList: [
        { collapseName: 'Entities', collapseNameCN: '实体',
          collapseData: [], collapseDataHasVal: [], collapseDataToShow: [],
          showFlat: true, refreshFun: this.loadListEntities },
        { collapseName: 'Classifications', collapseNameCN: '分类',
          collapseData: [], collapseDataHasVal: [], collapseDataToShow: [],
          showFlat: true, refreshFun: this.loadListClassifications },
        { collapseName: 'Business Metadata', collapseNameCN: '业务元数据',
          collapseData: [], collapseDataHasVal: [], collapseDataToShow: [],
          showFlat: true, refreshFun: this.loadListBusinessMetadata },
        { collapseName: 'Glossaries', collapseNameCN: '词汇表',
          collapseData: [], collapseDataHasVal: [], collapseDataToShow: [],
          showFlat: true, refreshFun: this.loadListGlossaries },
        { collapseName: 'Custom Filters', collapseNameCN: '自定义过滤器',
          collapseData: [{ name: '高级搜索', children: [] }, { name: '普通搜索', children: [] }],
          collapseDataHasVal: [],
          collapseDataToShow: [{ name: '高级搜索', children: [] }, { name: '普通搜索', children: [] }],
          showFlat: true, refreshFun: this.loadListCustomFilters }
      ],
      leftListNotEmptyNameList: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      glossariesProps: {
        label: 'name',
        children: 'terms'
      }
    };
  },
  watch: {
    searchTreeList: function(val) {
      for (var i = 0; i < this.collapseList.length; i++) {
        this.$refs.lefttree[i].filter(val)
      }
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //
    // })
  },
  created() {
    // 调用接口必须先登录
    apiatlas.simulatePostAccount({ j_username: 'admin', j_password: 'admin' })
      .then((res) => {
        if (res.status === 200 && res.statusText === 'OK') {
          this.loadLeftListNotEmptyNameList().then(
            this.loadLeftList()
          )
        } else {
          this.$message({
            message: 'Atlas登录失败',
            showClose: true,
            type: 'error',
            duration: 4000
          })
        }
      })
    for (var i = 0; i < this.collapseList.length; i++) {
      this.collapseActiveName.push(i + 1)
    }
  },
  methods: {
    test(info) {
      console.log(info)
    },
    /**
     * @description: el-tree节点点击事件
     */
    handleNodeClick(data) {
      if (data.hasOwnProperty('category')) {
        switch (data.category) {
          case 'ENTITY': // 实体
            this.searchByListItem.businessMetadata = null
            this.searchByListItem.params.typeName = data.name.split(' (')[0]
            break
          case 'CLASSIFICATION': // 分类
            this.searchByListItem.businessMetadata = null
            this.searchByListItem.params.classification = data.name.split(' (')[0]
            break
          case 'BUSINESS_METADATA': // 业务元数据
            this.searchByListItem.params.typeName = null
            this.searchByListItem.params.classification = null
            this.searchByListItem.params.termName = null
            this.searchByListItem.businessMetadata = data
        }
      } else if (data.hasOwnProperty('termGuid')) { // 术语
        this.searchByListItem.businessMetadata = null
        this.searchByListItem.params.termName = data.name.concat('@').concat(data.fathername)
      } else { // 自定义过滤器
        this.searchByListItem.params.termName = null
        this.searchByListItem.businessMetadata = null
        this.searchByListItem.params.typeName = data.searchParameters.typeName
        this.searchByListItem.params.classification = data.searchParameters.classification
      }
      // console.log(this.searchByListItem)
    },
    /**
     * @description: 搜索左边栏el-tree节点
     */
    filterLeftTreeNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
     * @description: 创建实体dialog关闭/取消
     */
    createDialogOnClose() {
      this.dataBaseType = ''
      this.createDialogShow = false
    },
    /**
     * @description: 创建实体dialog提交
     */
    createDialogOnSubmit() {
      // do something
      this.dataBaseType = ''
      this.createDialogShow = false
    },
    /**
     * @description: 加载左边列表 实体
     */
    async loadListEntities() {
      const res = await apiatlas.getList('entity')
      if (res.status === 200 && res.statusText === 'OK') {
        this.collapseList[0].collapseData = res.data.entityDefs
        // 筛选有效项
        var tempObject = {}
        for (var item in this.leftListNotEmptyNameList.entity.entityActive) {
          if (this.leftListNotEmptyNameList.entity.entityActive.hasOwnProperty(item) === true) {
            tempObject[item] = this.leftListNotEmptyNameList.entity.entityActive[item]
          }
        }
        for (var item2 in this.leftListNotEmptyNameList.entity.entityDeleted) {
          if (this.leftListNotEmptyNameList.entity.entityDeleted.hasOwnProperty(item2) === true) {
            // 已有相同项，相加
            if (tempObject.hasOwnProperty(item2) === true) {
              tempObject[item2] += this.leftListNotEmptyNameList.entity.entityDeleted[item2]
            } else {
              tempObject[item2] = this.leftListNotEmptyNameList.entity.entityDeleted[item2]
            }
          }
        }
        // 在原列表中筛选有值的项
        this.collapseList[0].collapseDataHasVal = this.collapseList[0].collapseData.filter(
          item => tempObject.hasOwnProperty(item.name) === true)
        this.collapseList[0].collapseDataToShow = this.collapseList[0].collapseDataHasVal
        for (var i in this.collapseList[0].collapseDataToShow) {
          this.collapseList[0].collapseDataToShow[i].name = this.collapseList[0].collapseDataToShow[i].name + ' (' + tempObject[this.collapseList[0].collapseDataToShow[i].name].toString() + ')'
        }
      } else {
        this.$message({
          message: '获取实体列表失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 加载左边列表 分类
     */
    async loadListClassifications() {
      const res = await apiatlas.getList('classification')
      if (res.status === 200 && res.statusText === 'OK') {
        this.collapseList[1].collapseData = res.data.classificationDefs
        // 资源没被释放
        // try {
        //   console.log(this.leftListNotEmptyNameList.tag.tagEntities)
        // } catch (error) {
        //   console.log()
        // }
        this.collapseList[1].collapseDataHasVal = this.collapseList[1].collapseData.filter(
          item => this.leftListNotEmptyNameList.tag.tagEntities.hasOwnProperty(item.name) === true
        )
        this.collapseList[1].collapseDataToShow = this.collapseList[1].collapseDataHasVal
        for (var i in this.collapseList[1].collapseDataToShow) {
          this.collapseList[1].collapseDataToShow[i].name = this.collapseList[1].collapseDataToShow[i].name + ' (' + this.leftListNotEmptyNameList.tag.tagEntities[this.collapseList[1].collapseDataToShow[i].name].toString() + ')'
        }
      } else {
        this.$message({
          message: '获取分类列表失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 加载左边列表 业务元数据
     */
    async loadListBusinessMetadata() {
      const res = await apiatlas.getList('business_metadata')
      if (res.status === 200 && res.statusText === 'OK') {
        this.collapseList[2].collapseData = res.data.businessMetadataDefs
        this.collapseList[2].collapseDataToShow = this.collapseList[2].collapseData
      } else {
        this.$message({
          message: '获取业务元数据列表失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 加载左边列表 词汇表
     */
    async loadListGlossaries() {
      const res = await apiatlas.getGlossaries()
      if (res.status === 200 && res.statusText === 'OK') {
        this.collapseList[3].collapseData = res.data
        this.collapseList[3].collapseDataToShow = this.collapseList[3].collapseData
        // 处理显示tree的list
        for (var i in this.collapseList[3].collapseDataToShow) {
          for (var k in this.collapseList[3].collapseDataToShow[i].terms) {
            this.collapseList[3].collapseDataToShow[i].terms[k].name = this.collapseList[3].collapseDataToShow[i].terms[k].displayText
            this.collapseList[3].collapseDataToShow[i].terms[k].fathername = this.collapseList[3].collapseDataToShow[i].name
          }
        }
      } else {
        this.$message({
          message: '获取词汇表列表失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 加载左边列表 自定义过滤器
     */
    async loadListCustomFilters() {
      console.log('加载左边列表 - 自定义过滤器')
      const res = await apiatlas.getCustomFilters()
      // console.log(res)
      if (res !== '' || res !== undefined) {
        for (var i = 0; i < res.data.length; i++) {
          this.collapseList[4].collapseData[1].children.push(res.data[i])
        }
        this.collapseList[4].collapseDataToShow = this.collapseList[4].collapseData
        // console.log(this.collapseList[4].collapseDataToShow)
      } else {
        this.$message({
          message: '获取自定义过滤器列表失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 加载左边列表
     */
    async loadLeftList() {
      this.loadListEntities().then(res => this.loadListClassifications())
      this.loadListBusinessMetadata()
      this.loadListGlossaries()
      this.loadListCustomFilters()
      this.loadListClassifications()
    },
    /**
     * @description: 获取到有值的列表项
     */
    async loadLeftListNotEmptyNameList() {
      const res = await apiatlas.getItemsNotEmpty()
      // console.log(res)
      if (res.status === 200 && res.statusText === 'OK') {
        this.leftListNotEmptyNameList = res.data.data
      } else {
        this.$message({
          message: '获取列表项数失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  padding: 15px;
}
.left-container {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100%;
  background-color: transparent;
  border-right: 1px solid rgb(209, 204, 204);
  padding: 5px;
  text-align: left;
  font-family: Arial, Helvetica, sans-serif;
  .topSearch {
    height: 79px;
    .searchLabel {
      font-size: 18px;
      font-weight: normal;
      color: dimgray;
    }
  }
  .el-collapse {
    height: calc(100vh - 219px);
    overflow-y: scroll;
    ::v-deep .el-collapse-item__header {
      color: #409EFF;
      font-size: 15px;
      font-weight: bold;
      flex: 1 0 auto;
      order: -1;
      .collapse-title {
        flex: 1 0 100%;
        order: 1;
      }
    }
  }
  .el-button {
    color: #409EFF;
    right: 5px;
  }
  ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #409EFF;
    color: white;
  }
  ::v-deep .el-tree-node__content:hover {
    background-color: #d9e6fd;
    // color: #fff;
  }
}
.right-container {
  height: calc(100vh - 132px);
}
.leftBtn {
  text-align: right;
  padding-bottom: 2px;
  padding-right: 10px;
}
.el-dialog {
  .el-row {
    .el-col {
      ::v-deep .el-select {
        width: 100%;
      }
    }
  }
}
.form-ring {
  margin-top: 5px;
  width: 100%;
  padding: 15px;
  border-style: dashed;
  border-radius: 20px;
  // border:3px solid rgba(201, 201, 201, 0.7);
  border-color: rgba(201, 201, 201, 0.7);
}
</style>
