<template>
  <section class="document-manage-section main-outer">
    <el-row class="common-condition ar mb15" />
    <el-row class="main-inner-allSize">
      <el-col class="pt10 care-technical-left">
        <div class="tree-menu">
          <el-input
            v-model="treeName"
            placeholder="请输入目录名称"
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
              <span class="tree-t-set" @click="addNewLayer(-1)">
                <svg-icon icon-class="文件" />
              </span>
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
              @node-click="nodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col class="pt20 care-technical-right">
        <div class="box-operate pt0">
          <el-row>
            <el-button
              size="mini"
              :disabled="currNodeId === ''"
              class="grey-btn"
              @click="upLoad({ id: currNodeId })"
            >新增</el-button>
          </el-row>
          <el-row class="box-operate-b">
            <el-table
              :data="tableData"
              stripe
              style="width: 100%;"
              @selection-change="changeFun"
            >
              <el-table-column
                prop="name"
                label="文件名称"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="type"
                label="文件类型"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="filePath"
                label="文件路径"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column label="操作" align="center" width="220">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="下载"
                    placement="top"
                  >
                    <a
                      :href="downLoadFile + '?id=' + scope.row.id"
                      class="table-icon-menu"
                    >
                      <svg-icon icon-class="下载" />
                    </a>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="更新"
                    placement="top"
                  >
                    <i
                      class="table-icon-menu"
                      @click="upDateFile(scope.row.id)"
                    >
                      <svg-icon icon-class="g-更新" />
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                  >
                    <i
                      class="table-icon-menu"
                      @click="deleteList(scope.row.id)"
                    >
                      <svg-icon icon-class="删除" />
                    </i>
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
      title="上传文件"
      :visible.sync="upLoaddialogVisible"
      width="50%"
      :before-close="handleClose"
      @close="closeModal"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="upLoadUrl"
        :data="{ delimiter: delimiter, id: currId }"
        :before-upload="beforeUpload"
        :on-success="successUpLoad"
        multiple
        accept="doc,docx,pdf"
        :limit="3"
        :auto-upload="false"
        :on-exceed="overLimit"
        :file-list="fileList"
        :on-change="handleChange"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
        >选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >上传到服务器</el-button>
        <!--<el-input style="width: 50px" size="small" v-model="delimiter" class="fr"></el-input>-->

        <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="info"
          size="small"
          @click="upLoaddialogVisible = false"
        >关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="更新文件"
      :visible.sync="upDatedialogVisible"
      width="50%"
      :before-close="handleCloseUpdate"
      @close="closeModalUpdate"
    >
      <el-upload
        ref="upload0"
        class="upload-demo0"
        :action="updateUrl"
        :data="{ id: currListId }"
        :before-upload="beforeUpDateFile"
        :on-success="successUpLoadUpDateFile"
        multiple
        accept="doc,docx,pdf"
        :limit="1"
        :auto-upload="false"
        :on-exceed="overLimitUpDateFile"
        :file-list="fileListUpdate"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
        >选取文件</el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpdate"
        >上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传doc,docx,pdf文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="info"
          size="small"
          @click="upDatedialogVisible = false"
        >关 闭</el-button>
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
  </section>
</template>

<script type="text/jsx">
import AddCatalog from './document/AddCatalog.vue'
import AddEditCode from './document/AddEditCode.vue'
import ElRow from 'element-ui/packages/row/src/row'
import * as documentManageApi from '@/api/datax-document-manage'

