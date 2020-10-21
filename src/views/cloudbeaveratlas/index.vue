<!--
 * @Date: 2020-09-24 10:38:26
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-21 18:28:43
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
                    <el-button v-show="searchByListItem.params.classification === node.label.split(' (')[0]" type="text">
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
                          <el-dropdown-item @click.stop.native="handleNodeClickClassificationsMini(data)">
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
                      v-show="searchByListItem.params.typeName === data.searchParameters.typeName && searchByListItem.params.classification === data.searchParameters.classification"
                      type="text"
                    >
                      <el-dropdown trigger="click" placement="bottom-start" :hide-on-click="true" @click.stop.native>
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.stop.native="">
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
            <el-button style="position: absolute; right: 30px; z-index: 999; font-size: 22px;" type="text" icon="el-icon-s-data" @click="openStatistics" />
          </el-tooltip>
          <Search v-if="['atlasResult','atlasDetails'].indexOf(this.$route.name) > -1" style="margin-top: 20px" :entities="entity.data" @changedetail="changeDetail" @changeresult="changeResult" />
        </el-header>
        <el-main class="right-container">
          <router-view
            :key="timer"
            name="atlas"
            :search-request="searchByListItem"
            :details-request="searchByName"
            :entities="entity.data"
            :classification-list="classifications.data"
            replace
            @changepage="changePage"
            @changedetail="changeDetail"
            @changeresult="changeResult"
            @deletefilteritem="deleteFilterItem"
          />
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :visible.sync="statistics.show" title="统计数据" width="80%">
      <el-button style="position: absolute;right: 55px;top: 15px;" size="mini" plain type="primary" icon="el-icon-refresh-left" @click="getStatistics" />
      <el-collapse v-model="statistics.activeCollapse">
        <el-collapse-item name="entity">
          <div slot="title" class="collapse-title">
            实体 ({{ statistics.entity.count }})
          </div>
          <el-table :data="statistics.entity.table" :default-sort="{prop: 'key'}">
            <el-table-column label="实体类型" prop="key" />
            <el-table-column :label="'有效 (' + statistics.entity.active + ')'">
              <template v-slot:default="{row}">
                <a :class="{'alink-blue':row.active>0}">{{ row.active }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="'已删除 (' + statistics.entity.deleted + ')'">
              <template v-slot:default="{row}">
                <a :class="{'alink-red':row.deleted>0}">{{ row.deleted }}</a>
              </template>
            </el-table-column>
            <el-table-column :label="'Shell (' + statistics.entity.shell + ')'">
              <template v-slot:default="{row}">
                <a :class="{'alink-red':row.shell>0}">{{ row.shell }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="classification">
          <div slot="title" class="collapse-title">
            分类 ({{ statistics.classification.count }})
          </div>
          <el-table :data="statistics.classification.table" :default-sort="{prop: 'key'}">
            <el-table-column label="名称" prop="key" />
            <el-table-column :label="'数量 (' + statistics.classification.count + ')'">
              <template v-slot:default="{row}">
                <a :class="{'alink-blue':row.count>0}">{{ row.count }}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="server">
          <div slot="title" class="collapse-title">
            服务器统计
          </div>
          <el-col>
            <el-table :data="statistics.server.server" :default-sort="{prop: 'key'}">
              <el-table-column label="服务器详细信息" prop="key">
                <template v-slot:default="{row}">
                  {{ translater(row.key) }}
                </template>
              </el-table-column>
              <el-table-column label="" prop="value" />
            </el-table>
          </el-col>
          <el-col>
            <br>
            通知详情
            <el-table>
              <el-table-column label="Kafka主题分区" />
              <el-table-column label="开始偏移" />
              <el-table-column label="当前偏移" />
              <el-table-column label="处理" />
              <el-table-column label="失败" />
              <el-table-column label="最后消息处理时间" />
            </el-table>
          </el-col>
          <el-col>
            <el-table :data="statistics.server.notification.table2" :default-sort="{prop: 'key'}">
              <el-table-column label="期" prop="key" />
              <el-table-column label="计数" prop="count" />
              <el-table-column label="平均时间（毫秒）" prop="avg" />
              <el-table-column label="创建" prop="creates" />
              <el-table-column label="更新" prop="updates" />
              <el-table-column label="删除" prop="deletes" />
              <el-table-column label="失败" prop="failed" />
            </el-table>
          </el-col>
        </el-collapse-item>
        <el-collapse-item name="system">
          <div slot="title" class="collapse-title">
            系统详情
          </div>
          <el-table :data="statistics.system.os" :default-sort="{prop: 'key'}">
            <el-table-column label="OS" prop="key">
              <template v-slot:default="{row}">
                {{ translater(row.key) }}
              </template>
            </el-table-column>
            <el-table-column label="" prop="value" />
          </el-table>
          <el-table :data="statistics.system.runtime" :default-sort="{prop: 'key'}">
            <el-table-column label="运行环境" prop="key">
              <template v-slot:default="{row}">
                {{ translater(row.key) }}
              </template>
            </el-table-column>
            <el-table-column label="" prop="value" />
          </el-table>
          <el-table :data="statistics.system.memory" :default-sort="{prop: 'key'}">
            <el-table-column label="内存" prop="key">
              <template v-slot:default="{row}">
                {{ row.key.indexOf('_')>-1 ? translaterMaster(row.key):translater(row.key) }}
              </template>
            </el-table-column>
            <el-table-column label="">
              <template v-slot:default="{row}">
                <!-- {{ (row.key==='memory_pool_usages'||row.key==='nonHeapMax') ? row.value : computeSize(row.value).concat(' MB') }} -->
                <span v-if="row.key==='nonHeapMax'">{{ row.value }}</span>
                <span v-else-if="row.key==='memory_pool_usages'">
                  <json-viewer :value="row.value" :expand-depth="2" expanded :copyable="false" boxed sort />
                </span>
                <span v-else>{{ computeSize(row.value).concat(' MB') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="statistics.show=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SubPageSearch from './components/subPageSearch'
import SubPageResult from './components/subPageResult'
import SubPageDetails from './components/subPageDetails'
import Search from './components/search'
import * as apiatlas from '@/api/datax-metadata-atlas'
import Router from 'vue-router'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
import { translater, translaterMaster } from './utils/dictionary'

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
      path: '/cloudbeaveratlas/management/details',
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
    Search
  },
  router, // 私有路由
  data() {
    return {
      searchTreeList: '', // 搜索树
      collapseActiveName: [], // collapse展开项
      collapseExistName: ['entity', 'classifications', 'customFilter'],
      createDialogShow: false, // 创建实体dialog显示
      leftLoading: ['entity', 'classifications', 'customFilter'],
      /* 存点选的实体和分类列表项 - 查询atlasResult
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
          query: null,
          typeName: null,
          classification: null,
          termName: null
        },
        businessMetadata: null
      },
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
      // 统计
      statistics: {
        show: false, // dialog显示
        data: {}, // 统计数据
        activeCollapse: ['classification', 'server'],
        entity: {
          count: 0, // 总数
          active: 0, // 有效
          deleted: 0, // 已删除
          shell: 0,
          table: []
        },
        classification: {
          count: 0, // 总数
          table: []
        },
        server: {
          server: [],
          notification: {
            table1: [],
            table2: []
          }
        },
        system: {
          os: [],
          runtime: [],
          memory: []
        }
      }
    }
  },
  computed: {
    computeSize() {
      return rowdata => {
        return (parseInt(rowdata) / 1048576).toFixed(2)
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
    'searchByListItem.params.typeName'(val, oldVal) {
      if (val === null) {
        this.$refs.entity.setCurrentKey(null)
        this.entityHighlight = false
      } else {
        this.$refs.entity.setCurrentKey(val)
        this.entityHighlight = true
      }
    },
    'searchByListItem.params.classification'(val, oldVal) {
      if (val === null) {
        this.$refs.classifications.setCurrentKey(null)
        this.classificationsHighlight = false
      } else {
        this.$refs.classifications.setCurrentKey(val)
        this.classificationsHighlight = true
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
      this.searchByListItem.params.typeName =
        (this.searchByListItem.params.typeName === data.name.split(' (')[0])
          ? null : data.name.split(' (')[0]
      this.searchByListItem.businessMetadata = null
      this.$router.replace({
        name: 'atlasResult'
      })
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickClassifications(data) {
      // console.log(this.classifications.toShow);
      this.searchByListItem.params.classification =
        (this.searchByListItem.params.classification === data.name.split(' (')[0])
          ? null : data.name.split(' (')[0]
      this.searchByListItem.businessMetadata = null
      this.$router.replace({
        name: 'atlasResult'
      })
    },
    handleNodeClickClassificationsMini(data) {
      this.searchByListItem.params.classification = data.name.split(' (')[0]
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.typeName = null
      this.searchByListItem.params.termName = null
      this.$router.replace({
        name: 'atlasResult'
      })
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickBusinessMetadata(data) {
      this.$router.replace({
        name: 'atlasResult'
      })
      this.searchByListItem.params.typeName = null
      this.searchByListItem.params.classification = null
      this.searchByListItem.params.termName = null
      this.searchByListItem.businessMetadata = data
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickGlossaries(data) {
      this.$router.replace({
        name: 'atlasResult'
      })
      this.searchByListItem.businessMetadata = null
      this.searchByListItem.params.termName = data.name.concat('@').concat(data.fathername)
    },
    /**
     * @description: entity el-tree节点点击事件
     */
    handleNodeClickCustomFilter(data) {
      if (this.searchByListItem.params.typeName === data.searchParameters.typeName && this.searchByListItem.params.classification === data.searchParameters.classification) {
        this.searchByListItem.params.typeName = null
        this.searchByListItem.params.classification = null
      } else {
        this.searchByListItem.params.typeName = data.searchParameters.typeName
        this.searchByListItem.params.classification = data.searchParameters.classification
      }
      this.searchByListItem.params.termName = null
      this.searchByListItem.businessMetadata = null
      this.$router.replace({
        name: 'atlasResult'
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
         * @description: 切换子组件组件,不带参数
         * @param {String} routerName 路由Name
         */
    changePage(routerName) {
      if (routerName === 'initSearchByListItem') {
        this.initSearchByListItem()
      // } else if (isNaN(routerName) === false) { // 返回上一页有问题×
      //   this.$router.go(parseInt(routerName))
      } else {
        this.timer = new Date().getTime()
        this.$router.replace({
          name: routerName
        })
      }
    },
    /**
         * @description: 同detail页面切换数据
         * @param {String} param数据(string)
         */
    changeDetail(objectJson) {
      if (JSON.parse(objectJson).hasOwnProperty('guid')) {
        this.searchByName.guid = JSON.parse(objectJson).guid
        this.searchByName.typeName = JSON.parse(objectJson).typeName
      }
      console.log(this.searchByName);
      this.timer = new Date().getTime()
      this.$router.replace({
        name: 'atlasDetails'
      })
    },
    /**
     * @description: 同result页面切换数据
     * @param {String} string：类型？数据（string）
     */
    changeResult(string) {
      switch (string.split('?')[0]) {
        case 'entity':
          this.searchByListItem.params.classification = null
          this.searchByListItem.params.typeName = string.split('?')[1]
          this.searchByListItem.params.termName = null
          this.searchByListItem.businessMetadata = null
          this.searchByListItem.params.query = null
          break
        case 'classification':
          this.searchByListItem.params.classification = string.split('?')[1]
          this.searchByListItem.params.typeName = null
          this.searchByListItem.params.termName = null
          this.searchByListItem.businessMetadata = null
          this.searchByListItem.params.query = null
          break
        case 'query':
          this.searchByListItem.params.classification = null
          this.searchByListItem.params.typeName = null
          this.searchByListItem.params.termName = null
          this.searchByListItem.businessMetadata = null
          this.searchByListItem.params.query = string.split('?')[1]
      }
      this.timer = new Date().getTime()
      this.$router.replace({
        name: 'atlasResult'
      })
    },
    initSearchByListItem() {
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
          query: null,
          typeName: null,
          classification: null,
          termName: null
        },
        businessMetadata: null
      }
    },
    /**
     * @description: 删除指定searchByListItem中的项, 过滤result
     */
    deleteFilterItem(item) {
      this.searchByListItem.params[JSON.parse(item).name] = null
    },
    /**
     * @description: 打开统计数据dialog
     */
    openStatistics() {
      this.statistics.show = true
      this.getStatistics()
    },
    /**
     * @description: 获取统计数据
     */
    async getStatistics() {
      const res = await apiatlas.getItemsNotEmpty()
      if (res.status === 200 && res.statusText === 'OK') {
        this.initStatistics()
        this.statistics.data = res.data.data
        this.statistics.entity.count = this.statistics.data.general.entityCount
        // 处理entity表格
        for (var i in this.statistics.data.entity.entityActive) {
          this.statistics.entity.active += this.statistics.data.entity.entityActive[i]
          this.statistics.entity.table.push({
            key: i,
            active: this.statistics.data.entity.entityActive[i],
            deleted: this.statistics.data.entity.entityDeleted.hasOwnProperty(i) ? this.statistics.data.entity.entityDeleted[i] : 0,
            shell: this.statistics.data.entity.entityShell.hasOwnProperty(i) ? this.statistics.data.entity.entityShell[i] : 0
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.entity.entityDeleted) {
          this.statistics.entity.deleted += this.statistics.data.entity.entityDeleted[i]
          if (!this.statistics.data.entity.entityActive.hasOwnProperty(i)) {
            this.statistics.entity.table.push({
              key: i,
              active: 0,
              deleted: this.statistics.data.entity.entityDeleted[i],
              shell: this.statistics.data.entity.entityShell.hasOwnProperty(i) ? this.statistics.data.entity.entityShell[i] : 0
            })
          }
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.entity.entityShell) {
          this.statistics.entity.shell += this.statistics.data.entity.entityShell[i]
          if (!this.statistics.data.entity.entityActive.hasOwnProperty(i) && !this.statistics.data.entity.entityDeleted.hasOwnProperty(i)) {
            this.statistics.entity.table.push({
              key: i,
              active: 0,
              deleted: 0,
              shell: this.statistics.data.entity.entityShell[i]
            })
          }
        }
        // 处理classification表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.tag.tagEntities) {
          this.statistics.classification.count += this.statistics.data.tag.tagEntities[i]
          this.statistics.classification.table.push({
            key: i,
            count: this.statistics.data.tag.tagEntities[i]
          })
        }
        // 处理server表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.general.stats) {
          if (i.indexOf('Server:') > -1) {
            // Server Details
            this.statistics.server.server.push({
              key: i.replace('Server:', ''),
              value: (i.replace('Server:', '') === 'activeTimeStamp' || i.replace('Server:', '') === 'startTimeStamp') ? this.formatDate(this.statistics.data.general.stats[i]) : this.statistics.data.general.stats[i]
            })
          } else if (i.indexOf('Notification:') > -1) {
            // Notification Details
            if (i.replace('Notification:', '') === 'total') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats['Server:startTimeStamp']).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('Creates')],
                updates: this.statistics.data.general.stats[i.concat('Updates')],
                deletes: this.statistics.data.general.stats[i.concat('Deletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'currentHour') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats[i.concat('StartTime')]).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'currentDay') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')).concat(' (开始于').concat(this.formatDate(this.statistics.data.general.stats[i.concat('StartTime')]).concat(')')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'previousHour') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            } else if (i.replace('Notification:', '') === 'previousDay') {
              this.statistics.server.notification.table2.push({
                key: this.translater(i.replace('Notification:', '')),
                count: this.statistics.data.general.stats[i],
                avg: this.statistics.data.general.stats[i.concat('AvgTime')],
                creates: this.statistics.data.general.stats[i.concat('EntityCreates')],
                updates: this.statistics.data.general.stats[i.concat('EntityUpdates')],
                deletes: this.statistics.data.general.stats[i.concat('EntityDeletes')],
                failed: this.statistics.data.general.stats[i.concat('Failed')]
              })
            }
          }
        }
        this.statistics.server.server.push({
          key: 'collectionTime',
          value: this.formatDate(this.statistics.data.general.collectionTime)
        })
        // 处理system表格
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.os) {
          this.statistics.system.os.push({
            key: i,
            value: this.statistics.data.system.os[i]
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.runtime) {
          this.statistics.system.runtime.push({
            key: i,
            value: this.statistics.data.system.runtime[i]
          })
        }
        // eslint-disable-next-line no-redeclare
        for (var i in this.statistics.data.system.memory) {
          // 大小单位转换
          if (i === 'memory_pool_usages') {
            for (var k in this.statistics.data.system.memory[i]) {
              for (var j in this.statistics.data.system.memory[i][k]) {
                this.statistics.data.system.memory[i][k][j] = (this.statistics.data.system.memory[i][k][j] / 1024 / 1024).toFixed(2).concat(' MB')
              }
            }
          }
          this.statistics.system.memory.push({
            key: i,
            value: this.statistics.data.system.memory[i]
          })
        }
      }
    },
    /**
     * @description: 初始化统计数据
     */
    initStatistics() {
      this.statistics.entity = {
        count: 0, // 总数
        active: 0, // 有效
        deleted: 0, // 已删除
        shell: 0,
        table: []
      }
      this.statistics.classification = {
        count: 0, // 总数
        table: []
      }
      this.statistics.server = {
        server: [],
        notification: {
          table1: [],
          table2: []
        }
      }
      this.statistics.system = {
        os: [],
        runtime: [],
        memory: []
      }
    },
    /**
     * @description: 格式化时间
     */
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      // h = h < 10 ? ('0' + h) : h;
      const ampm = h > 12 ? 'PM' : 'AM'
      h = h > 12 ? (h - 12) : h
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      // let s = date.getSeconds();
      // s = s < 10 ? ('0' + s) : s;
      return y + '/' + MM + '/' + d + ' ' + h + ':' + m + ' ' + ampm + ' (CST)';
    },
    translater(str) {
      return translater(str)
    },
    translaterMaster(str) {
      return translaterMaster(str)
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

.alink-blue {
  color: #3D5FFF;
}
.alink-red {
  color: #b43d1f;
}
.alink:hover,.alink-red:hover {
  text-decoration:underline
}

</style>
