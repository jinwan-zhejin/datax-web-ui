<!--
 * @Date: 2020-09-30 17:20:24
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-10 18:31:40
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\rightPanelDetails.vue
 * @Description: 详情页
-->

<template>
  <div>
    <div class="container">
      <el-row>
        <el-col class="topBar">
          <el-tooltip content="返回" placement="top">
            <i class="el-icon-arrow-left topArrow" @click="backToResult" />
          </el-tooltip>
          <i class="el-icon-document" />
          <span v-if="a">{{ detailsRequest.attributes.name }}（{{ detailsRequest.typeName }}）</span>
        </el-col>
      </el-row>
      <el-row class="centerBar">
        <el-col>
          分类：<el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
        </el-col>
        <el-col>
          术语：<el-button type="primary" plain size="mini" icon="el-icon-plus" @click="test(row)" />
        </el-col>
      </el-row>
      <el-row class="bottomBar">
        <el-col>
          <el-tabs v-model="tabActiveName" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="属性" name="properties">
              <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                  <el-collapse v-model="activeCollapse1">
                    <el-collapse-item title="技术特性" name="collapse1">
                      <el-table :data="techProp" :show-header="false">
                        <el-table-column label="left" prop="key" />
                        <el-table-column label="right" prop="value">
                          <template v-slot:default="{ row }">
                            <a v-if="row.key === 'tables'" class="aClass" @click="gotoNextTable(row.value[0])">{{ row.value[0] }}</a>
                            <a v-else-if="row.key === 'instance'" class="aClass">{{ row.value }}</a>
                            <span v-else>{{ row.value }}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                  <el-collapse v-model="activeCollapse2">
                    <el-collapse-item title="用户定义的属性" name="collapse2">
                      <el-table :data="custProp" :show-header="false">
                        <el-table-column label="left" prop="key" />
                        <el-table-column label="right" prop="value" />
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                  <el-collapse v-model="activeCollapse3">
                    <el-collapse-item title="标签" name="collapse3">
                      <div v-if="properties.entity.labels !== undefined">
                        <el-tag v-for="(item, index) in properties.entity.labels" :key="item + index">{{ item }}</el-tag>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                  <el-collapse v-model="activeCollapse4">
                    <el-collapse-item title="业务元数据" name="collapse4">
                      Coding...
                    </el-collapse-item>
                  </el-collapse>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="血缘" name="lineage">用户管理</el-tab-pane>
            <el-tab-pane label="关系" name="relationships">
              <el-row>
                <el-col :span="12">
                  <el-switch v-model="graphTable" active-text="表格" inactive-text="图表" />
                </el-col>
                <el-col :span="12">
                  <el-switch v-if="graphTable" v-model="showEmptyRelationships" active-text="显示空值" />
                </el-col>
              </el-row>
              <el-table v-if="graphTable" :data="relationshipShow">
                <el-table-column label="键" prop="key" />
                <el-table-column label="值" prop="value" />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="分类" name="classifications">
              <el-select v-model="classificationsValue" filterable placeholder="请选择" clearable @change="handleSelectClass">
                <el-option
                  v-for="item in classificationsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-table :data="classifications">
                <el-table-column label="分类" prop="value" />
                <el-table-column label="属性" prop="">
                  <template v-slot:default="{ row }">
                    NA
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template v-slot:default="{ row }">
                    <el-tooltip content="删除" placement="bottom">
                      <el-button type="primary" plain size="mini" icon="el-icon-delete" @click="test(row)" />
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="bottom">
                      <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="test(row)" />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                :current-page="classificationsCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="25"
                :total="classificationsTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
            <el-tab-pane label="审计" name="audits">
              <el-table :data="audits">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <el-form label-position="left" inline>
                      <el-form-item label="名称">
                        <span>{{ props.row | displayName }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="用户名" prop="user" />
                <el-table-column label="审核时间">
                  <template v-slot:default="{ row }">
                    {{ row.timestamp | formatDate }}
                  </template>
                </el-table-column>
                <el-table-column label="状态" prop="action" />
              </el-table>
              <el-pagination
                background
                :current-page="auditsCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="25"
                :total="auditsTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
            <el-tab-pane label="Schema" name="schema">
              <el-table>
                <el-table-column label="名称" />
                <el-table-column label="描述" />
                <el-table-column label="所有者" />
                <el-table-column label="数据类型" />
                <el-table-column label="评论" />
                <el-table-column label="分类" />
              </el-table>
              <el-pagination
                background
                :current-page="schemaCurrent"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
                :page-size="25"
                :total="schemaTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'
export default {
  name: 'RightPanelDetails',
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
    displayName(row) {
      if (row.action.split('_')[0] === 'LABEL') {
        return row.details.split(': ')[1]
      } else if (row.action.split('_')[0] === 'ENTITY' || row.action.split('_')[0] === 'TERM') {
        const objStart = row.details.indexOf('name') + 'name'.length + 3 // 开始下标
        let objEnd = objStart
        while (objEnd < row.details.length) {
          if (row.details[objEnd] !== '"') {
            objEnd++
          } else {
            break
          }
        }
        const subStr = row.details.substring(objStart, objEnd)
        return subStr
      } else {
        const objStart = row.details.indexOf('typeName') + 'typeName'.length + 3 // 开始下标
        let objEnd = objStart
        while (objEnd < row.details.length) {
          if (row.details[objEnd] !== '"') {
            objEnd++
          } else {
            break
          }
        }
        const subStr = row.details.substring(objStart, objEnd)
        return subStr
      }
    }
  },
  props: {
    detailsRequest: Object
  },
  data() {
    return {
      a: true,
      tabActiveName: 'properties',
      classificationsOptions: [{
        value: '',
        label: '全部'
      }],
      activeCollapse1: 'collapse1',
      activeCollapse2: 'collapse2',
      activeCollapse3: 'collapse3',
      activeCollapse4: 'collapse4',
      classificationsValue: '',
      properties: [], // 保存属性返回值
      techProp: [],
      custProp: [],
      audits: [], // 保存审核返回值
      lineage: [], // 保存系谱返回值
      classifications: [], // 表格 分类
      classificationsTotal: 0,
      classificationsCurrent: 1,
      auditsTotal: 0,
      auditsCurrent: 1,
      schemaTotal: 0,
      schemaCurrent: 1,
      relationshipList: [],
      relationshipShow: [],
      graphTable: true, // 表格或图表 false-Graph true-Table
      showEmptyRelationships: false // 显示空值
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
    }
  },
  created() {
    this.getProperties().then(() => {
      if (this.properties.entity.classifications.length > 0) {
        for (var i in this.properties.entity.classifications) {
          this.classificationsOptions.push({
            value: this.properties.entity.classifications[i].typeName,
            label: this.properties.entity.classifications[i].typeName
          })
        }
        for (var j in this.properties.entity.attributes) {
          this.techProp.push({
            key: j,
            value: this.properties.entity.attributes[j] === null ? 'N/A' : this.properties.entity.attributes[j]
          })
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
      }
    })
    this.getAudits()
    this.getLineage()
  },
  methods: {
    test(info) {
      console.log(info)
    },
    /**
     * @description: 回到表页面
     */
    backToResult() {
      this.$emit('changepage', 'atlasResult')
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
     * @description: 切到另一张表
     */
    gotoNextTable(tableObj) {
      this.$emit('switchpage', 'atlasDetails'.concat('?').concat(JSON.stringify(tableObj)))
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
      const res = await apiatlas.getDetailsProperties(this.detailsRequest.guid)
      // console.log(res)
      if (res.status === 200 && res.statusText === 'OK') {
        this.properties = res.data
        console.log(this.properties)
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
      const res = await apiatlas.getDetailsAudits(this.detailsRequest.guid)
      if (res.status === 200 && res.statusText === 'OK') {
        this.audits = res.data
        console.log(this.audits)
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
      const res = await apiatlas.getDetailsLineage(this.detailsRequest.guid)
      if (res.status === 200 && res.statusText === 'OK') {
        this.lineage = res.data
        console.log(this.lineage)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  .topBar {
    margin: 0 auto 20px auto;
    font-size: 2.8em;
    display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /* 溢出用省略号*/
    -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
    .topArrow {
      font-weight: bold;
      color: rgb(192, 192, 192);
      cursor: pointer;
    }
    .topArrow:hover {
      color: rgb(143, 143, 143);
    }
    i {
      font-weight: bold;
      color: #006ad4;
    }
  }
  .centerBar {
    margin: 0 auto 20px auto;
    .el-col {
      margin-top: 10px;
      margin-bottom: 10px;
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
}
::v-deep .el-collapse-item__header {
  color: #409EFF;
  font-size: 15px;
  flex: 1 0 auto;
  order: -1;
  .collapse-title {
    flex: 1 0 100%;
    order: 1;
  }
}
</style>
