<!--
 * @Date: 2020-10-26 16:24:24
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-10-30 19:11:20
 * @FilePath: \datax-web-ui\src\views\cloudbeaveratlas\components\subPageTagAttr.vue
 * @Description: 查看编辑页
-->
<template>
  <div :key="timer">
    <div class="container">
      <el-row>
        <el-col class="topBar" :span="2">
          <el-tooltip content="返回" placement="top">
            <i class="el-icon-arrow-left topArrow" @click="backToResult" />
          </el-tooltip>
        </el-col>
        <el-col :span="19">
          <el-tooltip :content="classification" placement="top">
            <span class="topBarText">{{ classification }}</span>
          </el-tooltip>
        </el-col>
        <el-col :span="2" style="line-height: 3.2rem;">
          <span>
            <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="editDescriptionShow=true" />
          </span>
        </el-col>
      </el-row>
      <!-- {{ thisAttribute }} -->
      <el-row class="centerBar">
        <el-col>
          描述： {{ thisAttribute.description }}
        </el-col>
        <el-col v-if="thisAttribute.superTypes.length > 0">
          直接继承的分类：
          <el-button v-for="(item,index) in thisAttribute.superTypes" :key="index" type="success" size="mini" plain @click="gotoRefresh(item)">
            {{ item }}
          </el-button>
        </el-col>
        <el-col v-if="thisAttribute.subTypes.length > 0">
          直接子分类：
          <el-button v-for="(item,index) in thisAttribute.subTypes" :key="index" type="success" size="mini" plain @click="gotoRefresh(item)">
            {{ item }}
          </el-button>
        </el-col>
        <el-col>
          <!-- {{ properties.entity.classifications }} -->
          属性：
          <span v-for="(item,index) in thisAttribute.attributeDefs" :key="index">
            <el-tag type="info" size="medium">{{ item.name }}</el-tag>
          </span>
          <el-button type="success" plain size="mini" icon="el-icon-plus" @click="addAttributeShow=true" />
        </el-col>
      </el-row>
      <el-row class="bottomBar">
        <el-col style="margin-bottom: 10px">
          <el-checkbox v-model="excludeSub">排除子分类</el-checkbox>
          <el-checkbox v-model="showHistorical">显示历史实体</el-checkbox>
        </el-col>
        <el-col>
          <el-table :data="tableData" :header-cell-style="{background:'#F8F8FA',color:'#333333',fontWeight:'bold'}" style="border: 1px solid #f8f8fa;margin-bottom: 20px;">
            <el-table-column label="名称" prop="attributes.name">
              <template v-slot:default="{row}">
                <a :class="[row.status==='DELETED'?'tableItemLinkRed':'tableItemLink']" @click="goToDetails(row)"><i class="el-icon-document" />&nbsp;{{ row.attributes.name }}</a>
                <el-tooltip content="已删除" placement="bottom">
                  <el-tag v-if="row.status==='DELETED'" type="danger" size="mini">
                    <i class="el-icon-delete" />
                  </el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="所有者" prop="attributes.owner" />
            <el-table-column label="描述" min-width="110" prop="attributes.description" />
            <el-table-column label="类型">
              <template v-slot:default="{row}">
                <a class="tableItemLink" @click="gotoResult(row.typeName)">{{ row.typeName }}</a>
              </template>
            </el-table-column>
            <el-table-column label="分类" width="150">
              <template v-slot:default="{ row }">
                <el-button-group v-if="row.classifications.length > 1" style="width: 150px">
                  <el-tooltip :content="row.classifications[0].typeName">
                    <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="gotoResultTag(row.classifications[0].typeName)">{{ row.classifications[0].typeName }}</el-button>
                  </el-tooltip>
                  <el-button v-if="row.status!=='DELETED'" plain size="mini" style="width:12px;" icon="el-icon-close" @click="deleteClassification(row.guid, row.classifications[0].typeName, row.attributes.name)" />
                </el-button-group>
                <el-dropdown v-if="row.classifications.length > 1" trigger="click" placement="bottom-start" :hide-on-click="false" @click.stop.native>
                  <el-button type="success" plain size="mini">
                    <i class="el-icon-more" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div v-for="(classes, index) in row.classifications" :key="index">
                        <el-button-group v-if="index !== 0" style="width: 150px">
                          <el-tooltip :content="classes.typeName">
                            <el-button plain size="mini" style="width:100px;overflow:hidden;text-overflow:ellipsis;" @click="gotoResultTag(classes.typeName)">{{ classes.typeName }}</el-button>
                          </el-tooltip>
                          <el-button v-if="row.status!=='DELETED'" plain size="mini" style="width:12px;" icon="el-icon-close" @click="deleteClassification(classes.entityGuid, classes.typeName, row.attributes.name)" />
                        </el-button-group>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button v-if="row.status!=='DELETED'" type="success" plain size="mini" icon="el-icon-plus" @click="addClassification(row)" />
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            style="position: relative; float: right;"
            background
            :current-page="pageCurrent"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]"
            :page-size="pageSize"
            :total="pageTotal"
            @size-change="handlePageSizeChange"
            @current-change="handlePageCurrentChange"
          />
        </el-col>
      </el-row>
    </div>
    <AddClassification
      :add-classification-show="addClassificationShow"
      :classification-info="classificationInfo"
      :classification-list="classificationList"
      @addclassificationclose="addClassificationClose"
    />
    <el-dialog title="删除分类" :visible.sync="deleteClassificationFlag">
      移除：{{ deleteClass }} 从 {{ deleteTypeName }} ?
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="deleteClassificationFlag = false">取消</el-button>
        <el-button v-loading="isLoading" type="primary" @click="handledeleteClassification">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加属性" :visible.sync="addAttributeShow">
      <el-form ref="dataForm" :model="dataForm">
        <el-form-item>
          <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="addAttribute">添加新属性</el-button>
        </el-form-item>
        <el-form-item
          v-for="(item,index) in dataForm.attributes"
          :key="index"
          :prop="'attributes.' + index + '.name'"
          :rules="[{ required: true, message: '新增属性名不能为空', trigger: 'blur' }]"
        >
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-input v-model="item.name" placeholder="属性名" clearable />
          </el-col>
          <el-col :xs="20" :sm="20" :md="10" :lg="10" :xl="10">
            <el-select v-model="item.typeName" placeholder="类型" clearable>
              <el-option label="string" value="string" />
              <el-option label="boolean" value="boolean" />
              <el-option label="byte" value="byte" />
              <el-option label="short" value="short" />
              <el-option label="int" value="int" />
              <el-option label="float" value="float" />
              <el-option label="double" value="double" />
              <el-option label="date" value="date" />
              <el-option v-for="(attribute,attributeindex) in attributeList" :key="attributeindex" :label="attribute.name" :value="attribute.name" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
            <el-button size="mini" type="danger" icon="el-icon-close" @click="removeAttribute(index)" />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="addAttributeShow = false">取消</el-button>
        <el-button v-loading="isLoading" type="primary" @click="handleAddAttribute('dataForm')">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑分类" :visible.sync="editDescriptionShow">
      <el-form>
        <el-form-item label="名称">
          {{ classification }}
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editDescription" placeholder="描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" plain @click="editDescriptionShow = false">取消</el-button>
        <el-button v-loading="isLoading" type="primary" @click="handleEditDescription('dataForm2')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as apiatlas from '@/api/datax-metadata-atlas'
