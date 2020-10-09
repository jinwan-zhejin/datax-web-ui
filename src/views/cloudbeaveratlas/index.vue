<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-09 15:51:32
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside style="width: 30%; min-width: 252px;" class="left-container">
        <div class="topSearch">
          <el-button @click="changePage('atlasDetails')">test</el-button>
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
                <el-tree ref="lefttree" :data="item.toShow" default-expand-all highlight-current :props="index===3?glossariesProps:defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClick" />
              </div>
            </el-collapse-item>
          </div>
        </el-collapse>
      </el-aside>
      <el-container>
        <el-main class="right-container">
          <!-- <RightPanelTable :search-request="searchByListItem" /> -->
          <router-view name="atlas" :search-request="searchByListItem" :details-request="searchByName" @changepage="changePage" />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import RightPanelSearch from './components/rightPanelSearch'
import RightPanelTable from './components/rightPanelTable'
import RightPanelDetails from './components/rightPanelDetails'
import * as apiatlas from '@/api/datax-metadata-atlas'
import Router from 'vue-router'

const router = new Router({
  routes: [
    {
      path: '/datax/metadata/cloudbeaveratlas/atlasSearch',
      name: 'atlasSearch',
      components: { atlas: RightPanelSearch }
    },
    // 路由传参√ props传参×
    {
      path: '/datax/metadata/cloudbeaveratlas/atlasSearch/searchResult',
      name: 'atlasResult',
      components: { atlas: RightPanelTable }
    },
    {
      path: '/datax/metadata/cloudbeaveratlas/atlasDetails',
      name: 'atlasDetails',
      components: { atlas: RightPanelDetails }
    },
    {
      path: '*',
      name: 'default',
      components: { atlas: RightPanelSearch }
    }
  ]
})

