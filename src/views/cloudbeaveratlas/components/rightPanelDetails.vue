<!--
 * @Date: 2020-09-30 17:20:24
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-09 18:52:21
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
            <el-tab-pane label="属性" name="properties">用户管理</el-tab-pane>
            <el-tab-pane label="系谱" name="lineage">用户管理</el-tab-pane>
            <el-tab-pane label="关系" name="relationships">
              <!-- <el-table :data="properties.entity.relationshipAttributes">
                <el-table-column label="键" prop="key" />
                <el-table-column label="值" prop="value" />
              </el-table> -->
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
            <el-tab-pane label="审核" name="audits">
              <el-table :data="audits">
                <el-table-column label="用户名" prop="user" />
                <el-table-column label="审核时间" prop="timestamp" />
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
            <el-tab-pane label="架构" name="schema">
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
      classificationsValue: '',
      properties: '', // 保存属性返回值
      audits: [], // 保存审核返回值
      lineage: [], // 保存系谱返回值
      classifications: [], // 表格 分类
      classificationsTotal: 0,
      classificationsCurrent: 1,
      auditsTotal: 0,
      auditsCurrent: 1,
      schemaTotal: 0,
      schemaCurrent: 1,
      relationshipList: []
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
        this.classifications = this.classificationsOptions.filter(item => item.value !== '')
        // for (var k in this.properties.entity.relationshipAttributes) {
        //   this.relationshipList.push({
        //     key: k,
        //     value: this.properties.entity.relationshipAttributes[k]
        //   })
        // }
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
</style>
