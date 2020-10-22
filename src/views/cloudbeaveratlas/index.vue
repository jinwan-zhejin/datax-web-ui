<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-22 18:18:00
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside style="width: 25%; min-width: 200px;" class="left-container">
        <div class="topSearch">
          <!-- <el-button @click="test3">test</el-button> -->
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
              <el-tree ref="entity" v-loading="leftLoading.indexOf('entity') > -1" :data="entity.toShow" node-key="description" default-expand-all :highlight-current="entityHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickEntity" />
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
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#3D5FFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <i class="el-icon-plus" style="color:#3D5FFF;font-weight:bold;" />创建新分类
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
              <el-tree ref="classifications" v-loading="leftLoading.indexOf('classifications') > -1" :data="classifications.toShow" node-key="description" default-expand-all :highlight-current="classificationsHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickClassifications">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button v-show="resultQuery.tag === node.label.split(' (')[0]" type="text">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-plus" style="color:#3D5FFF;" />添加子分类
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-edit" style="color:#3D5FFF;" />查看/编辑
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-delete" style="color:#3D5FFF;" />删除
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="searchClassifications(data)">
                            <i class="el-icon-search" style="color:#3D5FFF;" />查找
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
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#3D5FFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="businessMetadata.showFlat = !businessMetadata.showFlat">
                          <i :class="{'el-icon-s-operation':businessMetadata.showFlat, 'el-icon-s-grid':!businessMetadata.showFlat}" style="color:#3D5FFF;font-weight:bold;" />{{ businessMetadata.showFlat?'Show flat tree':'Show group tree' }}
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <i class="el-icon-download" style="color:#3D5FFF;font-weight:bold;" />Download Import template
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <i class="el-icon-upload2" style="color:#3D5FFF;font-weight:bold;" />Import Business Metadata
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
              <el-tree ref="businessMetadata" v-loading="leftLoading.indexOf('businessMetadata') > -1" :data="businessMetadata.toShow" default-expand-all :highlight-current="businessMetadataHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickBusinessMetadata" />
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
                        <i class="el-icon-more" style="font-size:18px;-moz-transform:rotate(-90deg);-webkit-transform:rotate(-90deg);color:#3D5FFF;" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="glossaries.showFlat = !glossaries.showFlat">
                          <i :class="{'el-icon-s-operation':glossaries.showFlat, 'el-icon-s-grid':!glossaries.showFlat}" style="color:#3D5FFF;font-weight:bold;" />{{ glossaries.showFlat?'Show flat tree':'Show group tree' }}
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <i class="el-icon-download" style="color:#3D5FFF;font-weight:bold;" />Download Import template
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <i class="el-icon-upload2" style="color:#3D5FFF;font-weight:bold;" />Import Business Metadata
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
              <el-tree ref="glossaries" v-loading="leftLoading.indexOf('glossaries') > -1" :data="glossaries.toShow" default-expand-all :highlight-current="glossariesHighlight" :props="glossariesProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickGlossaries" />
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
              <el-tree ref="customFilter" v-loading="leftLoading.indexOf('customFilter') > -1" :data="customFilter.toShow" node-key="searchParameters" default-expand-all :highlight-current="customFilterHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickCustomFilter">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      v-if="node.label !== '高级搜索' && node.label !== '普通搜索'"
                      v-show="resultQuery.type === data.searchParameters.typeName && resultQuery.tag === data.searchParameters.classification"
                      type="text"
                    >
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.stop.native="filterRename(node.label, data)">
                            <i class="el-icon-edit" style="color:#3D5FFF;" />重命名
                          </el-dropdown-item>
                          <el-dropdown-item @click.stop.native="">
                            <i class="el-icon-delete" style="color:#3D5FFF;" />删除
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
        <el-header>
          <el-tooltip content="统计数据" placement="bottom-start">
            <el-button style="position: absolute; right: 30px; z-index: 999; font-size: 22px;" type="text" icon="el-icon-s-data" @click="statisticsShow=true" />
          </el-tooltip>
          <Search v-if="['atlasResult','atlasDetails'].indexOf(this.$route.name) > -1" style="margin-top: 20px" :entities="entity.data" />
        </el-header>
        <el-main class="right-container">
          <router-view
            :key="timer"
            name="atlas"
            :classification-list="classifications.hasVal"
            replace
          />
        </el-main>
      </el-container>
    </el-container>
    <Statistics :statistics-show="statisticsShow" @closestatistics="statisticsShow=false" />
    <el-dialog :visible.sync="filterRenameShow" title="重命名自定义过滤器" @close="()=>{this.$refs.filterInfo.resetFields()}">
      <el-form ref="filterInfo" :model="filterInfo">
        <el-form-item label="名称" prop="filterName" :rules="{ required: true, message: '请输入过滤器名称', trigger: 'blur' }">
          <el-input v-model="filterInfo.filterName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="filterRenameShow=false">关 闭</el-button>
        <el-button size="small" type="primary" @click="submitFilterName('filterInfo')">更 新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SubPageSearch from './components/subPageSearch'