export default {
  name: 'DbeaverAltas',
  router, // 私有路由
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
      searchByName: {},
      /* 折叠面板
       * collapseName 面板名（EN）
       * collapseNameCN 面板名（CN）
       * data 面板数据 - 所有数据
       *  - label 面板数据显示
       *  - value 面板数据值
       * hasVal 面板数据 - 有值
       * toShow 面板数据 - 用于显示
       * showFlat show flat tree / show group tree
       * refreshFun 刷新按钮事件
       */
      collapseList: [
        { collapseName: 'Entities', collapseNameCN: '实体',
          data: [], hasVal: [], toShow: [],
          showFlat: true, refreshFun: this.loadListEntities },
        { collapseName: 'Classifications', collapseNameCN: '分类',
          data: [], hasVal: [], toShow: [],
          showFlat: true, refreshFun: this.loadListClassifications },
        { collapseName: 'Business Metadata', collapseNameCN: '业务元数据',
          data: [], hasVal: [], toShow: [],
          showFlat: true, refreshFun: this.loadListBusinessMetadata },
        { collapseName: 'Glossaries', collapseNameCN: '词汇表',
          data: [], hasVal: [], toShow: [],
          showFlat: true, refreshFun: this.loadListGlossaries },
        { collapseName: 'Custom Filters', collapseNameCN: '自定义过滤器',
          data: [{ name: '高级搜索', children: [] }, { name: '普通搜索', children: [] }],
          hasVal: [],
          toShow: [{ name: '高级搜索', children: [] }, { name: '普通搜索', children: [] }],
          showFlat: true, refreshFun: this.loadListCustomFilters }
      ],
      notEmptyList: {}, // 有值的列表项
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
      this.$router.push({ name: 'atlasResult' })
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
        this.collapseList[0].data = res.data.entityDefs
        // 筛选有效项
        var tempObject = {}
        for (var item in this.notEmptyList.entity.entityActive) {
          if (this.notEmptyList.entity.entityActive.hasOwnProperty(item) === true) {
            tempObject[item] = this.notEmptyList.entity.entityActive[item]
          }
        }
        for (var item2 in this.notEmptyList.entity.entityDeleted) {
          if (this.notEmptyList.entity.entityDeleted.hasOwnProperty(item2) === true) {
            // 已有相同项，相加
            if (tempObject.hasOwnProperty(item2) === true) {
              tempObject[item2] += this.notEmptyList.entity.entityDeleted[item2]
            } else {
              tempObject[item2] = this.notEmptyList.entity.entityDeleted[item2]
            }
          }
        }
        // 在原列表中筛选有值的项
        this.collapseList[0].hasVal = this.collapseList[0].data.filter(
          item => tempObject.hasOwnProperty(item.name) === true)
        this.collapseList[0].toShow = this.collapseList[0].hasVal
        for (var i in this.collapseList[0].toShow) {
          this.collapseList[0].toShow[i].name = this.collapseList[0].toShow[i].name + ' (' + tempObject[this.collapseList[0].toShow[i].name].toString() + ')'
        }
        // console.log(this.collapseList[0].hasVal)
        // const res2 = await apiatlas.getListType()
        // console.log(res2.data)
        // tempObject = []
        // // 分类
        // for (var t = 0; t < this.collapseList[0].toShow.length; t++) {
        //   for (var k = 0; k < res2.data.length; k++) {
        //     if (res2.data[k].hasOwnProperty('serviceType')) {
        //       if (res2.data[k].name === this.collapseList[0].toShow[t].name.split(' (')[0]) {
        //         tempObject.push({
        //           name: res2.data[k].name,
        //           serviceType: res2.data[k].serviceType
        //         })
        //       }
        //     }
        //   }
        // }
        // var classifiy = []
        // for (var j = 0; j < tempObject.length; j++) {
        //   if (classifiy.indexOf(tempObject[j]) > -1) {
        //     continue
        //   } else {
        //
        //   }
        // }
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
        this.collapseList[1].data = res.data.classificationDefs
        this.collapseList[1].hasVal = this.collapseList[1].data.filter(
          item => this.notEmptyList.tag.tagEntities.hasOwnProperty(item.name) === true
        )
        this.collapseList[1].toShow = this.collapseList[1].hasVal
        for (var i in this.collapseList[1].toShow) {
          this.collapseList[1].toShow[i].name = this.collapseList[1].toShow[i].name + ' (' + this.notEmptyList.tag.tagEntities[this.collapseList[1].toShow[i].name].toString() + ')'
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
        this.collapseList[2].data = res.data.businessMetadataDefs
        this.collapseList[2].toShow = this.collapseList[2].data
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
        this.collapseList[3].data = res.data
        this.collapseList[3].toShow = this.collapseList[3].data
        // 处理显示tree的list
        for (var i in this.collapseList[3].toShow) {
          for (var k in this.collapseList[3].toShow[i].terms) {
            this.collapseList[3].toShow[i].terms[k].name = this.collapseList[3].toShow[i].terms[k].displayText
            this.collapseList[3].toShow[i].terms[k].fathername = this.collapseList[3].toShow[i].name
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
      const res = await apiatlas.getCustomFilters()
      // console.log(res)
      if (res !== '' || res !== undefined) {
        for (var i = 0; i < res.data.length; i++) {
          this.collapseList[4].data[1].children.push(res.data[i])
        }
        this.collapseList[4].toShow = this.collapseList[4].data
        // console.log(this.collapseList[4].toShow)
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
        this.notEmptyList = res.data.data
      } else {
        this.$message({
          message: '获取列表项数失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 切换子组件组件
     * @param {String} routerName 路由Name
     */
    changePage(routerName) {
      if (routerName === 'initSearchByListItem') {
        this.searchByListItem = {
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
        }
      } else {
        if (routerName.split('?').length === 1) {
          this.$router.push({ name: routerName })
        } else {
          this.searchByName = JSON.parse(routerName.split('?')[1])
          console.log(this.searchByName)
          this.$router.push({ name: routerName.split('?')[0] })
        }
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
    overflow-y: auto;
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
