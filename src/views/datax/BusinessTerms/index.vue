<template>
  <section class="business-glossary-section main-outer">
    <el-row class="common-condition ar mb15" />
    <el-row class="main-inner-allSize">
      <el-col class="pt10 care-technical-left">
        <div class="tree-menu">
          <el-input
            v-model="treeName"
            placeholder="请输入名称"
            class="search-input mb10"
            size="small"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </el-input>
          <div class="tree-c mb10">
            <el-tooltip
              class="item"
              effect="dark"
              content="新建目录"
              placement="top"
            >
              <span class="tree-t-set" @click="addNewLayer(-1)"
                ><svg-icon iconClass="文件"
              /></span>
            </el-tooltip>
          </div>
          <div class="tree-b">
            <el-tree
              ref="tree2"
              :data="nodeList"
              empty-text="节点为空"
              default-expand-all
              :highlight-current="true"
              :expand-on-click-node="false"
              :props="defaultProps"
              :render-content="renderContent"
              :filter-node-method="filterNode"
              :indent="9"
              @node-click="nodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col class="pt20 care-technical-right">
        <div class="box-operate pt0">
          <el-form size="small" label-width="100px" label-position="right">
            <el-row>
              <el-col :span="8">
                <el-form-item label="代码集名称：">
                  <el-input
                    v-model="codeSetName"
                    style="float: left"
                    :disabled="true"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编码规则：">
                  <el-input v-model="codeSetRule" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="状态：">
                  <el-select
                    v-model="status"
                    placeholder="请选择数据状态"
                    :disabled="!statusList.length"
                    @change="changeDataStatus"
                  >
                    <el-option
                      v-for="item in statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-button
              size="mini"
              class="grey-btn"
              :disabled="currNodeId === ''"
              @click="addNewMeta({ status: -1 })"
              >新建</el-button
            >
            <el-button
              size="mini"
              class="grey-btn"
              :disabled="this.deleteSelection.length <= 0"
              @click="sendAudit"
              >送审</el-button
            >
            <el-button
              size="mini"
              class="red-btn"
              :disabled="this.deleteSelection.length <= 0"
              @click="deleteList"
              >删除</el-button
            >
          </el-row>
          <el-row class="box-operate-b">
            <el-table
              :data="tableData"
              stripe
              height="100%"
              style="width: 100%;"
              @selection-change="changeFun"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="code" label="代码" align="center" show-overflow-tooltip/>
              <el-table-column
                prop="name"
                label="代码名称"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column label="状态" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == 0" class="new-tag"
                    >草稿</el-tag
                  >
                  <el-tag v-if="scope.row.status == 1" class="going-tag"
                    >待审核</el-tag
                  >
                  <el-tag v-if="scope.row.status == 2" class="success-tag"
                    >已审核</el-tag
                  >
                  <el-tag v-if="scope.row.status == 3" class="error-tag"
                    >变更中</el-tag
                  >
                  <el-tag v-if="scope.row.status == 4" class="quit-tag"
                    >已退回</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                  <el-tooltip
                    v-if="
                      scope.row.status == 0 ||
                        scope.row.status == 3 ||
                        scope.row.status == 4
                    "
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                  >
                    <i class="table-icon-menu" @click="addNewMeta(scope.row)"
                      ><svg-icon icon-class="编辑1"
                    /></i>
                  </el-tooltip>
                  <el-tooltip
                    v-if="
                      scope.row.status == 0 ||
                        scope.row.status == 3 ||
                        scope.row.status == 4
                    "
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <i
                      class="table-icon-menu"
                      @click="deleteList(scope.row.id, 0)"
                      ><svg-icon icon-class="删除"
                    /></i>
                  </el-tooltip>
                  <el-tooltip
                    v-if="scope.row.status == 2"
                    class="item"
                    effect="dark"
                    content="变更"
                    placement="top"
                  >
                    <i
                      class="table-icon-menu"
                      @click="changeStatus(scope.row.id)"
                      ><svg-icon icon-class="g-更新"
                    /></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="ar mt15 floatRight"
              :current-page="currentPage"
              :page-sizes="[10, 20, 30]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      width="500px"
      title="变更"
      :visible.sync="addChangeVisible"
      :before-close="closeChangeModal"
      append-to-body
    >
      <el-form
        ref="addLayerForm"
        :model="changeForm"
        :rules="rules"
        size="small"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="变更原因" prop="changeInfo">
          <el-input
            v-model="changeForm.changeInfo"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" size="small" @click="closeChangeModal"
          >取 消</el-button
        >
        <el-button
          type="danger"
          size="small"
          @click="submitChange('addLayerForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <add-edit-code
      :curr-node-id="currNodeId"
      :add-edit-code-list-visible="AddEditCodeListVisible"
      :is-edit-code-list="isEditCodeList"
      @editCodeListBack="editCodeListBack"
    />
    <add-catalog
      :add-catalog-visible="addCatalogVisible"
      :is-edit-catalog="isEditCatalog"
      @addCatalogBack="addCatalogBack"
    />
    <add-code-set
      :add-code-set-visible="addCodeSetVisible"
      :is-edit-code-set="isEditCodeSet"
      @addCodeSetBack="addCodeSetBack"
    />
  </section>
