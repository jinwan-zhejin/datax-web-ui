<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-29 19:04:25
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\index.vue
 * @Description: 元数据管理-apache atlas
-->

<template>
  <div ref="container" class="container">
    <el-container style="height: 100%;">
      <el-aside width="25%" style="min-width: 200px">
        <div class="top-search">
          <label class="title-label">
            元数据管理
            <el-tooltip content="统计数据" placement="bottom-start">
              <el-button style="font-size: 22px;" type="text" icon="el-icon-s-data" @click="statisticsShow=true" />
            </el-tooltip>
          </label>
          <el-input v-model="searchTreeList" prefix-icon="el-icon-search" placeholder="搜索实体/分类" clearable />
        </div>
        <el-collapse v-model="collapseActiveName">
          <el-collapse-item v-if="collapseExistName.indexOf('entity') > -1" name="entity">
            <div slot="title" class="collapse-title">
              {{ entity.collapseNameCN }}
            </div>
            <el-col class="collapse-more">
              <el-checkbox v-model="entity.switchStatus"> 显示空服务类型</el-checkbox>
              <el-tooltip content="刷新" placement="top">
                <el-button type="text" size="medium" icon="el-icon-refresh" @click="entity.refreshFun" />
              </el-tooltip>
            </el-col>
            <el-col class="collapse-tree">
              <el-tree ref="entity" v-loading="leftLoading.indexOf('entity') > -1" :data="entity.switchStatus?entity.data:entity_Active" node-key="name" default-expand-all :highlight-current="entityHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickEntity">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span><i class="el-icon-document" /> {{ node.label }} {{ data.hasOwnProperty('countActive')?(' ('+data.countActive+')'):'' }}</span>
                </span>
              </el-tree>
            </el-col>
          </el-collapse-item>
          <el-collapse-item v-if="collapseExistName.indexOf('classifications') > -1" name="classifications">
            <div slot="title" class="collapse-title">
              {{ classifications.collapseNameCN }}
            </div>
            <el-col class="collapse-more">
              <el-checkbox v-model="classifications.switchStatus"> 显示未使用分类</el-checkbox>
              <el-tooltip content="更多" placement="top">
                <el-button type="text" size="medium">
                  <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                    <span class="el-dropdown-link">
                      <i class="el-icon-plus" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.stop.native="addNewClassification(undefined)">
                        <i class="el-icon-plus" />创建新分类
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-button>
              </el-tooltip>
              <el-tooltip content="刷新" placement="top">
                <el-button type="text" size="medium" icon="el-icon-refresh" @click="classifications.refreshFun" />
              </el-tooltip>
            </el-col>
            <el-col class="collapse-tree">
              <el-tree ref="classifications" v-loading="leftLoading.indexOf('classifications') > -1" :data="classifications.switchStatus?classifications.data:tag_Active" node-key="name" default-expand-all :highlight-current="classificationsHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickClassifications">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}{{ data.hasOwnProperty('countActive')?(' ('+data.countActive+')'):'' }}</span>
                  <span>
                    <el-button v-show="resultQuery.tag === node.label" type="text">
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="'_ALL_CLASSIFICATION_TYPES _CLASSIFIED _NOT_CLASSIFIED'.indexOf(node.label) <= -1" @click.stop.native="addNewClassification(data)">
                            <i class="el-icon-plus" style="color:#3D5FFF;" />添加子分类
                          </el-dropdown-item>
                          <el-dropdown-item v-if="'_ALL_CLASSIFICATION_TYPES _CLASSIFIED _NOT_CLASSIFIED'.indexOf(node.label) <= -1" @click.stop.native="gotoViewEdit(data)">
                            <i class="el-icon-edit" style="color:#3D5FFF;" />查看/编辑
                          </el-dropdown-item>
                          <el-dropdown-item v-if="'_ALL_CLASSIFICATION_TYPES _CLASSIFIED _NOT_CLASSIFIED'.indexOf(node.label) <= -1" @click.stop.native="openDeleteClassification(data)">
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
            </el-col>
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
              {{ customFilter.collapseNameCN }}
            </div>
            <el-col class="collapse-more">
              <el-tooltip content="刷新" placement="top">
                <el-button type="text" size="medium" icon="el-icon-refresh" @click="customFilter.refreshFun" />
              </el-tooltip>
            </el-col>
            <el-col class="collapse-tree">
              <el-tree ref="customFilter" v-loading="leftLoading.indexOf('customFilter') > -1" :data="customFilter.data" node-key="searchParameters.guid" default-expand-all :highlight-current="customFilterHighlight" :props="defaultProps" :filter-node-method="filterLeftTreeNode" @node-click="handleNodeClickCustomFilter">
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <!-- 显示的文字 -->
                  <span>{{ node.label }}</span>
                  <span>
                    <el-button
                      v-if="node.label !== '高级搜索' && node.label !== '普通搜索'"
                      v-show="validateTypeNameClassification(data)"
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
                          <el-dropdown-item @click.stop.native="filterDelete(node.label, data)">
                            <i class="el-icon-delete" style="color:#3D5FFF;" />删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                  </span>
                </span>
              </el-tree>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-container>
        <!-- <el-header>
          <el-form :inline="true" label-position="right" label-width="120px">
            <el-form-item label="实体类型：">
              <el-popover
                placement="bottom"
                title="实体类型选项"
                trigger="click"
                @hide="openEntityPopover=false"
              >
                <el-button
                  slot="reference"
                  style="width: calc(25vw);"
                  plain
                  size="medium"
                  :icon="openEntityPopover?'el-icon-arrow-down':'el-icon-arrow-right'"
                  @click="openEntityPopover=!openEntityPopover"
                >{{ resultQuery.type === null ? '实体类型选项' : resultQuery.type }}</el-button>
                <el-form-item label="刷新">
                  <el-button type="text" size="medium" icon="el-icon-refresh" @click="entity.refreshFun" />
                </el-form-item>
                <el-form-item label="显示空服务类型">
                  <el-switch v-model="entity.switchStatus" style="position: relative; float: right;margin-top: 10px" />
                </el-form-item>
                <el-row type="flex" class="list-row" justify="space-around">
                  <el-col :span="4">
                    <el-tooltip content="刷新" placement="top">
                      <el-button type="primary" size="medium" icon="el-icon-refresh" @click="entity.refreshFun" />
                    </el-tooltip>
                  </el-col>
                </el-row>
                当前选择：{{ resultQuery.type === null ? '无' : resultQuery.type }}
                <el-form-item label="实体类型项">
                  <div class="list-row-outside">
                    <el-row :gutter="10" class="list-row" justify="space-around">
                      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-radio v-model="resultQuery.type" :label="null" border size="medium" @change="test('')">无</el-radio>
                      </el-col>
                      <el-col v-for="(item, index) in entity.switchStatus?entity.data:entity_Active" :key="index" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                        <el-radio v-model="resultQuery.type" :label="item.name" border size="medium" @change="handleNodeClickEntity(item)">
                          {{ item.name }}{{ item.hasOwnProperty('countActive')?(' ('+item.countActive+')'):'' }}
                        </el-radio>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-popover>
            </el-form-item>
            <el-form-item label="分类：">
              <el-popover
                placement="bottom"
                title="分类选项"
                trigger="click"
                @hide="openTagPopover=false"
              >
                <el-button slot="reference" style="width: calc(25vw);" plain size="medium" :icon="openTagPopover?'el-icon-arrow-down':'el-icon-arrow-right'" @click="openTagPopover=!openTagPopover">分类选项</el-button>
                这是一段内容,这是一段内容,这是一段内容,这是一段内容。
              </el-popover>
            </el-form-item>
            <el-form-item label="筛选：">
              <el-popover
                placement="bottom"
                title="筛选选项"
                trigger="click"
                @hide="openTagPopover=false"
              >
                <el-button slot="reference" style="width: calc(25vw);" plain size="medium" :icon="openTagPopover?'el-icon-arrow-down':'el-icon-arrow-right'" @click="openTagPopover=!openTagPopover">分类选项</el-button>
                这是一段内容,这是一段内容,这是一段内容,这是一段内容。
              </el-popover>
            </el-form-item>
          </el-form>
          <el-divider />
          <el-form label-position="right" label-width="120px">
            <el-form-item label="自定义过滤器：">
              <el-popover
                placement="bottom"
                title="自定义过滤器选项"
                trigger="click"
                @hide="openFilterPopover=false"
              >
                <el-button slot="reference" style="width: calc(25vw);" plain size="medium" :icon="openFilterPopover?'el-icon-arrow-down':'el-icon-arrow-right'" @click="openFilterPopover=!openFilterPopover">自定义过滤器选项</el-button>
                这是一段内容,这是一段内容,这是一段内容,这是一段内容。
              </el-popover>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" size="mini" plain>重置</el-button>
              <el-button type="primary" size="mini" plain>保存</el-button>
            </el-form-item>
          </el-form>
        </el-header> -->
        <el-header>
          <Search v-if="['atlasResult','atlasDetails'].indexOf(this.$route.name) > -1" style="padding: 24px;" :entities="entity.data" />
        </el-header>
        <el-main>
          <router-view
            :key="timer"
            name="atlas"
            :classification-list="tag_Active"
            :entities="entity.data"
            :tag-attribute="classifications.data"
            replace
            @refreshcustomlist="loadListCustomFilters"
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
        <el-button v-loading="isLoading" size="small" type="primary" @click="submitFilterName('filterInfo')">更 新</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="filterDeleteShow" title="删除自定义过滤器" @close="filterDeleteShow=false">
      删除自定义过滤器 {{ filterInfo.filterName }} ?
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="filterDeleteShow=false">关 闭</el-button>
        <el-button v-loading="isLoading" size="small" type="primary" @click="submitDeleteFilter">删 除</el-button>
      </div>
    </el-dialog>
    <AddNewClassification
      :all-classification="classifications.data"
      :super-types="classifications.superTypes"
      :add-new-classification-show="addNewClassificationShow"
      @closeaddnewclassification="addNewClassificationShow=false"
      @refreshclassification="loadListClassifications"
    />
    <el-dialog :visible.sync="classificationDeleteShow" title="删除分类" @close="classificationDeleteShow=false">
      删除该分类 {{ classificationToDelete.description }} ?
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="classificationDeleteShow=false">关 闭</el-button>
        <el-button v-loading="isLoading" size="small" type="primary" @click="deleteNewClassification">删 除</el-button>
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
import AddNewClassification from './components/addNewClassification'
import SubPageTagAttr from './components/subPageTagAttr'

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
      path: '/cloudbeaveratlas/management/tagAttribute/:name',
      name: 'atlasTagAttr',
      components: {
        atlas: SubPageTagAttr
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
    Statistics,
    AddNewClassification
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
        showFlat: true,
        refreshFun: this.loadListEntities,
        switchStatus: false,
        entityActiveList: []
      },
      classifications: {
        collapseName: 'Classifications',
        collapseNameCN: '分类',
        data: [],
        showFlat: true,
        refreshFun: this.loadListClassifications,
        switchStatus: true,
        superTypes: '',
        tagAttrData: ''
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
      },
      filterDeleteShow: false,
      addNewClassificationShow: false,
      classificationDeleteShow: false,
      classificationToDelete: '', // 待删除
      isLoading: false,
      openEntityPopover: false, // 打开实体类型popover
      openTagPopover: false, // 打开分类popover
      openFilterPopover: false, // 打开自定义过滤器popover
      entitySelected: ''
    }
  },
  computed: {
    validateTypeNameClassification() {
      return data => {
        var valid1 = false
        var valid2 = false
        valid1 = data.searchParameters.hasOwnProperty('typeName')
          ? (this.resultQuery.type === data.searchParameters.typeName) : true
        valid2 = data.searchParameters.hasOwnProperty('classification')
          ? (valid2 = this.resultQuery.tag === data.searchParameters.classification) : true
        return (valid1 === true && valid2 === true)
      }
    },
    // entity有值项
    entity_Active() {
      return this.entity.data.filter(
        item => {
          if (this.entityActiveList.hasOwnProperty(item.name) && 'path type db column table instance'.indexOf(item.name.split('_')[item.name.split('_').length - 1]) > -1) {
            item.countActive = this.entityActiveList[item.name]
            return true
          } else if (item.name.indexOf('TYPES') > -1) {
            return true
          }
        }
      )
    },
    tag_Active() {
      return this.classifications.data.filter(
        item => {
          if (this.notEmptyList.tag.tagEntities.hasOwnProperty(item.name)) {
            item.countActive = this.notEmptyList.tag.tagEntities[item.name]
            return true
          } else if (item.name.charAt(0) === '_') {
            return true
          }
        }
      )
    }
    // tag_Tree() {
    //   // 顶层
    //   const tempTop = this.classifications.data.filter(item => {
    //     if (item.superTypes.length === 0 && item.subTypes.length > 0) {
    //       return true
    //     }
    //   })
    //   // 叶子节点
    //   const tempLeaf = this.classifications.data.filter(item => {
    //     if (item.superTypes.length > 0 && item.subTypes.length === 0) {
    //       return true
    //     }
    //   })
    //   // 中间节点
    //   const tempMiddle = this.classifications.data.filter(item => {
    //     if (item.superTypes.length > 0 && item.subTypes.length > 0) {
    //       return true
    //     }
    //   })
    //   var temp = tempTop
    //   return temp
    // }
  },
  watch: {
    searchTreeList(val) {
      if (this.$refs.entity) this.$refs.entity.filter(val)
      if (this.$refs.classifications) this.$refs.classifications.filter(val)
      if (this.$refs.businessMetadata) this.$refs.businessMetadata.filter(val)
      if (this.$refs.glossaries) this.$refs.glossaries.filter(val)
      if (this.$refs.customFilter) this.$refs.customFilter.filter(val)
    },
    'entity.data'(val) {
      if (val !== []) {
        if (this.leftLoading.indexOf('entity') > -1) {
          delete this.leftLoading[this.leftLoading.indexOf('entity')]
        }
      }
    },
    'classifications.data'(val) {
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
    'customFilter.data': {
      handler(val, oldVal) {
        if (val[0] !== [] || val[1] !== []) {
          if (this.leftLoading.indexOf('customFilter') > -1) {
            delete this.leftLoading[this.leftLoading.indexOf('customFilter')]
          }
        }
      },
      deep: true
    },
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
    this.isLoading = false
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
      this.resultQuery.type = (this.resultQuery.type === data.name) ? null : data.name
      // this.resultQuery.type = (data === null) ? null : data.name
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
      this.resultQuery.tag = (this.resultQuery.tag === data.name) ? null : data.name
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
          // searchType: 'basic',
          tag: data.name
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
     * @description: CustomFilter el-tree节点点击事件
     */
    handleNodeClickCustomFilter(data) {
      this.resultQuery.type = (!data.searchParameters.hasOwnProperty('typeName'))
        ? null : (this.resultQuery.type = this.resultQuery.type === data.searchParameters.typeName
          ? null : data.searchParameters.typeName)
      this.resultQuery.tag = (!data.searchParameters.hasOwnProperty('classification'))
        ? null : (this.resultQuery.tag = this.resultQuery.tag === data.searchParameters.classification
          ? null : data.searchParameters.classification)
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
      // console.log(this.$route.query);
      // console.log(data);
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
        this.entity.data.push({
          category: 'ENTITY',
          name: '_ALL_ENTITY_TYPES',
          description: '_ALL_ENTITY_TYPES'
        })
        // 筛选有效项, 合并统计所有数量
        console.log(this.notEmptyList.entity.entityActive);
        this.entityActiveList = this.notEmptyList.entity.entityActive
        for (var i in this.notEmptyList.entity.entityDeleted) {
          this.entityActiveList[i] = this.entityActiveList.hasOwnProperty(i)
            ? (this.entityActiveList[i] + this.notEmptyList.entity.entityDeleted[i]) : this.notEmptyList.entity.entityDeleted[i]
        }
        for (i in this.notEmptyList.entity.entityShell) {
          this.entityActiveList[i] = this.entityActiveList.hasOwnProperty(i)
            ? (this.entityActiveList[i] + this.notEmptyList.entity.entityShell[i]) : this.notEmptyList.entity.entityShell[i]
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
        // console.log(this.tag_Tree);
        this.classifications.data.push(
          {
            category: 'CLASSIFICATION',
            name: '_ALL_CLASSIFICATION_TYPES',
            description: '_ALL_CLASSIFICATION_TYPES',
            subTypes: [],
            superTypes: []
          },
          {
            category: 'CLASSIFICATION',
            name: '_CLASSIFIED',
            description: '_CLASSIFIED',
            subTypes: [],
            superTypes: []
          },
          {
            category: 'CLASSIFICATION',
            name: '_NOT_CLASSIFIED',
            description: '_NOT_CLASSIFIED',
            subTypes: [],
            superTypes: []
          }
        )
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
      if (res.status === 200 && res.statusText === 'OK') {
        this.customFilter.data[0].children = []
        this.customFilter.data[1].children = []
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].searchType === 'BASIC') {
            this.customFilter.data[1].children.push(res.data[i])
          } else {
            this.customFilter.data[0].children.push(res.data[i])
          }
        }
        // console.log(this.customFilter.data);
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
      // console.log(res.data.data)
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
    filterDelete(name, data) {
      this.filterInfo.filterName = name
      this.filterInfo.filterInfos = data.guid
      this.filterDeleteShow = true
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
    submitDeleteFilter() {
      this.deleteFilter()
    },
    /**
     * @description: 重命名
     */
    async setFilterName() {
      this.isLoading = true
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
        this.isLoading = false
      } else {
        this.$message({
          message: '重命名失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = false
      }
    },
    async deleteFilter() {
      this.isLoading = true
      const res = await apiatlas.deleteCustomFilters(this.filterInfo.filterInfos)
      // console.log(res);
      if (res.status === 204) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.loadListCustomFilters()
        this.filterDeleteShow = false
        this.isLoading = false
      } else {
        this.$message({
          message: '删除失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = false
      }
    },
    openDeleteClassification(data) {
      this.classificationToDelete = data
      this.classificationDeleteShow = true
    },
    async deleteNewClassification() {
      this.isLoading = true
      const res = await apiatlas.deleteNewClassification(this.classificationToDelete.description)
      if (res.status === 204) {
        this.$message({
          message: '删除成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.loadListClassifications()
        this.$router.replace({
          name: 'atlasSearch',
          query: {}
        })
        this.classificationDeleteShow = false
        this.classificationToDelete = ''
        this.isLoading = false
      } else {
        this.$message({
          message: '删除失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = false
      }
    },
    /**
     * @description: 打开添加新分类/子分类面板
     * @param {object} 参数
     */
    addNewClassification(data) {
      if (data !== undefined) {
        this.classifications.superTypes = data.name
      } else {
        this.classifications.superTypes = ''
      }
      this.addNewClassificationShow = true
    },
    /**
     * @description: 转到查看编辑页面
     */
    gotoViewEdit(data) {
      // console.log(data);
      this.classifications.tagAttrData = data
      this.$router.replace({
        name: 'atlasTagAttr',
        query: this.$route.query,
        params: {
          name: data.name
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 24px 24px 35px 24px;
  height: calc(100vh - 109px);
  box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  .el-container {
    .el-aside {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      overflow-x: hidden;
      overflow-y: hidden;
      background: #F8F8FA;
      padding: 24px 23px;
      height: 100%;
      text-align: left;
      font-family: Arial, Helvetica, sans-serif;
      .top-search {
        height: 79px;
        margin-bottom: 10px;
        .title-label {
          font-size: 24px;
          font-weight: normal;
          color: #333333;
        }
      }
      .el-collapse {
        height: calc(100vh - 230px);
        overflow-y: auto;
        border: 0;
        .el-collapse-item {
          .collapse-tree {
            max-height:400px;
            overflow-y:auto;
          }
          .collapse-more {
            margin-bottom: 5px;
            .el-checkbox {
              color: #666666;
              ::v-deep .el-checkbox__label {
                font-size: 12px;
              }
              ::v-deep .el-checkbox__inner {
                border-radius: 50%;
              }
            }
            .el-tooltip {
              position: relative;
              float: right;
              padding: 0 5px;
            }
            .el-button {
              font-size: 19px;
              i {
                font-size: 19px;
                color: #3D5FFF;
              }
            }
          }
          ::v-deep .el-collapse-item__header { // collapse抬头
            // color: #3D5FFF;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            font-weight: bold;
            background: transparent;
            .collapse-title {
              background: transparent;
            }
          }
          ::v-deep .el-collapse-item__wrap { // collapse内容
            background: transparent;
          }
        }
      }
      .el-button {
        right: 5px;
      }
      .el-tree {
        background: transparent;
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
      }
      ::v-deep .el-tree-node {
        // margin-left: -20px;
        font-size: 14px;
        color: #666666;
      }
    }
    .el-container {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
      background: white;
      overflow: hidden;
      .el-header {
        background: transparent;
        margin: 0px 24px;
      }
      .el-main {
        height: calc(100vh - 140px);
        margin: 24px;
        padding: 0;
        // overflow: hidden;
      }
    }
  }
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
      font-size: 15px;
      font-weight: bold;
    }
  }
}
.form-ring { // 新建实体
    margin-top: 5px;
    width: 100%;
    padding: 15px;
    border-style: dashed;
    border-radius: 20px;
    // border:3px solid rgba(201, 201, 201, 0.7);
    border-color: rgba(201, 201, 201, 0.7);
}
.list-row-outside {
  width: calc(50vw);
  height: calc(50vh);
  overflow-y: auto;
  overflow-x: hidden;
  .list-row {
    padding: 10px 0;
    .el-col {
      .el-button:hover {
        background: #d7ebff;
        color: #3D5FFF;
      }
      .el-button:active {
        background: #d7ebff;
      }
      .el-button:focus {
        background: #3D5FFF;
        color: white;
      }
    }
  }
}

.el-popover {
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

/*滚动条样式*/
::-webkit-scrollbar { // 滚动条整体部分，可以设置宽度
  width: 8px;
  height: 8px;
}
/*定义滑块颜色、内阴影及圆角*/
::-webkit-scrollbar-thumb { // 滚动的滑块
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -moz-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -ms-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -o-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(58, 58, 58, 0.1);
}
::-webkit-scrollbar-thumb:hover { // 滚动的滑块
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -moz-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -ms-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -o-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  background: rgba(0,0,0,0.3);
}
/*定义滚动条的轨道颜色、内阴影及圆角*/
::-webkit-scrollbar-track { // 外层轨道
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -moz-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -ms-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  -o-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  border-radius: 8px;
  background: rgba(209, 209, 209, 0.1);
}

::v-deep .el-button--primary.is-plain {
  background: white;
  color: #3D5FFF;
  border-radius: 4px;
}
::v-deep .el-button--success {
  background: white;
  border-radius: 4px;
}

::v-deep .el-button--text {
  color: #3D5FFF;
  // font-size: 19px;
}
::v-deep .el-button--default {
  color: #333333;
  background: #F8F8FA;
  border: 0;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active{
  color: #3d5eff;
  background: white;
  border: 1px solid #3d5eff;
  border-radius: 4px;
}
::v-deep .el-pagination.is-background .el-pager li {
  color: #999999;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}
::v-deep .el-pagination.is-background .btn-prev {
  color: #999999;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}
::v-deep .el-pagination.is-background .btn-prev:disabled {
  background: #f4f4f5;
  border: 0;
}
::v-deep .el-pagination.is-background .btn-next:disabled {
  background: #f4f4f5;
  border: 0;
}
::v-deep .el-pagination.is-background .btn-next {
  color: #999999;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}
::v-deep .el-pagination .el-select .el-input .el-input__inner {
  height: 28px;
}
</style>