import SubPageResult from './components/subPageResult'
import SubPageDetails from './components/subPageDetails'
import Search from './components/search'
import Statistics from './components/statistics'
import * as apiatlas from '@/api/datax-metadata-atlas'
import Router from 'vue-router'

const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/cloudbeaveratlas/management/search',
      name: 'atlasSearch',
      components: {
        atlas: SubPageSearch
      }
    },
    // 路由传参√ props传参×
    {
      path: '/cloudbeaveratlas/management/result',
      name: 'atlasResult',
      components: {
        atlas: SubPageResult
      }
    },
    {
      path: '/cloudbeaveratlas/management/details/:guid',
      name: 'atlasDetails',
      components: {
        atlas: SubPageDetails
      }
    },
    {
      path: '*',
      name: 'default',
      components: {
        atlas: SubPageSearch
      }
    }
  ]
})

export default {
  name: 'DbeaverAltas',
  components: {
    Search,
    Statistics
  },
  router, // 私有路由
  data() {
    return {
      searchTreeList: '', // 搜索树
      collapseActiveName: [], // collapse展开项
      collapseExistName: ['entity', 'classifications', 'customFilter'],
      createDialogShow: false, // 创建实体dialog显示
      leftLoading: ['entity', 'classifications', 'customFilter'],
      searchByName: {}, // 查询atlasDetails
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
      timer: '',
      entityHighlight: false,
      classificationsHighlight: false,
      businessMetadataHighlight: false,
      glossariesHighlight: false,
      customFilterHighlight: false,
      // 统计dialog显示
      statisticsShow: false,
      resultQuery: {
        // searchType: 'basic', // 搜索方式
        type: null, // 实体名
        tag: null, // 分类名
        attributes: null
      },
      filterRenameShow: false,
      filterInfo: {
        filterName: '',
        filterInfos: ''
      }
    }
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
    },
    'entity.toShow'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('entity') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('entity')]
        }
      }
    },
    'classifications.toShow'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('classifications') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('classifications')]
        }
      }
    },
    'businessMetadata.toShow'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('businessMetadata') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('businessMetadata')]
        }
      }
    },
    'glossaries.toShow'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('glossaries') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('glossaries')]
        }
      }
    },
    'customFilter.toShow'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('customFilter') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('customFilter')]
        }
      }
    },
    // '$route.query.type'(val, oldVal) {
    //   if (val === null) {
    //     this.resultQuery.type = val
    //     this.$refs.entity.setCurrentKey(null)
    //     this.entityHighlight = false
    //   } else {
    //     this.$refs.entity.setCurrentKey(val)
    //     this.entityHighlight = true
    //   }
    // },
    // '$route.query.tag'(val, oldVal) {
    //   if (val === null) {
    //     this.resultQuery.type = val
    //     this.$refs.classifications.setCurrentKey(null)
    //     this.classificationsHighlight = false
    //   } else {
    //     this.$refs.classifications.setCurrentKey(val)
    //     this.classificationsHighlight = true
    //   }
    // },
    '$route.query': {
      handler(val, oldVal) {
        this.resultQuery.type = val.hasOwnProperty('type') ? val.type : null
        this.resultQuery.tag = val.hasOwnProperty('tag') ? val.tag : null
        this.$refs.entity.setCurrentKey(this.resultQuery.type)
        this.entityHighlight = (this.resultQuery.type !== null)
        this.$refs.classifications.setCurrentKey(this.resultQuery.tag)
        this.classificationsHighlight = (this.resultQuery.tag !== null)
      },
      deep: true
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
    // this.leftLoading = this.collapseExistName
  },
  methods: {
    test(info) {
      console.log(info)
    },
    test3() {
      console.log(this.$router, this.$route)
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickEntity(data) {
      this.resultQuery.type = (this.resultQuery.type === data.name.split(' (')[0]) ? null : data.name.split(' (')[0]
      this.resultQuery.attributes = null
      var tempQuery = {}
      for (var i in this.resultQuery) {
        if (this.resultQuery[i] !== null) {
          tempQuery[i] = this.resultQuery[i]
        }
      }
      this.$router.replace({
        name: 'atlasResult',
        query: tempQuery
      })
    },
    /**
     * @description: classifications el-tree节点点击事件
     */
    handleNodeClickClassifications(data) {
      this.resultQuery.tag = (this.resultQuery.tag === data.name.split(' (')[0]) ? null : data.name.split(' (')[0]
      this.resultQuery.attributes = null
      var tempQuery = {}
      for (var i in this.resultQuery) {
        if (this.resultQuery[i] !== null) {
          tempQuery[i] = this.resultQuery[i]
        }
      }
      this.$router.replace({
        name: 'atlasResult',
        query: tempQuery
      })
    },
    /**
     * @description: 分类 - 每项 - 更多选项 - 查找
     */
    searchClassifications(data) {
      this.$router.replace({
        name: 'atlasResult',
        query: {
          searchType: 'basic',
          tag: data.name.split(' (')[0]
        }
      })
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickBusinessMetadata(data) {
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickGlossaries(data) {
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickCustomFilter(data) {
      if (this.resultQuery.type === data.searchParameters.typeName && this.resultQuery.tag === data.searchParameters.classification) {
        this.resultQuery.type = null
        this.resultQuery.tag = null
      } else {
        this.resultQuery.type = data.searchParameters.typeName
        this.resultQuery.tag = data.searchParameters.classification
      }
      for (var i = 0; i < data.searchParameters.attributes.length; i++) {
        if (this.resultQuery.attributes === null) {
          this.resultQuery.attributes = ''
        }
        this.resultQuery.attributes += data.searchParameters.attributes[i]
        if (i !== data.searchParameters.attributes.length - 1) {
          this.resultQuery.attributes += encodeURIComponent(',')
        }
      }
      var tempQuery = {}
      // eslint-disable-next-line no-redeclare
      for (var i in this.resultQuery) {
        if (this.resultQuery[i] !== null) {
          tempQuery[i] = this.resultQuery[i]
        }
      }
      this.$router.replace({
        name: 'atlasResult',
        query: tempQuery
      })
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
          item => tempObject.hasOwnProperty(item.name) === true && 'path TYPES type db column table instance'.indexOf(item.name.split('_')[item.name.split('_').length - 1]) > -1)
        this.entity.data.push({
          category: 'ENTITY',
          name: '_ALL_ENTITY_TYPES',
          description: '_ALL_ENTITY_TYPES'
        })
        this.entity.hasVal.push({
          category: 'ENTITY',
          name: '_ALL_ENTITY_TYPES',
          description: '_ALL_ENTITY_TYPES'
        })
        this.entity.toShow = this.entity.hasVal
        for (var i in this.entity.toShow) {
          if (this.entity.toShow[i].name === '_ALL_ENTITY_TYPES') {
            continue
          }
          this.entity.toShow[i].name = this.entity.toShow[i].name + ' (' + tempObject[this.entity.toShow[i].name] + ')'
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
        this.classifications.data.push(
          {
            category: 'CLASSIFICATION',
            name: '_ALL_CLASSIFICATION_TYPES',
            description: '_ALL_CLASSIFICATION_TYPES'
          },
          {
            category: 'CLASSIFICATION',
            name: '_CLASSIFIED',
            description: '_CLASSIFIED'
          },
          {
            category: 'CLASSIFICATION',
            name: '_NOT_CLASSIFIED',
            description: '_NOT_CLASSIFIED'
          }
        )
        this.classifications.hasVal.push(
          {
            category: 'CLASSIFICATION',
            name: '_ALL_CLASSIFICATION_TYPES',
            description: '_ALL_CLASSIFICATION_TYPES'
          },
          {
            category: 'CLASSIFICATION',
            name: '_CLASSIFIED',
            description: '_CLASSIFIED'
          },
          {
            category: 'CLASSIFICATION',
            name: '_NOT_CLASSIFIED',
            description: '_NOT_CLASSIFIED'
          }
        )
        this.classifications.toShow = this.classifications.hasVal
        for (var i in this.classifications.toShow) {
          if (this.classifications.toShow[i].name === '_ALL_CLASSIFICATION_TYPES' ||
              this.classifications.toShow[i].name === '_CLASSIFIED' ||
              this.classifications.toShow[i].name === '_NOT_CLASSIFIED') {
            continue
          }
          this.classifications.toShow[i].name = this.classifications.toShow[i].name + ' (' + this.notEmptyList.tag.tagEntities[this.classifications.toShow[i].name] + ')'
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
        this.customFilter.data[1].children = []
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
      // this.loadListBusinessMetadata()
      // this.loadListGlossaries()
      this.loadListCustomFilters()
      // this.loadListClassifications()
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
     * @description: 重命名
     */
    filterRename(name, data) {
      this.filterInfo.filterName = name
      this.filterInfo.filterInfos = data
      this.filterRenameShow = true
    },
    /**
     * @description: 提交修改
     */
    submitFilterName(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.filterInfo.filterInfos.name = this.filterInfo.filterName
          // console.log(this.filterInfo.filterInfos.name);
          this.setFilterName()
        } else {
          return false
        }
      })
    },
    /**
     * @description: 重命名
     */
    async setFilterName() {
      const res = await apiatlas.setCustomFilters(this.filterInfo.filterInfos)
      if (res.status === 200 && res.statusText === 'OK') {
        this.$message({
          message: '重命名成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.loadListCustomFilters()
        this.filterRenameShow = false
      } else {
        this.$message({
          message: '重命名失败',
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
        overflow-y: auto;
        background: white;
        ::v-deep .el-collapse-item__header {
            color: #3D5FFF;
            font-size: 15px;
            font-weight: bold;
            flex: 1 0 auto;
            order: -1;
            // border-bottom: #3D5FFF;
            .collapse-title {
                flex: 1 0 100%;
                order: 1;
            }
        }
    }

    .el-button {
        color: #3D5FFF;
        right: 5px;
    }

    ::v-deep .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
      background-color: #3D5FFF;
      color: white;
      i {
        color: white;
      }
      i:hover {
        color: #d7ebff;
      }
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
  .el-collapse {
    ::v-deep .el-collapse-item__header {
      color: #3D5FFF;
      font-size: 15px;
      font-weight: bold;
      flex: 1 0 auto;
      order: -1;
      // border-bottom: #3D5FFF;
      .collapse-title {
        flex: 1 0 100%;
        order: 1;
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