export default {
  name: 'BusinessGlossary',
  components: {
    ElRow,
    AddCatalog, AddEditCode
  },
  data() {
    return {
      upLoaddialogVisible: false, // 上传文件
      upDatedialogVisible: false, // 更新文件
      downLoadFile: '',
      upLoadUrl: '',
      fileList: [],
      upNum: 0,

      updateUrl: '',
      fileListUpdate: [],
      currListId: '',

      treeName: '',
      currNodeId: '',
      addCatalogVisible: false, // 新建目录
      AddEditCodeListVisible: false, // 新增修改代码
      isEditCodeList: {
        currTime: new Date().getTime(),
        id: '',
        codesetId: ''
      },
      isEditCatalog: {
        currTime: new Date().getTime(),
        id: '',
        pid: '',
        isCodeset: '1',
        isEdit: false,
        name: '',
        code: ''
      },
      total: 0,
      currentPage: 1,
      pageLength: 10,

      currId: '',
      deleteSelection: [],
      tableData: [],
      nodeList: [],
      delimiter: ',',
      delimiterUpdate: ',',
      defaultProps: {
        id: 'id',
        label: 'name',
        children: 'children',
        parent: 'parentId'
      }
    }
  },
  watch: {
    treeName(val) {
      this.$refs.tree2.filter(val);
    }
  },
  mounted: function() {
    // this.upLoadUrl=this.$urlApi.dataStandard.uploadFile();
    // this.updateUrl=this.$urlApi.dataStandard.updateFile();
    // this.downLoadFile=this.$urlApi.dataStandard.downLoadFile()
    // 获取地址
    this.upLoadUrl = documentManageApi.uploadFile()
    this.updateUrl = documentManageApi.updateFile()
    this.downLoadFile = documentManageApi.downLoadFile()
    this.getLayerMenu()
    // // 测试文件列表
    // for (var i = 0; i < 10; i++) {
    //   this.tableData.push({ name: '文件'.concat(i), type: 'doc', filePath: 'C://123/'.concat(i) })
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
    //     ] },
    //     { id: 6, name: '节点13', parentId: 0, children: [
    //       { id: 7, name: '节点131', parentId: 6, children: [
    //         { id: 8, name: '节点1311', parentId: 7 },
    //       ] },
    //     ] }
    //   ],
    //   parentId: -1
    // })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取菜单
    getLayerMenu() {
      // this.$urlApi.dataStandard.getMenuDocumentContent().then((res)=>{
      //     this.nodeList=res.data
      // })
      documentManageApi.getMenuDocumentContent().then((res) => {
        this.nodeList = res.data
      })
    },
    // 获取表格数据
    getData() {
      const param = {
        id: this.currNodeId, // 当前节点id
        start: (this.currentPage - 1) * 10, // 当前页码
        length: this.pageLength // 页面显示数
      };
      // this.$urlApi.dataStandard.getDocumentFile(param).then((res)=>{
      //     this.tableData=res.data;
      //     this.total=res.recordsFiltered
      // })
      documentManageApi.getDocumentFile(param).then((res) => {
        this.tableData = res.data;
        this.total = res.recordsFiltered
      })
    },
    // 选项发生变化触发
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
    // 删除文件
    deleteList(id) {
      this.$confirm('确认要删除吗', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton'
      }).then(() => {
        // this.$urlApi.dataStandard.deleteDocumentFile({id:id}).then((res)=>{
        //     this.getData()
        //     this.$message({
        //         type: 'success',
        //         message: '删除成功'
        //     });
        // });
        documentManageApi.deleteDocumentFile({ id: id }).then((res) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }).catch(() => { });
    },
    renderContent(h, { node, data, store }) {
      const nodeItemContent = // 第二级
        <span class='nodeItem' title={node.label}>
          <span>
            <span class='node-label'><span class='node-icon'><svg-icon iconClass='文件夹'></svg-icon></span>{node.label}</span>
            <span class='nodeOptDetail'>
              <el-tooltip class='item' effect='dark' content='新增下级目录' placement='top'>
                <el-button type='text' size='mini' on-click={() => this.addNewLayer(data, node, h)}><svg-icon iconClass='g-添加'></svg-icon></el-button>
              </el-tooltip>
              <el-tooltip class='item' effect='dark' content='上传' placement='top'>
                <el-button type='text' size='mini' on-click={() => this.upLoad(data, node, h)}><svg-icon iconClass='上传'></svg-icon></el-button>
              </el-tooltip>
              <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                <el-button type='text' size='mini' on-click={() => this.deleteLayer(data, node, h)}><svg-icon iconClass='删除'></svg-icon></el-button>
              </el-tooltip>
            </span>
          </span>
        </span>;
      const nodeFieldItem = // 第一级
        <span class='nodeItem' title={node.label}>
          <span>
            <span class='node-label'><span class='node-icon'><svg-icon iconClass='文件夹'></svg-icon></span>{node.label}</span>
            <span class='nodeOptDetail'>
              <el-tooltip class='item' effect='dark' content='上传' placement='top'>
                <el-button type='text' size='mini' on-click={() => this.upLoad(data, node, h)}><svg-icon iconClass='上传'></svg-icon></el-button>
              </el-tooltip>
              <el-tooltip class='item' effect='dark' content='删除' placement='top'>
                <el-button type='text' size='mini' on-click={() => this.deleteLayer(data, node, h)}><svg-icon iconClass='删除'></svg-icon></el-button>
              </el-tooltip>
            </span>
          </span>
        </span>;
      if (node.level > 3) {
        return nodeFieldItem;
      } else {
        return nodeItemContent;
      }
    },
    // 节点点击事件
    nodeClick: function(nodeObj, node, obj) {
      this.currNodeId = nodeObj.id;
      this.getData()
    },
    // 新增目录
    addNewLayer(data, node, h) {
      this.addCatalogVisible = true;
      this.isEditCatalog.id = data.id;
      this.isEditCatalog.currTime = new Date().getTime();
      this.isEditCatalog.pid = data.parentId;
      this.isEditCatalog.isCodeset = data.isCodeset;
      this.isEditCatalog.isEdit = false
    },
    // 删除
    deleteLayer(data, node, h) {
      this.$confirm('确认要删除吗', '系统消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'cancelButton',
        confirmButtonClass: 'confirmButton'
      }).then(() => {
        // this.$urlApi.dataStandard.deleteDocumentFolder({id:data.id}).then((res)=>{
        //     this.$message({
        //         type: 'success',
        //         message: '删除成功'
        //     });
        //     this.getLayerMenu()
        // });
        documentManageApi.deleteDocumentFolder({ id: data.id }).then((res) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getLayerMenu()
        })
      }).catch(() => { });
    },
    addCatalogBack() {
      this.addCatalogVisible = false;
      this.getLayerMenu()
    },
    editCodeListBack() {
      this.AddEditCodeListVisible = false;
      this.getData();
    },
    // 点击上传操作
    upLoad(data) {
      this.currId = data.id;
      this.currNodeId = data.id;
      this.upLoaddialogVisible = true
    },
    // 上传前判断文件格式
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'docx';
      const extension1 = testmsg === 'doc';
      const extension2 = testmsg === 'pdf';
      if (!extension && !extension1 && !extension2) {
        this.$message({
          message: '上传文件只能是doc,docx,pdf格式!',
          type: 'warning'
        });
        return false
      } else {
        return true
      }
    },
    // 上传、添加、修改文件
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 文件选择超出限制
    overLimit(files, fileList) {
      this.$message({
        'message': '最多上传3个文件',
        'type': 'warning'
      })
    },
    // 上传成功
    successUpLoad(response, file, fileList) {
      // this.fileList=fileList;
      this.upNum++;
      if (response.code === '506') {
        this.$message({
          message: response.message,
          type: 'error'
        });
        this.fileList = [];
      } else {
        if (this.upNum === this.fileList.length) {
          this.$message({
            message: '上传成功',
            type: 'success'
          });
          this.upLoaddialogVisible = false;
        }
      }
      // this.$refs.upload.clearFiles()
    },
    // 上传面板提交上传
    submitUpload() { // 导入sql
      this.$refs.upload.submit();
    },
    // 关闭dialog前
    handleClose() {
      this.upLoaddialogVisible = false;
      this.fileList = [];
    },
    // 关闭dialog时
    closeModal() {
      this.fileList = [];
      this.upNum = 0;
      this.getData()
    },
    // 更新文件操作
    upDateFile(id) {
      this.upDatedialogVisible = true;
      this.currListId = id;
    },
    // 更新前判断文件格式
    beforeUpDateFile(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'docx';
      const extension1 = testmsg === 'doc';
      const extension2 = testmsg === 'pdf';
      if (!extension && !extension1 && !extension2) {
        this.$message({
          message: '上传文件只能是doc,docx,pdf格式!',
          type: 'warning'
        });
        return false
      } else {
        return true
      }
    },
    // 更新时文件选择限制1个
    overLimitUpDateFile(files, fileList) {
      this.$message({
        'message': '更新时，只能上传与文档名称相同的文档',
        'type': 'warning'
      })
    },
    // 更新成功
    successUpLoadUpDateFile(response, file, fileList) {
      if (response.code === '200') {
        this.fileListUpdate = fileList;
        this.$message({
          message: '上传成功',
          type: 'success'
        });
        this.upDatedialogVisible = false;
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        });
      }
    },
    // 更新面板提交上传
    submitUpdate() { // 导入sql
      // this.$refs.upload0.submit();
      this.$refs['upload0'].submit();
    },
    // 关闭dialog时
    closeModalUpdate() {
      this.fileListUpdate = [];
      this.getData();
    },
    // 关闭dialog前
    handleCloseUpdate() {
      this.upDatedialogVisible = false;
      this.fileListUpdate = [];
      this.getData()
    }
  }
}
</script>

<style lang="scss">
.document-manage-section {
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
          // min-height: 75px;
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
              background: transparent;
              // min-height: 75px;
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
          // height: -moz-calc(100% - 70px);
          // height: -webkit-calc(100% - 70px);
          // height: calc(100% - 70px);
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
