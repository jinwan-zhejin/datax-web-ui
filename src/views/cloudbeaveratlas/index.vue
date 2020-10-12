<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-12 17:45:41
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside style="width: 25%; min-width: 200px;" class="left-container">
        <div class="topSearch">
          <!-- <el-button @click="changePage('atlasDetails')">test</el-button> -->
          <label class="searchLabel">搜索</label>
          <el-input v-model="searchTreeList" style="padding: 5px 0;" prefix-icon="el-icon-search" placeholder="搜索实体、分类、词汇表" clearable />
        </div>
        <el-collapse v-model="collapseActiveName">
          <el-collapse-item v-if="collapseExistName.indexOf('entity') > -1" name="entity">
            <div slot="title" class="collapse-title">
              <div style="min-width: 222px;">
                {{ entity.collapseNameCN }}
                <el-tooltip style="position: relative;float:right;margin-right:50px;" :content="entity.switchStatus?'隐藏空服务类型':'显示空服务类型'" placement="top">
                  <el-button v-model="entity.switchStatus" type="text" plain size="medium" @click.stop.native="entity.switchStatus=!entity.switchStatus">
                    <i :class="[entity.switchStatus?'el-icon-open':'el-icon-turn-off']" style="font-size:20px;" />
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;margin-right:10px;" content="刷新" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="entity.refreshFun">
                    <i class="el-icon-refresh" style="font-size:18px;" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div style="overflow-y:auto;">
              <el-tree ref="entity" :data="entity.toShow" default-expand-all highlight-current :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickEntity" />
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="collapseExistName.indexOf('classifications') > -1" name="classifications">
            <div slot="title" class="collapse-title">
              <div style="min-width: 222px;">
                {{ classifications.collapseNameCN }}
                <el-tooltip style="position: relative;float:right;margin-right:30px;" content="更多" placement="top">
                  <el-button type="text" plain size="medium">
                    <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                      <span class="el-dropdown-link">
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#409EFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <i class="el-icon-plus" style="color:#409EFF;font-weight:bold;" />创建新分类
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;margin-right:10px;" :content="classifications.switchStatus?'隐藏未使用分类':'显示未使用分类'" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="classifications.switchStatus=!classifications.switchStatus">
                    <i :class="[classifications.switchStatus?'el-icon-open':'el-icon-turn-off']" style="font-size:20px;" />
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;" content="刷新" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="classifications.refreshFun">
                    <i class="el-icon-refresh" style="font-size:18px;" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div style="overflow-y:hidden;">
              <el-tree ref="classifications" :data="classifications.toShow" default-expand-all highlight-current :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickClassifications">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button v-show="true" type="text">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-plus" style="color:#409EFF;" />添加子分类
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-edit" style="color:#409EFF;" />查看/编辑
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-delete" style="color:#409EFF;" />删除
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="handleNodeClickClassifications(data)">
                            <i class="el-icon-search" style="color:#409EFF;" />查找
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="collapseExistName.indexOf('businessMetadata') > -1" name="businessMetadata">
            <div slot="title" class="collapse-title">
              <div style="min-width: 222px;">
                {{ businessMetadata.collapseNameCN }}
                <el-tooltip style="position: relative;float:right;margin-right:30px;" content="更多" placement="top">
                  <el-button type="text" plain size="medium">
                    <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                      <span class="el-dropdown-link">
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#409EFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="businessMetadata.showFlat = !businessMetadata.showFlat">
                          <i :class="{'el-icon-s-operation':businessMetadata.showFlat, 'el-icon-s-grid':!businessMetadata.showFlat}" style="color:#409EFF;font-weight:bold;" />{{ businessMetadata.showFlat?'Show flat tree':'Show group tree' }}
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
                  <el-button type="text" plain size="medium" @click="test(businessMetadata.collapseName)">
                    <i class="el-icon-turn-off" style="font-size:20px;" />
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;" content="刷新" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="businessMetadata.refreshFun">
                    <i class="el-icon-refresh" style="font-size:18px;" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div style="overflow-y:auto;">
              <el-tree ref="businessMetadata" :data="businessMetadata.toShow" default-expand-all highlight-current :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickBusinessMetadata" />
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="collapseExistName.indexOf('glossaries') > -1" name="glossaries">
            <div slot="title" class="collapse-title">
              <div style="min-width: 222px;">
                {{ glossaries.collapseNameCN }}
                <el-tooltip style="position: relative;float:right;margin-right:30px;" content="更多" placement="top">
                  <el-button type="text" plain size="medium">
                    <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                      <span class="el-dropdown-link">
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#409EFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="glossaries.showFlat = !glossaries.showFlat">
                          <i :class="{'el-icon-s-operation':glossaries.showFlat, 'el-icon-s-grid':!glossaries.showFlat}" style="color:#409EFF;font-weight:bold;" />{{ glossaries.showFlat?'Show flat tree':'Show group tree' }}
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
                  <el-button type="text" plain size="medium" @click="test(glossaries.collapseName)">
                    <i class="el-icon-turn-off" style="font-size:20px;" />
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;" content="刷新" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="glossaries.refreshFun">
                    <i class="el-icon-refresh" style="font-size:18px;" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div style="overflow-y:auto;">
              <el-tree ref="glossaries" :data="glossaries.toShow" default-expand-all highlight-current :props="glossariesProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickGlossaries" />
            </div>
          </el-collapse-item>
          <el-collapse-item v-if="collapseExistName.indexOf('customFilter') > -1" name="customFilter">
            <div slot="title" class="collapse-title">
              <div style="min-width: 222px;">
                {{ customFilter.collapseNameCN }}
                <el-tooltip style="position: relative;float:right;margin-right:50px;" content="'显示所有':'显示类型'" placement="top">
                  <el-button type="text" plain size="medium" @click="test(customFilter.collapseName)">
                    <i class="el-icon-turn-off" style="font-size:20px;" />
                  </el-button>
                </el-tooltip>
                <el-tooltip style="position: relative;float:right;margin-right:10px;" content="刷新" placement="top">
                  <el-button type="text" plain size="medium" @click.stop.native="customFilter.refreshFun">
                    <i class="el-icon-refresh" style="font-size:18px;" />
                  </el-button>
                </el-tooltip>
              </div>
            </div>
            <div style="overflow-y:auto;">
              <el-tree ref="customFilter" :data="customFilter.toShow" default-expand-all highlight-current :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickCustomFilter">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button v-show="true" type="text">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-edit" style="color:#409EFF;" />重命名
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-delete" style="color:#409EFF;" />删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-container>
        <el-main class="right-container">
          <router-view :key="timer" name="atlas" :search-request="searchByListItem" :details-request="searchByName" @changepage="changePage" @switchpage="switchPage" />
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
  routes: [{
    path: '/datax/metadata/cloudbeaveratlas/atlasSearch',
    name: 'atlasSearch',
    components: {
      atlas: RightPanelSearch
    }
  },
  // 路由传参√ props传参×
  {
    path: '/datax/metadata/cloudbeaveratlas/atlasSearch/searchResult',
    name: 'atlasResult',
    components: {
      atlas: RightPanelTable
    }
  },
  {
    path: '/datax/metadata/cloudbeaveratlas/atlasDetails',
    name: 'atlasDetails',
    components: {
      atlas: RightPanelDetails
    }
  },
  {
    path: '*',
    name: 'default',
    components: {
      atlas: RightPanelSearch
    }
  }
  ]
})