</template>

<script type="text/jsx">
import AddCatalog from './business/AddCatalog.vue'
import AddCodeSet from './business/AddCodeSet.vue'
import AddEditCode from './business/AddEditCode.vue'
import * as businessTermsApi from '@/api/datax-business-terms'
export default {
  name: 'BusinessGlossary',
  components: {
    AddCatalog, AddCodeSet, AddEditCode
  },
  data() {
    return {
      rules: {
        changeInfo: [
          { required: true, message: '请填写变更原因', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ]
      },
      // 变更
      changeForm: {
        id: '',
        changeInfo: ''
      },
      status: '', // 状态
      treeName: '', // 搜索关键字
      currNodeId: '', // 当前节点id
      codeSetName: '', // 代码集名称
      codeSetRule: '', // 编码规则
      addCatalogVisible: false, // 新建/编辑分层[dialog]
      addCodeSetVisible: false, // 新建代码集[dialog]
      AddEditCodeListVisible: false, // 新增/编辑代码[dialog]
      addChangeVisible: false, // 变更[dialog]
      // 新增编辑代码[object]
      isEditCodeList: {
        currTime: new Date().getTime(),
        id: '', // (id!==null && !isEditCodeList.isHistory)?编辑:新增
        codesetId: ''
      },
      // 新增编辑分层[object]
      isEditCatalog: {
        currTime: new Date().getTime(),
        id: '',
        pid: '',
        isCodeset: '1',
        isEdit: false, // 编辑?true:false
        name: '',
        code: '',
        explanation: ''
      },
      // 新建编辑代码集[object]
      isEditCodeSet: {
        currTime: new Date().getTime(),
        id: '',
        pid: '',
        isCodeset: '0',
        isEdit: false, // 编辑?true:false
        name: '',
        code: ''
      },
      total: 0, // 总项数
      currentPage: 1, // 当前页码
      pageLength: 10, // 每页N项
      deleteSelection: [], // 删除项数组
      tableData: [], // table展示数据
      nodeList: [], // 节点
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children',
        parent: 'parentId'
      },
      // 代码集状态
      statusList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '待审核'
        },
        {
          value: 2,
          label: '已审核'
        },
        {
          value: 3,
          label: '变更中'
        },
        {
          value: 4,
          label: '已退回'
        }
      ]
    }
  },
  watch: {
    treeName(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted: function() {
    this.getLayerMenu()
    // // 测试代码列表
    // for (var i = 0; i < 10; i++) {
    //   this.tableData.push({ code: '00'.concat(i), name: '代码'.concat(i), status: Math.floor(Math.random() * 4) })
    // }
    // // 测试节点树
    // this.nodeList.push({
    //   id: 0,
    //   name: '根节点',
    //   children: [
    //     { id: 1, name: '节点11', parentId: 0 },
    //     { id: 2, name: '节点12', parentId: 0 },
    //     { id: 3, name: '节点13', parentId: 0, children: [
    //       { id: 4, name: '节点131', parentId: 3, children: [
    //         { id: 5, name: '节点1311', parentId: 4 },
    //       ] },
    //     ] }
    //   ],
    //   parentId: -1
    // })
  },
  methods: {
    closeChangeModal() {
      this.changeForm.changeInfo = '';
      this.addChangeVisible = false
    },
    changeStatus(id) { // 设置变更
      this.addChangeVisible = true;
      this.changeForm.id = id;
    },
    submitChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.$urlApi.dataStandard.changeCode(this.changeForm).then((res) => {
          //   this.addChangeVisible = false;
          //   this.closeChangeModal();
          //   this.$message({
          //     message: '操作成功',
          //     type: 'success'
          //   });
          //   this.getData();
          // })
          businessTermsApi.changeCode(this.changeForm).then((res) => {
            this.addChangeVisible = false;
            this.closeChangeModal();
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getData();
          })
        } else {
          return false;
        }
      });
    },
    changeDataStatus(val) {
      this.getData()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取节点目录
    getLayerMenu() {
      // this.$urlApi.dataStandard.getCodeSet().then((res) => {
      //   this.nodeList = res.data
      // })
      businessTermsApi.getCodeSet().then((res) => {
        this.nodeList = res.data
      })
    },
    getData() {
      const param = {
        id: this.currNodeId, // 当前节点id
        status: this.status, // 节点状态码
        start: (this.currentPage - 1) * 10, // 当前页码
        length: this.pageLength // 当前页面显示树
      };
      // this.$urlApi.dataStandard.getCodesFromSet(param).then((res) => {
      //   this.tableData = res.data;
      //   this.total = res.recordsFiltered;
      // })
      businessTermsApi.getCodesFromSet(param).then((res) => {
        this.tableData = res.data;
        this.total = res.recordsFiltered;
      })
    },
    getCodeSetData() {
      // this.$urlApi.dataStandard.getCodeSetById({ 'id': this.currNodeId }).then((res) => {
      //   this.codeSetName = res.data.name;
      //   this.codeSetRule = res.data.codeRule;
      // })
      businessTermsApi.getCodeSetById({ 'id': this.currNodeId }).then((res) => {
        this.codeSetName = res.data.name;
        this.codeSetRule = res.data.codeRule;
      })
    },
    changeFun(val) {
      this.deleteSelection = val
    },
    handleSizeChange(cb) {
      this.pageLength = cb;
      this.getData()
    },
    handleCurrentChange(cb) {
      this.currentPage = cb;
      this.getData()
    },
    addNewMeta(row) {
      if (row.status === 0 || row.status === 3 || row.status === 4) {
        this.isEditCodeList.id = row.id;
        this.isEditCodeList.name = row.name;
        this.isEditCodeList.code = row.code;
        this.isEditCodeList.currTime = new Date().getTime();
        this.AddEditCodeListVisible = true;
      } else if (row.status === -1) {
        this.AddEditCodeListVisible = true;
        this.isEditCodeList.id = null;
      } else {
        this.$message({
          message: '只有草稿、变更中、已退回状态才能修改',
          type: 'warning',
          duration: '1500'
        })
      }
    },
    sendAudit() {
      const statusArr = this.deleteSelection.map(item => item.status).join();
      if (statusArr.indexOf('1') !== -1 || statusArr.indexOf('2') !== -1 || statusArr.indexOf('4') !== -1) {
        this.$message({
          type: 'warning',
          message: '只有草稿和变更中状态下的代码可以送审'
        });
        return
      }
      const ids = this.deleteSelection.map(item => item.id).join();
      this.$confirm('确认要送审吗', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton'
      }).then(() => {
        // this.$urlApi.dataStandard.codeSetsendAudit({ ids: ids }).then((res) => {
        //   this.getData()
        //   this.$message({
        //     type: 'success',
        //     message: '送审成功'
        //   });
        // });
        businessTermsApi.codeSetsendAudit({ ids: ids }).then((res) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '送审成功'
          });
        });
      }).catch(() => {});
    },
    deleteList(id, num) {
      const statusArr = this.deleteSelection.map(item => item.status).join();
      if (statusArr.indexOf('1') !== -1 || statusArr.indexOf('2') !== -1) {
        this.$message({
          type: 'warning',
          message: '只有草稿、变更中及已退回的代码可以删除！'
        });
        return
      }
      let ids;
      if (num === 0) {
        ids = id
      } else {
        ids = this.deleteSelection.map(item => item.id).join();
      }
      this.$confirm('确认要删除吗', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton'
      }).then(() => {
        // this.$urlApi.dataStandard.deleteCodes({ ids: ids }).then((res) => {
        //   this.getData()
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功'
        //   });
        // });
        businessTermsApi.deleteCodes({ ids: ids }).then((res) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        });
      }).catch(() => {});
    },
    renderContent(h, { node, data, store }) {
      const nodeItemContent = // 第二级
                    <span class='nodeItem' title={node.label}>
                      <span>
                        <span class='node-label'><span class='node-icon'><svg-icon iconClass='文件夹'></svg-icon></span>{ node.label }</span>
                        <span class='nodeOptDetail'>
                          <el-tooltip class='item' effect='dark' content='新增下级目录' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.addNewLayer(data, node, h) }><svg-icon iconClass='g-添加'></svg-icon></el-button>
                          </el-tooltip>
                          <el-tooltip class='item' effect='dark' content='新增代码集' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.addNewCodeSet(data, node, h) }><svg-icon iconClass='g-新建'></svg-icon></el-button>
                          </el-tooltip>
                          <el-tooltip class='item' effect='dark' content='编辑' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.editLayer(data, node, h) }><svg-icon iconClass='编辑1'></svg-icon></el-button>
                          </el-tooltip>
                          <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass='删除'></svg-icon></el-button>
                          </el-tooltip>
                        </span>
                      </span>
                    </span>;
      const nodeFieldItem = // 第一级
                    <span class='nodeItem' title={node.label}>
                      <span>
                        <span class='node-label'>{node.label}</span>
                        <span class='nodeOptDetail'>
                          <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass='删除'></svg-icon></el-button>
                          </el-tooltip>
                        </span>
                      </span>
                    </span>;
      const nodeItem = // 第4级
                    <span class='nodeItem' title={node.label}>
                      <span>
                        <span class='node-label'><span class='node-icon'><svg-icon iconClass='文件夹'></svg-icon></span>{ node.label }</span>
                        <span class='nodeOptDetail'>
                          <el-tooltip class='item' effect='dark' content='新增代码集' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.addNewCodeSet(data, node, h) }><svg-icon iconClass='g-新建'></svg-icon></el-button>
                          </el-tooltip>
                          <el-tooltip class='item' effect='dark' content='编辑' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.editLayer(data, node, h) }><svg-icon iconClass='编辑1'></svg-icon></el-button>
                          </el-tooltip>
                          <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                            <el-button type='text' size='mini' on-click={ () => this.deleteLayer(data, node, h) }><svg-icon iconClass='删除'></svg-icon></el-button>
                          </el-tooltip>
                        </span>
                      </span>
                    </span>;
      if (data.isCodeset === '0') {
        return nodeFieldItem;
      } else if (node.level === 4) {
        return nodeItem;
      } else {
        return nodeItemContent;
      }
    },
    nodeClick: function(nodeObj, node, obj) {
      if (nodeObj.isCodeset === '0') {
        this.currNodeId = nodeObj.id;
        this.getCodeSetData();
        this.getData();
      } else {
        this.currNodeId = '';
      }
    },
    addNewCodeSet(data, node, h) {
      this.addCodeSetVisible = true;
      this.isEditCodeSet.id = data.id;
      this.isEditCodeSet.currTime = new Date().getTime();
      this.isEditCodeSet.pid = data.parentId;
      this.isEditCodeSet.isCodeset = data.isCodeset;
      this.isEditCodeSet.isEdit = false
    },
    addNewLayer(data, node, h) {
      this.addCatalogVisible = true;
      this.isEditCatalog.id = data.id;
      this.isEditCatalog.currTime = new Date().getTime();
      this.isEditCatalog.pid = data.parentId;
      this.isEditCatalog.isCodeset = data.isCodeset;
      this.isEditCatalog.isEdit = false
    },
    editLayer(data, node, h) {
      this.addCatalogVisible = true;
      this.isEditCatalog.id = data.id;
      this.isEditCatalog.name = data.name;
      this.isEditCatalog.code = data.code;
      this.isEditCatalog.currTime = new Date().getTime();
      this.isEditCatalog.pid = data.parentId;
      this.isEditCatalog.isCodeset = data.isCodeset;
      this.isEditCatalog.isEdit = true
      this.isEditCatalog.explanation = data.explanation;
    },
    deleteLayer(data, node, h) {
      this.$confirm('确认要删除吗', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton'
      }).then(() => {
        // this.$urlApi.dataStandard.deleteCodeSets({ id: data.id }).then((res) => {
        //   this.$message({
        //     type: 'success',
        //     message: '删除成功'
        //   });
        //   this.getLayerMenu()
        // });
        businessTermsApi.deleteCodeSets({ id: data.id }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getLayerMenu()
        });
      }).catch(() => {});
    },
    addCatalogBack() {
      this.addCatalogVisible = false;
      this.getLayerMenu()
    },
    addCodeSetBack() {
      this.addCodeSetVisible = false
      this.getLayerMenu()
    },
    editCodeListBack() {
      this.AddEditCodeListVisible = false;
      this.getData();
    }
  }
}
</script>

