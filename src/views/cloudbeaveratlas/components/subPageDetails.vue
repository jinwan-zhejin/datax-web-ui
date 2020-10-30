<!--
 * @Date: 2020-09-30 17:20:24
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-30 19:05:31
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\subPageDetails.vue
 * @Description: 详情页
-->

<template>
  <div :key="timer">
    <div class="container">
      <!-- 顶部 -->
      <el-row>
        <el-col class="top-bar" :span="2">
          <el-tooltip content="返回" placement="top">
            <div class="left-arrow-btn">
              <i class="el-icon-arrow-left top-arrow" @click="backToResult" />
            </div>
          </el-tooltip>
        </el-col>
        <el-col :span="20">
          <el-tooltip :content="properties.entity.attributes.name.concat(' ( ').concat(properties.entity.typeName).concat(' ) ')" placement="top">
            <span class="top-bar-text">
              {{ properties.entity.attributes.name }}&nbsp;(&nbsp;{{ properties.entity.typeName }}&nbsp;)&nbsp;
            </span>
          </el-tooltip>
        </el-col>
      </el-row>
      <!-- 中部 -->
      <el-row class="center-bar">
        <el-col>
          <!-- {{ properties.entity.classifications }} -->
          <label style="font-size: 16px;">分类：</label>
          <!-- {{properties.entity}} -->
          <span v-for="(classifiy,index) in properties.entity.classifications" :key="index">
            <el-button type="primary" plain size="mini">
              {{ classifiy.typeName }}
            </el-button>
            <!-- <el-tooltip content="删除分类" placement="bottom">
              <el-button type="primary" plain size="mini" icon="el-icon-close" />
            </el-tooltip> -->
          </span>
          <span v-if="!properties.entity.hasOwnProperty('classifications')" style="font-size: 16px;">无</span>
          <!-- <el-tooltip content="添加分类" placement="bottom">
            <el-button type="success" plain size="mini" icon="el-icon-plus" @click="test2" />
          </el-tooltip> -->
        </el-col>
        <!-- <el-col>
          术语：<el-button type="success" plain size="mini" icon="el-icon-plus" @click="test(row)" />
        </el-col> -->
      </el-row>
      <!-- 底部 -->
      <el-row class="bottomBar">
        <el-col>
          <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="属性" name="properties">
              <el-row>
                <el-col>
                  <el-collapse v-model="propertiesCollapseActive[0]">
                    <el-collapse-item name="properties0" style="">
                      <div slot="title">
                        &nbsp;技术属性&nbsp;
                        <el-tooltip :content="techPropShow ?'隐藏空值':'显示空值'">
                          <el-switch v-model="techPropShow" @click.stop.native />
                        </el-tooltip>
                      </div>
                      <el-table :data="techPropShow ? techProp : techPropHasVal" :show-header="false">
                        <el-table-column label="left">
                          <template v-slot:default="{ row }">
                            {{ translater(row.key) }}
                          </template>
                        </el-table-column>
                        <el-table-column label="right">
                          <template v-slot:default="{ row }">
                            <a v-if="row.key === 'tables'" class="aClass" @click="gotoNextDetails(row.value[0])">{{ row.value[0].displayText }}</a>
                            <a v-else-if="row.key === 'instance'" class="aClass" @click="gotoNextDetails(row.value)">{{ row.value.displayText }}</a>
                            <!-- <a v-else-if="row.key === 'databases'" class="aClass" @click="gotoNextDetails(row.value)">{{ row.value.name }}</a> -->
                            <span v-else-if="row.key.toLowerCase().indexOf('time') > -1">{{ row.value | formatDate }}</span>
                            <span v-else>{{ row.value }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
                <el-col>
                  <!-- <el-collapse v-model="propertiesCollapseActive[1]">
                    <el-collapse-item title="用户定义的属性" name="properties1">
                      <el-table :data="custProp" :show-header="false">
                        <el-table-column label="left" prop="key" />
                        <el-table-column label="right" prop="value" />
                      </el-table>
                    </el-collapse-item>
                  </el-collapse> -->
                  <el-collapse v-model="propertiesCollapseActive[2]">
                    <el-collapse-item name="properties2">
                      <div slot="title">
                        &nbsp;标签&nbsp;
                        <!-- <el-button type="primary" plain size="mini" @click.stop.native>编辑</el-button> -->
                      </div>
                      <span v-if="properties.entity.labels.length <= 0">&nbsp;暂无数据</span>
                      <el-tag v-for="(item, index) in properties.entity.labels" :key="index" style="margin: 2px;">{{ item }}</el-tag>
                    </el-collapse-item>
                  </el-collapse>
                  <!-- <el-collapse v-model="propertiesCollapseActive[3]">
                    <el-collapse-item title="业务元数据" name="properties3">
                      Coding...
                    </el-collapse-item>
                  </el-collapse> -->
                </el-col>
              </el-row>
            </el-tab-pane>
            <!-- 待完成 -->
            <!-- <el-tab-pane label="血缘" name="lineage">血缘关系</el-tab-pane> -->
            <el-tab-pane label="关系" name="relationships">
              <el-row style="margin-bottom: 10px;">
                <!-- <el-col :span="8">
                  <el-switch v-model="graphTable" active-text="表格" inactive-text="图表" />
                </el-col> -->
                <el-col :span="8">
                  <el-switch v-if="graphTable" v-model="showEmptyRelationships" active-text="显示空值" inactive-text="不显示空值" />
                </el-col>
              </el-row>
              <el-table v-if="graphTable" :data="relationshipShow" class="tableStyle" :header-cell-style="{background:'#F8F8FA',color:'#333333',fontWeight:'bold'}">
                <el-table-column label="键" prop="key" />
                <el-table-column label="值" prop="value" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="分类" name="classifications">
              <el-select v-model="classificationsValue" style="margin-bottom: 10px;" filterable placeholder="请选择" clearable @change="handleSelectClass">
                <el-option
                  v-for="(item,index) in classificationsOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-table :data="classifications" class="tableStyle" :header-cell-style="{background:'#F8F8FA',color:'#333333',fontWeight:'bold'}">
                <el-table-column label="分类" prop="typeName" sortable />
                <el-table-column label="属性">
                  <template v-slot:default="{ row }">
                    {{ row.hasOwnProperty('attributes') ? '' : 'N/A' }}
                    <el-row v-if="row.hasOwnProperty('attributes')" style="border: 1px solid #dfe6ec">
                      <el-col>
                        <el-col style="border: 1px solid #dfe6ec; padding: 0 5px;" :span="12">属性名</el-col>
                        <el-col style="border: 1px solid #dfe6ec; padding: 0 5px;" :span="12">值</el-col>
                      </el-col>
                      <el-col v-for="(val,key,i) in row.attributes" :key="i">
                        <el-col style="border: 1px solid #dfe6ec; padding: 0 5px;" :span="12">{{ key }}</el-col>
                        <el-col style="border: 1px solid #dfe6ec; padding: 0 5px;" :span="12">{{ val === null ? '-' : val }}</el-col>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot:default="{ row }">
                    <el-tooltip content="删除" placement="bottom">
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" @click="openDeleteClassification(row)" />
                    </el-tooltip>
                    <!-- 待完成 -->
                    <!-- <el-tooltip content="编辑" placement="bottom">
                      <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="test(row)" />
                    </el-tooltip> -->
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-pagination
                background
                :current-page="tagCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="tagSize"
                :total="tagTotal"
                @size-change="handleTagSizeChange"
                @current-change="handleTagCurrentChange"
              /> -->
            </el-tab-pane>
            <el-tab-pane label="审计" name="audits">
              <el-table :data="audits" class="tableStyle" :header-cell-style="{background:'#F8F8FA',color:'#333333',fontWeight:'bold'}">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline>
                      <el-row>
                        <el-col>
                          <el-form-item key="名称" label="名称">
                            <!-- <span>{{ props.row | toObject }}</span> -->
                            <span>{{ transformObject(props.row) | displayName }}</span>
                          </el-form-item>
                          <!-- {{ props.row }} -->
                        </el-col>
                      </el-row>
                      <!-- <el-row>
                        <el-col>
                          <el-form-item>
                            <span>{{ transformObject(props.row) }}</span>
                          </el-form-item>
                        </el-col>
                      </el-row> -->
                      <el-row>
                        <el-col v-if="hasAttributes(transformObject(props.row)[1])">
                          <el-collapse v-model="detailsCollapseActive[0]">
                            <el-collapse-item name="details0">
                              <div slot="title">
                                技术属性
                              </div>
                              <el-table :data="detailsAttributes(transformObject(props.row)[1])" :show-header="false">
                                <el-table-column label="键">
                                  <template v-slot:default="{ row }">
                                    {{ translater(row.key) }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="值" prop="value" />
                              </el-table>
                            </el-collapse-item>
                          </el-collapse>
                        </el-col>
                        <el-col v-if="hasRelationshipAttributes(transformObject(props.row)[1])">
                          <el-collapse v-model="detailsCollapseActive[1]">
                            <el-collapse-item name="details1">
                              <div slot="title">
                                关系属性
                              </div>
                              <el-table :data="detailsRelationshipAttributes(transformObject(props.row)[1])" :show-header="false">
                                <el-table-column label="键">
                                  <template v-slot:default="{ row }">
                                    {{ translater(row.key) }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="值" prop="value" />
                              </el-table>
                            </el-collapse-item>
                          </el-collapse>
                        </el-col>
                        <el-col v-if="hasCustomAttributes(transformObject(props.row)[1])">
                          <el-collapse v-model="detailsCollapseActive[2]">
                            <el-collapse-item name="details2">
                              <div slot="title">
                                自定义属性
                              </div>
                              <el-table :data="detailsCustomAttributes(transformObject(props.row)[1])" :show-header="false">
                                <el-table-column label="键">
                                  <template v-slot:default="{ row }">
                                    {{ translater(row.key) }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="值" prop="value" />
                              </el-table>
                            </el-collapse-item>
                          </el-collapse>
                        </el-col>
                        <el-col v-if="hasTerm(transformObject(props.row)[1])">
                          <el-collapse v-model="detailsCollapseActive[3]">
                            <el-collapse-item name="details3">
                              <div slot="title">
                                属性
                              </div>
                              <el-table :data="detailsTerm(transformObject(props.row)[1])" :show-header="false">
                                <el-table-column label="键">
                                  <template v-slot:default="{ row }">
                                    {{ translater(row.key) }}
                                  </template>
                                </el-table-column>
                                <el-table-column label="值" prop="value" />
                              </el-table>
                            </el-collapse-item>
                          </el-collapse>
                        </el-col>
                      </el-row>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="用户名" prop="user" sortable />
                <el-table-column label="审核时间" sortable>
                  <template v-slot:default="{ row }">
                    {{ row.timestamp | formatDate }}
                  </template>
                </el-table-column>
                <el-table-column label="状态" sortable>
                  <template v-slot:default="{ row }">
                    {{ translaterMaster(row.action) }}
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-pagination
                background
                :current-page="auditsCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="25"
                :total="auditsTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              /> -->
            </el-tab-pane>
            <!-- v-if="properties.entity.typeName.split('_')[properties.entity.typeName.split('_').length-1] === 'table'" -->
            <el-tab-pane v-if="properties.entity.typeName === 'rdbms_table'" label="Schema" name="schema">
              <el-table :data="schemaList">
                <el-table-column label="名称">
                  <template v-slot:default="{ row }">
                    <a class="aClass" @click="gotoNextDetails(row)">{{ row.attributes.name }}</a>
                  </template>
                </el-table-column>
                <el-table-column label="描述" prop="attributes.description" min-width="100" />
                <el-table-column label="所有者" prop="attributes.owner" />
                <el-table-column label="数据类型" prop="attributes.data_type" />
                <el-table-column label="备注" prop="attributes.comment" min-width="100" />
                <el-table-column label="分类" prop="attributes.classification" />
              </el-table>
              <!-- <el-pagination
                background
                :current-page="schemaCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="25"
                :total="schemaTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              /> -->
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="删除分类" :visible.sync="deleteClassificationFlag">
      移除：{{ deleteClass }} 从 {{ deleteTypeName }} ?
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          @click="deleteClassificationFlag = false"
        >取消</el-button>
        <el-button
          v-loading="isLoading"
          type="primary"
          @click="handledeleteClassification"
        >提交</el-button>
      </div>
    </el-dialog>
    <AddClassification :add-classification-show="addClassificationShow" :classification-info="properties.entity" :classification-list="classificationList" @addclassificationclose="addClassificationClose" />
  </div>
</template>

<script>
import AddClassification from './addClassification'
import * as apiatlas from '@/api/datax-metadata-atlas'
import { translater, translaterMaster } from '../utils/dictionary'
export default {
  name: 'SubPageDetails',
  components: {
    AddClassification
  },
  filters: {
    formatDate(val) {
      const date = new Date(val);
      const y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s + ' (CST)';
    },
    displayName(object) {
      switch (object[0]) {
        case 'LABEL_ADD': // 添加Label
          return object[1]['Added labels']
        case 'ENTITY_UPDATE': // 更新实体
          return object[1]['Updated']['typeName']
        case 'TERM_ADD':
          return object[1]['Added term']['name']
        case 'CLASSIFICATION_ADD':
          return object[1]['Added classification']['typeName']
        case 'ENTITY_CREATE':
          return object[1]['Created']['typeName']
        default:
          return 'N/A'
      }
    }
  },
  props: {
    classificationList: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      tabActiveName: 'properties',
      classificationsOptions: [{
        value: '',
        label: '全部'
      }],
      propertiesCollapseActive: ['properties0', 'properties1', 'properties2', 'properties3'],
      classificationsValue: '',
      properties: [], // 保存属性返回值
      techProp: [], // 技术属性Tab
      techPropShow: false, // 技术属性collapse显示空值
      custProp: [], // 自定属性Tab
      audits: [], // 保存审核返回值
      lineage: [], // 保存系谱返回值
      classifications: [], // 表格 分类
      tagTotal: 0, // 分类
      tagCurrent: 1,
      tagSize: 25,
      auditsTotal: 0, // 审计
      auditsCurrent: 1,
      auditsSize: 25,
      schemaTotal: 0, // schema
      schemaCurrent: 1,
      schemaSize: 25,
      relationshipList: [],
      relationshipShow: [],
      graphTable: true, // 表格或图表 false-Graph true-Table
      showEmptyRelationships: false, // 显示空值
      detailsCollapseActive: ['details0', 'details1', 'details2', 'details3'],
      addClassificationShow: false, // 打开添加分类面板
      classificationInfo: {}, // 为该条添加分类（guid，typeName）
      resultGuid: '', // router params传值guid
      timer: '',
      schemaList: [],
      deleteClassificationFlag: false,
      deleteClass: '',
      deleteTypeName: '',
      deleteGuid: '',
      isLoading: false
    }
  },
  computed: {
    // techProp() {
    //   var tempList = []
    //   for (var i in this.properties.entity.attributes) {
    //     tempList.push({
    //       key: i,
    //       value: this.properties.entity.attributes[i]
    //     })
    //   }
    //   return tempList
    // }
    techPropHasVal() {
      return this.techProp.filter(item => item.value !== 'N/A')
    },
    // 处理details
    transformObject() {
      return row => {
        var tempStr = row.details
        switch (row.action) {
          case 'LABEL_ADD': // 添加Label
            for (var i in tempStr.split(': ')) {
              tempStr = tempStr.replace(tempStr.split(': ')[i], this.quotesFormat(tempStr.split(': ')[i]))
            }
            break
          case 'ENTITY_UPDATE': // 更新实体
          case 'TERM_ADD':
          case 'CLASSIFICATION_ADD':
          case 'ENTITY_CREATE':
            tempStr = tempStr.replace(tempStr.split(': ')[0], this.quotesFormat(tempStr.split(': ')[0]))
            break
          default:
            return 'N/A'
        }
        tempStr = this.bracketFormat(tempStr)
        var temp = []
        temp.push(row.action)
        temp.push(JSON.parse(tempStr))
        return temp
      }
    },
    // 展示attributes
    hasAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('attributes')) {
          return true
        }
        return false
      }
    },
    // 展示relationshipAttributes
    hasRelationshipAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('relationshipAttributes')) {
          return true
        }
        return false
      }
    },
    // 展示customAttributes
    hasCustomAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('customAttributes')) {
          return true
        }
        return false
      }
    },
    // 展示term
    hasTerm() {
      return details => {
        if (Object.keys(details)[0].indexOf('term') > -1) {
          return true
        }
        return false
      }
    },
    // details技术属性
    detailsAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('attributes')) {
          var temp = []
          for (var i in details[Object.keys(details)[0]].attributes) {
            temp.push({
              key: i,
              value: details[Object.keys(details)[0]].attributes[i] === null
                ? 'N/A'
                : details[Object.keys(details)[0]].attributes[i]
            })
          }
          return temp
        }
        return []
      }
    },
    // details关系属性
    detailsRelationshipAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('relationshipAttributes')) {
          var temp = []
          for (var i in details[Object.keys(details)[0]].relationshipAttributes) {
            temp.push({
              key: i,
              value: details[Object.keys(details)[0]].relationshipAttributes[i] === null ? 'N/A' : details[Object.keys(details)[0]].relationshipAttributes[i]
            })
          }
          return temp
        }
        return []
      }
    },
    // details自定义属性
    detailsCustomAttributes() {
      return details => {
        if (details[Object.keys(details)[0]].hasOwnProperty('customAttributes')) {
          var temp = []
          for (var i in details[Object.keys(details)[0]].customAttributes) {
            temp.push({
              key: i,
              value: details[Object.keys(details)[0]].customAttributes[i] === null ? 'N/A' : details[Object.keys(details)[0]].customAttributes[i]
            })
          }
          return temp
        }
        return []
      }
    },
    // details属性
    detailsTerm() {
      return details => {
        if (Object.keys(details)[0].indexOf('term') > -1) {
          var temp = []
          for (var i in details[Object.keys(details)[0]]) {
            temp.push({
              key: i,
              value: details[Object.keys(details)[0]][i] === null ? 'N/A' : details[Object.keys(details)[0]][i]
            })
          }
          return temp
        }
        return []
      }
    },
    translater() {
      return str => translater(str)
    },
    translaterMaster(str) {
      return str => translaterMaster(str)
    }
  },
  watch: {
    showEmptyRelationships: {
      handler(newName, oldName) {
        if (this.showEmptyRelationships) {
          this.relationshipShow = this.relationshipList
        } else {
          this.relationshipShow = this.relationshipList.filter(item => item.value !== 'N/A')
        }
      }
    },
    '$route.params': {
      handler(val, oldVal) {
        this.resultGuid = val.guid
        this.init()
        this.tabActiveName = 'properties'
      },
      deep: true
    }
  },
  created() {
    this.resultGuid = this.$route.params.guid
    this.init()
  },
  methods: {
    test(info) {
      console.log(info)
    },
    test2() {
      console.log(this.properties.entity);
      this.addClassificationShow = true
    },
    init() {
      this.getProperties().then(() => {
        // console.log(this.properties);
        this.classificationsOptions = []
        this.techProp = []
        this.custProp = []
        this.relationshipList = []
        if (this.properties.entity.hasOwnProperty('classifications')) {
          for (var i in this.properties.entity.classifications) {
            this.classificationsOptions.push(this.properties.entity.classifications[i])
          }
        }
        for (var j in this.properties.entity.attributes) {
          if (j === 'tables' || j === 'instance') {
            this.techProp.push({
              key: j,
              value: this.properties.entity.relationshipAttributes[j] === null ? 'N/A' : this.properties.entity.relationshipAttributes[j]
            })
            // } else if (j === 'databases') {
            //   this.techProp.push({
            //     key: j,
            //     value: this.properties.referredEntities[this.properties.entity.attributes.databases.guid].attributes === null ? 'N/A' : this.properties.referredEntities[this.properties.entity.attributes.databases.guid].attributes
            //   })
          } else {
            this.techProp.push({
              key: j,
              value: this.properties.entity.attributes[j] === null ? 'N/A' : this.properties.entity.attributes[j]
            })
          }
        }
        for (var f in this.properties.entity.customAttributes) {
          this.custProp.push({
            key: f,
            value: this.properties.entity.customAttributes[f] === null ? 'N/A' : this.properties.entity.customAttributes[f]
          })
        }
        this.classifications = this.classificationsOptions.filter(item => item.value !== '')
        for (var k in this.properties.entity.relationshipAttributes) {
        // console.log(k + this.properties.entity.relationshipAttributes[k].length);
          this.relationshipList.push({
            key: k.concat((this.properties.entity.relationshipAttributes[k].length !== undefined && this.properties.entity.relationshipAttributes[k].length > 0) ? '(' + this.properties.entity.relationshipAttributes[k].length + ')' : ''),
            value: this.properties.entity.relationshipAttributes[k].length === undefined
              ? this.properties.entity.relationshipAttributes[k].displayText
              : this.properties.entity.relationshipAttributes[k].length > 0
                ? this.properties.entity.relationshipAttributes[k][0].displayText
                : 'N/A'
          })
        }
        if (this.showEmptyRelationships) {
          this.relationshipShow = this.relationshipList
        } else {
          this.relationshipShow = this.relationshipList.filter(item => item.value !== 'N/A')
        }
      // console.log(this.relationshipList)
      })
      this.getAudits()
      this.getLineage()
    },
    /**
     * @description: 回到Result页面
     */
    backToResult() {
      this.$router.replace({
        name: 'atlasResult',
        query: this.$route.query
      })
    },
    /**
     * @description: Tab点击处理函数
     * @param {object} tab 组件
     * @param {object} event 事件
     */
    handleTabClick(tab, event) {
      // console.log(tab, event)
    },
    /**
     * @description: 切换到另一张详情
     */
    gotoNextDetails(details) {
      const query = this.$route.query
      this.$router.replace({
        name: 'atlasDetails',
        params: {},
        query: {}
      })
      this.$router.replace({
        name: 'atlasDetails',
        params: {
          guid: details.guid
        },
        query: query
      })
      this.timer = new Date().getTime()
    },
    /**
     * @description: 下拉菜单选择分类
     * @param {String} value 选中的值
     */
    handleSelectClass(value) {
      if (value !== '') {
        // console.log('筛选')
        this.classifications = this.classificationsOptions.filter(item => item.value !== '' && item.value === value)
      } else {
        // console.log('All')
        this.classifications = this.classificationsOptions.filter(item => item.value !== '')
      }
    },
    /**
     * @description: 获取属性
     */
    async getProperties() {
      const res = await apiatlas.getDetailsProperties(this.resultGuid)
      if (res.status === 200 && res.statusText === 'OK') {
        this.properties = res.data
        // console.log(this.properties)
        this.schemaList = []
        for (var i in this.properties.referredEntities) {
          this.schemaList.push(this.properties.referredEntities[i])
        }
      } else {
        this.$message({
          message: '获取详情信息-属性失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 获取审核
     */
    async getAudits() {
      const res = await apiatlas.getDetailsAudits(this.resultGuid)
      if (res.status === 200 && res.statusText === 'OK') {
        this.audits = res.data
        // console.log(this.audits)
      } else {
        this.$message({
          message: '获取详情信息-审核失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 获取系谱
     */
    async getLineage() {
      const res = await apiatlas.getDetailsLineage(this.resultGuid)
      if (res.status === 200 && res.statusText === 'OK') {
        this.lineage = res.data
        // console.log(this.lineage)
      } else {
        this.$message({
          message: '获取详情信息-系谱失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    /**
     * @description: 为两端添加引号
     * @param {string} str 待格式化的字符串
     * @return {string} 格式化的字符串
     */
    quotesFormat(str) {
      return '"' + str + '"'
    },
    /**
     * @description: 为两端添加括号
     * @param {string} str 待格式化的字符串
     * @return {string} 格式化的字符串
     */
    bracketFormat(str) {
      return '{' + str + '}'
    },
    addClassificationClose() {
      this.addClassificationShow = false
    },
    /**
     * @description: 分页
     */
    // handleTagSizeChange(val) {
    //   this.tagSize = val
    //   this.tagCurrent = val
    // },
    // handleTagCurrentChange(val) {
    //   this.tagCurrent = val
    // }
    openDeleteClassification(row) {
      this.deleteClassificationFlag = true
      this.deleteClass = row.typeName
      this.deleteGuid = row.entityGuid
      this.deleteTypeName = this.properties.entity.attributes.name.concat(' ( ').concat(this.properties.entity.typeName).concat(' ) ')
    },
    /**
     * @description: 移除分类
     */
    async handledeleteClassification() {
      this.isLoading = true
      const res = await apiatlas.deleteClassification(
        this.deleteGuid,
        this.deleteClass
      );
      // console.log(res)
      if (res.status === 204) {
        this.deleteClassificationFlag = false;
        this.$message({
          message: '删除分类成功',
          showClose: true,
          type: 'success',
          duration: 4000
        });
        const query = this.$route.query
        const param = this.$route.params
        this.$router.replace({
          name: 'atlasDetails',
          params: {},
          query: {}
        })
        this.$router.replace({
          name: 'atlasDetails',
          params: {
            guid: param
          },
          query: query
        })
        this.timer = new Date().getTime()
        this.isLoading = false
      } else {
        this.$message({
          message: '删除分类失败',
          showClose: true,
          type: 'error',
          duration: 4000
        });
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .top-bar {
    margin: 0 auto 20px auto;
    min-width: 55px;
    font-size: 2.8em;
    line-height: 3.2rem;
    .left-arrow-btn {
      width: 50px;
      height: 50px;
      background: #F8F8FA;
      border-radius: 50%;
      .top-arrow {
        font-weight: bold;
        color: rgb(192, 192, 192);
        cursor: pointer;
      }
      .top-arrow:hover {
        color: rgb(143, 143, 143);
      }
    }
    .left-arrow-btn:hover {
      background: #e9e9e9;
    }
  }
  .top-bar-text {
    font-size: 2.8em;
    line-height: 3.2rem;
    display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /* 溢出用省略号*/
    -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
  }
  .center-bar {
    margin: 0 auto 20px auto;
    .el-col {
      margin-top: 10px;
      margin-bottom: 10px;
      .el-button {
        margin: 0 5px;
      }
    }
  }
  .bottomBar {
    margin: 0 auto 0 auto;
  }
}
.aClass {
  color: #006ad4;
}
.aClass:hover {
  text-decoration:underline;
}
.el-collapse {
  border: 1px solid #EBEEF5;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  ::v-deep .el-collapse-item__header {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    border: 0;
    background: #F8f8FA;
  }
  ::v-deep .el-collapse-item__wrap {
    max-height: 400px;
    overflow-y: hidden;
    border: 0;
    .el-table td {
      background: #F8F8FA;
      border: 0;
    }
  }
  ::v-deep .el-collapse-item__wrap:hover {
    overflow: auto;
  }
  ::v-deep .el-collapse-item__content {
    background: #F8f8FA;
  }
}
.tableStyle {
  width: 100%;
  border: 2px solid #F8f8FA;
  border-radius: 4px;
  margin-bottom: 20px;
  // ::v-deep .el-table__expanded-cell[class*=cell] {
  //   background: #F8f8FA;
  // }
  // ::v-deep .el-table__expanded-cell[class*=cell]:hover {
  //   background: #F8f8FA;
  // }
}

</style>