export default {
  name: 'DbeaverAltas',
  router, // 私有路由
  data() {
    return {
      searchTreeList: '', // 搜索树
      collapseActiveName: [], // collapse展开项
      collapseExistName: ['entity', 'classifications', 'customFilter'],
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
      /* 折叠面板项
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
      entity: {
        collapseName: 'Entities',
        collapseNameCN: '实体',
        data: [],
        hasVal: [],
        toShow: [],
        showFlat: true,
        refreshFun: this.loadListEntities,
        switchStatus: false
      },
      classifications: {
        collapseName: 'Classifications',
        collapseNameCN: '分类',
        data: [],
        hasVal: [],
        toShow: [],
        showFlat: true,
        refreshFun: this.loadListClassifications,
        switchStatus: false
      },
      businessMetadata: {
        collapseName: 'Business Metadata',
        collapseNameCN: '业务元数据',
        data: [],
        hasVal: [],
        toShow: [],
        showFlat: true,
        refreshFun: this.loadListBusinessMetadata
      },
      glossaries: {
        collapseName: 'Glossaries',
        collapseNameCN: '词汇表',
        data: [],
        hasVal: [],
        toShow: [],
        showFlat: true,
        refreshFun: this.loadListGlossaries
      },
      customFilter: {
        collapseName: 'Custom Filters',
        collapseNameCN: '自定义过滤器',
        data: [{
          name: '高级搜索',
          children: []
        }, {
          name: '普通搜索',
          children: []
        }],
        hasVal: [],
        toShow: [{
          name: '高级搜索',
          children: []
        }, {
          name: '普通搜索',
          children: []
        }],
        showFlat: true,
        refreshFun: this.loadListCustomFilters
      },
      notEmptyList: {}, // 有值的列表项
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      glossariesProps: {
        label: 'name',
        children: 'terms'
      },
      timer: ''
    };
  },
  watch: {
    searchTreeList(val) {
      if (this.$refs.entity) this.$refs.entity.filter(val)
      if (this.$refs.classifications) this.$refs.classifications.filter(val)
      if (this.$refs.businessMetadata) this.$refs.businessMetadata.filter(val)
      if (this.$refs.glossaries) this.$refs.glossaries.filter(val)
      if (this.$refs.customFilter) this.$refs.customFilter.filter(val)
    },
    'entity.switchStatus'(val) {
      if (val) {
        this.entity.toShow = this.entity.data
      } else {
        this.entity.toShow = this.entity.hasVal
      }
    },
    'classifications.switchStatus'(val) {
      if (val) {
        this.classifications.toShow = this.classifications.data
      } else {
        this.classifications.toShow = this.classifications.hasVal
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
    apiatlas.simulatePostAccount({
      j_username: 'admin',
      j_password: 'admin'
    })
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
    // 展开项name
    this.collapseActiveName = this.collapseExistName // 'businessMetadata', 'glossaries',
  },
  methods: {
    test(info) {
      console.log(info)
    },
    /**
         * @description: el-tree节点点击事件
         */
    handleNodeClickEntity(data) {
      this.$router.push({
        name: 'atlasResult'
      })
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.typeName = data.name.split(' (')[0]
    },
    handleNodeClickClassifications(data) {
      this.$router.push({
        name: 'atlasResult'
      })
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.classification = data.name.split(' (')[0]
    },
    handleNodeClickBusinessMetadata(data) {
      this.$router.push({
        name: 'atlasResult'
      })
      this.searchByListItem.params.typeName = null
      this.searchByListItem.params.classification = null
      this.searchByListItem.params.termName = null
      this.searchByListItem.businessMetadata = data
    },
    handleNodeClickGlossaries(data) {
      this.$router.push({
        name: 'atlasResult'
      })
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.termName = data.name.concat('@').concat(data.fathername)
    },
    handleNodeClickCustomFilter(data) {
      this.$router.push({
        name: 'atlasResult'
      })
      this.searchByListItem.params.termName = null
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.typeName = data.searchParameters.typeName
      this.searchByListItem.params.classification = data.searchParameters.classification
    },
    /**
         * @description: 搜索左边栏el-tree节点
         */
    filterLeftTreeNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    /**
         * @description: 加载左边列表 实体
         */
    async loadListEntities() {
      const res = await apiatlas.getList('entity')
      if (res.status === 200 && res.statusText === 'OK') {
        this.entity.data = res.data.entityDefs
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
        this.entity.hasVal = this.entity.data.filter(
          item => tempObject.hasOwnProperty(item.name) === true && 'path TYPES type db column table'.indexOf(item.name.split('_')[item.name.split('_').length - 1]) > -1)
        this.entity.toShow = this.entity.hasVal
        for (var i in this.entity.toShow) {
          this.entity.toShow[i].name = this.entity.toShow[i].name + ' (' + tempObject[this.entity.toShow[i].name].toString() + ')'
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
        this.classifications.data = res.data.classificationDefs
        this.classifications.hasVal = this.classifications.data.filter(
          item => this.notEmptyList.tag.tagEntities.hasOwnProperty(item.name) === true
        )
        this.classifications.toShow = this.classifications.hasVal
        for (var i in this.classifications.toShow) {
          this.classifications.toShow[i].name = this.classifications.toShow[i].name + ' (' + this.notEmptyList.tag.tagEntities[this.classifications.toShow[i].name].toString() + ')'
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
        this.businessMetadata.data = res.data.businessMetadataDefs
        this.businessMetadata.toShow = this.businessMetadata.data
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
        this.glossaries.data = res.data
        this.glossaries.toShow = this.glossaries.data
        // 处理显示tree的list
        for (var i in this.glossaries.toShow) {
          for (var k in this.glossaries.toShow[i].terms) {
            this.glossaries.toShow[i].terms[k].name = this.glossaries.toShow[i].terms[k].displayText
            this.glossaries.toShow[i].terms[k].fathername = this.glossaries.toShow[i].name
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
          this.customFilter.data[1].children.push(res.data[i])
        }
        this.customFilter.toShow = this.customFilter.data
        // console.log(this.customFilter.toShow)
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
        this.initSearchByName()
      } else {
        if (routerName.split('?').length === 1) {
          this.$router.push({
            name: routerName
          })
        } else {
          this.searchByName = JSON.parse(routerName.split('?')[1])
          console.log(this.searchByName)
          this.$router.push({
            name: routerName.split('?')[0]
          })
        }
      }
    },
    /**
         * @description: 更改数据
         * @param {String} 数据
         */
    switchPage(routerName) {
      this.searchByName.typeName = JSON.parse(routerName.split('?')[1]).typeName
      this.searchByName.guid = JSON.parse(routerName.split('?')[1]).guid
      console.log(this.searchByName);
      this.timer = new Date().getTime()
      this.$router.push({
        name: routerName.split('?')[0]
      })
    },
    initSearchByName() {
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