<style lang="scss">
.business-glossary-section {
  padding: 20px;
  .main-inner-allSize {
    display: flex;
    min-width: 0;
    .care-technical-left {
      min-width: 215px;
      width: 25%;
      padding-right: 15px;
      height: 100%;
      .tree-menu {
        height: 100%;
        background: rgba(245, 247, 250, 1);
        padding: 15px 17px;
        box-sizing: border-box;
        .tree-c {
          display: flex;
          justify-content: flex-start;
          .tree-t-set {
            width: 28px;
            height: 26px;
            display: block;
            border-radius: 2px;
            border: 1px solid #e1e5ec;
            margin: 7px 7px 7px 0;
            cursor: pointer;
            background: rgba(240, 241, 244, 1);
            font-size: 14px;
            line-height: 26px;
            text-align: center;
          }
        }
        .tree-b {
          height: -moz-calc(100% - 72px);
          height: -webkit-calc(100% - 72px);
          height: calc(100% - 72px);
          // min-height: 178px;
          overflow: auto;
          .el-tree {
            background: transparent;
            .el-tree-node__content {
              position: relative;
              .nodeItem {
                width: 80%;
                /*     position: relative;*/
                .node-label {
                  display: inline-block;
                  width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  .node-icon {
                    margin-right: 5px;
                    font-size: 14px;
                  }
                }
                .node-label:hover {
                  display: inline-block;
                }
                .nodeOpt {
                  display: none !important;
                  float: right;
                  position: relative;
                  top: -2px;
                  font-size: 14px;
                  font-weight: bold;
                }
                .nodeOptDetail {
                  display: none;
                  position: absolute;
                  right: 0;
                  top: 0px;
                  height: 26px;
                  line-height: 26px;
                  font-size: 14px;
                  background: rgba(51, 55, 67, 0.7);
                  border-radius: 2px;
                  cursor: default;
                  padding: 0 8px;
                  .el-button {
                    color: #ffffff;
                  }
                }
              }
              .nodeItem:hover .nodeOptDetail {
                display: inline-block !important;
                text-align: right;
              }
            }
            .el-tree__empty-block {
              background:transparent;
              // min-height: 178px;
            }
          }
        }
      }
    }
    .care-technical-right {
      flex: 1;
      min-width: 0;
      width: 75%;
      .box-operate {
        height: 100%;
        .box-operate-b {
          // height: -moz-calc(100% - 180px);
          // height: -webkit-calc(100% - 180px);
          // height: calc(100% - 180px);
        }
      }
    }
  }
}
.floatRight {
  position: absolute;
  // right: 15px;
  margin-top: 15px;
}
.table-icon-menu {
  font-size: 16px;
  cursor: pointer;
  margin: 0 3px 0 3px;
}
</style>