import AddClassification from './addClassification'

export default {
  name: 'SubPageTagAttr',
  components: {
    AddClassification
  },
  props: {
    tagAttribute: { type: Array, default: () => ([]) },
    classificationList: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      timer: '',
      classification: '', // query 分类名
      excludeSub: false, // 不包含子分类
      showHistorical: false, // 显示历史
      tableData: [], // 表格数据
      pageTotal: 0,
      pageCurrent: 1,
      pageSize: 25,
      addClassificationShow: false,
      deleteGuid: '',
      deleteClass: '',
      deleteTypeName: '',
      deleteClassificationFlag: false,
      classificationInfo: {},
      isLoading: false,
      addAttributeShow: false,
      dataForm: {
        attributes: [] // 添加的属性
      },
      attributeList: [],
      editDescriptionShow: false,
      editDescription: '' // 描述
    }
  },
  computed: {
    thisAttribute() {
      const temp = this.tagAttribute.filter(item => {
        if (item.name === this.classification && this.classification !== '') {
          return true
        }
      })
      return temp[0]
    }
  },
  watch: {
    '$route.params.name'(val) {
      this.timer = new Date().getTime()
      this.getAllType()
      this.classification = this.$route.params.name
      this.getList()
    },
    excludeSub(val) {
      this.getList()
    },
    showHistorical(val) {
      this.getList()
    },
    addAttributeShow(val) {
      if (!val) {
        this.dataForm.attributes = []
      }
    },
    editDescriptionShow(val) {
      this.editDescription = this.thisAttribute.description
    }
  },
  created() {
    this.timer = new Date().getTime()
    this.getAllType()
    this.classification = this.$route.params.name
    this.getList()
  },
  methods: {
    /**
     * @description: 返回结果页
     */
    backToResult() {
      this.$router.replace({
        name: 'atlasResult',
        query: this.$route.query,
        params: {}
      })
    },
    /**
     * @description: 获取列表
     */
    async getList() {
      const res = await apiatlas.getTableByItems({
        classification: this.$route.params.name,
        excludeDeletedEntities: !this.showHistorical,
        includeClassificationAttributes: true,
        includeSubClassifications: !this.excludeSub,
        includeSubTypes: true,
        limit: this.pageSize,
        offset: this.pageSize * (this.pageCurrent - 1),
        termName: null,
        typeName: null
      })
      // console.log(res);
      if (res.status === 200 && res.statusText === 'OK') {
        this.pageTotal = res.data.approximateCount
        this.tableData = res.data.entities
      } else {
        this.$message({
          message: '获取对应记录出错',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 获取所有实体信息并筛选有用信息
     */
    async getAllType() {
      const res = await apiatlas.getListType()
      if (res.status === 200 && res.statusText === 'OK') {
        this.attributeList = res.data.filter(item => item.category === 'ENUM')
        // console.log(this.attributeList);
      } else {
        this.$message({
          message: '获取所有实体信息出错',
          showClose: true,
          type: 'error',
          duration: 4000
        })
      }
    },
    /**
     * @description: 刷新页面
     */
    gotoRefresh(name) {
      this.timer = new Date().getTime()
      this.$router.replace({
        name: 'atlasTagAttr',
        query: this.$route.query,
        params: {
          name
        }
      })
    },
    /**
     * @description: 跳转到结果页面 实体
     */
    gotoResult(typeName) {
      this.$router.replace({
        name: 'atlasResult',
        query: {
          type: typeName
        },
        params: {}
      })
    },
    /**
     * @description: 跳转到结果页面 分类
     */
    gotoResultTag(tagName) {
      this.$router.replace({
        name: 'atlasResult',
        query: {
          tag: tagName
        },
        params: {}
      })
    },
    /**
     * @description: 跳转到详情页面
     */
    goToDetails(row) {
      this.$router.replace({
        name: 'atlasDetails',
        params: {
          guid: row.guid
        },
        query: this.$route.query
      })
    },
    deleteClassification(guid, classification, typeName) {
      this.deleteGuid = guid
      this.deleteClass = classification
      this.deleteTypeName = typeName
      this.deleteClassificationFlag = true
    },
    async handledeleteClassification() {
      this.isLoading = true
      const res = await apiatlas.deleteClassification(this.deleteGuid, this.deleteClass)
      // console.log(res)
      if (res.status === 204) {
        this.deleteClassificationFlag = false
        this.$message({
          message: '删除分类成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.getList()
        this.isLoading = true
      } else {
        this.$message({
          message: '删除分类失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = true
      }
    },
    /**
     * @description: 分页
     */
    handlePageSizeChange(val) {
      this.pageSize = val
      this.pageCurrent = 1
      this.getList()
    },
    handlePageCurrentChange(val) {
      this.pageCurrent = val
      this.getList()
    },
    /**
     * @description: 关闭添加分类
     */
    addClassificationClose() {
      this.addClassificationShow = false
      this.getList()
    },
    /**
     * @description: 打开添加分类面板
     */
    addClassification(row) {
      this.classificationInfo = row
      this.addClassificationShow = true
    },
    /**
     * @description: 添加属性提交
     */
    handleAddAttribute(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          var tempForm = this.thisAttribute
          if (this.dataForm.attributes.length > 0) {
            tempForm.attributeDefs = tempForm.attributeDefs.concat(this.dataForm.attributes)
          }
          this.editNewClassification(tempForm)
        } else {
          return false
        }
      })
    },
    /**
     * @description: 添加属性
     */
    addAttribute() {
      this.dataForm.attributes.push({
        cardinality: 'SINGLE',
        isIndexable: true,
        isOptional: true,
        isUnique: false,
        name: '',
        typeName: 'string',
        valuesMaxCount: 1,
        valuesMinCount: 0
      })
    },
    /**
     * @description: 移除属性
     */
    removeAttribute(index) {
      this.dataForm.attributes.splice(index, 1)
    },
    /**
     * @description: 添加分类属性
     */
    async editNewClassification(data) {
      this.isLoading = true
      const res = await apiatlas.editNewClassification(data)
      if (res.status === 200 && res.statusText === 'OK') {
        this.addAttributeShow = false
        this.editDescriptionShow = false
        this.$message({
          message: '编辑分类成功',
          showClose: true,
          type: 'success',
          duration: 4000
        })
        this.isLoading = false
        this.$router.replace({
          name: 'atlasTagAttr',
          query: this.$route.query,
          params: this.$route.params
        })
      } else {
        this.$message({
          message: '编辑分类失败',
          showClose: true,
          type: 'error',
          duration: 4000
        })
        this.isLoading = false
      }
    },
    /**
     * @description: 编辑描述提交
     */
    handleEditDescription() {
      var tempForm = this.thisAttribute
      tempForm.description = this.editDescription
      // console.log(tempForm);
      this.editNewClassification(tempForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  .topBar {
    margin: 0 auto 20px auto;
    min-width: 65px;
    font-size: 2.8em;
    line-height: 3.2rem;
    .topArrow {
      font-weight: bold;
      color: rgb(192, 192, 192);
      cursor: pointer;
    }
    .topArrow:hover {
      color: rgb(143, 143, 143);
    }
  }
  .topBarText {
    font-size: 2.8em;
    line-height: 3.2rem;
    display: -webkit-box;/*作为弹性伸缩盒子模型显示*/
    -webkit-line-clamp: 1; /*显示的行数；如果要设置2行加...则设置为2*/
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /* 溢出用省略号*/
    -webkit-box-orient: vertical;/*伸缩盒子的子元素排列：从上到下*/
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
.tableItemLink {
  color: #006ad4;
  i {
    font-weight: bold;
  }
}
.tableItemLink:hover {
    text-decoration: underline;
}
.tableItemLinkRed {
  color: #853d13;
  i {
    font-weight: bold;
  }
}
.tableItemLinkRed:hover {
    text-decoration: underline;
}

</style>
