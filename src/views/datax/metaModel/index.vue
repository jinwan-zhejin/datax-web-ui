<template>
  <section class="data-meta-section main-outer">
    <el-row class="common-condition ar mb15" />
    <el-row class="main-inner">
      <el-row>
        <el-form ref="dataMetaForm" :model="dataMetaForm" size="small" class="demo-form-inline" label-width="80px">
          <div class="content">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="数据源: "
                >
                  <el-select
                    v-model="dataMetaForm.dataOrigin"
                    placeholder="请选择数据源"
                    filterable
                    :disabled="!dataOriginList.length"
                    @change="changeDataOriginBase"
                  >
                    <el-option
                      v-for="item in dataOriginList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="数据表: "
                >
                  <el-select
                    v-model="dataMetaForm.dataTable"
                    :disabled="!dataTableList.length"
                    @change="changeDataOriginTable"
                  >
                    <el-option
                      v-for="item in dataTableList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="状态: "
                >
                  <el-select
                    v-model="dataMetaForm.status"
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
              <el-col :span="8">
                <el-form-item
                  label="数据元类型: "
                >
                  <el-select
                    v-model="dataMetaForm.category"
                    placeholder="请选择数据元类型"
                    @change="changeDatatype"
                  >
                    <el-option
                      v-for="item in dataType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-button size="mini" class="grey-btn" @click="addNewMeta">新建</el-button>
              <el-button size="mini" class="grey-btn" :disabled="this.deleteSelection.length<=0" @click="sendAudit">送审</el-button>
              <el-button size="mini" :disabled="this.deleteSelection.length<=0" class="red-btn" @click="deleteList('s',1)">删除</el-button>
              <el-input v-model="dataMetaForm.name" placeholder="请输入数据元名称" style="width: 330px" size="mini" @keyup.enter.native="getData">
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
              <el-button type="danger" size="mini" @click="getData">查询</el-button>
            </el-col>
          </div>
        </el-form>
      </el-row>
      <el-row class="mt15">
        <el-table
          :data="listAction"
          stripe
          style="width: 100%;"
          @selection-change="changeFun"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="数据元名称"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="showDataSource(scope.row)">{{ scope.row.dataElementName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataElementCode"
            label="英文名称"
          />
          <el-table-column
            prop="dataType"
            label="数据类型"
          />
          <el-table-column
            prop="codesetName"
            label="值域"
          />
          <el-table-column
            prop="remark"
            label="描述"
          />
          <el-table-column
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status===0" class="new-tag">草稿</el-tag>
              <el-tag v-if="scope.row.status===1" class="going-tag">待审核</el-tag>
              <el-tag v-if="scope.row.status===2" class="success-tag">已审核</el-tag>
              <el-tag v-if="scope.row.status===3" class="error-tag">变更中</el-tag>
              <el-tag v-if="scope.row.status===4" class="quit-tag">已退回</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="170"
          >
            <template slot-scope="scope">
              <el-tooltip v-if="scope.row.status===0 || scope.row.status===3 || scope.row.status===4" class="item" effect="dark" content="编辑" placement="top">
                <i class="table-icon-menu" @click="editData(scope.row.id)"><svg-icon icon-class="编辑1" /></i>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status===0 || scope.row.status===3 || scope.row.status===4 " class="item" effect="dark" content="删除" placement="top">
                <i class="table-icon-menu" @click="deleteList(scope.row.id,0)"><svg-icon icon-class="删除" /></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="关联关系" placement="top">
                <i class="table-icon-menu" @click="conbinRelation(scope.row.id)"><svg-icon icon-class="g-流程" /></i>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status===1 || scope.row.status===2 || scope.row.status===3" class="item" effect="dark" content="查看历史" placement="top">
                <i class="table-icon-menu" @click="showHistory(scope.row.id)"><svg-icon icon-class="g-历史" /></i>
              </el-tooltip>
              <el-tooltip v-if="scope.row.status===2" class="item" effect="dark" content="变更" placement="top">
                <i class="table-icon-menu" @click="changeStatus(scope.row.id)"><svg-icon icon-class="g-更新" /></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="ar mt15"
          :current-page="currentPage"
          :page-sizes="[10,20,30]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-row>
    </el-row>
    <el-dialog
      width="500px"
      title="变更"
      :visible.sync="addChangeVisible"
      :before-close="closeChangeModal"
      append-to-body
    >
      <el-form ref="addLayerForm" :model="changeForm" :rules="rules" size="small" label-width="80px" label-position="right">
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
        <el-button type="info" size="small" @click="closeChangeModal">取 消</el-button>
        <el-button type="danger" size="small" @click="submitChange('addLayerForm')">确 定</el-button>
      </span>
    </el-dialog>
    <add-update-meta :add-update-visible="AddUpdateVisible" :is-edit-meta="isEditMeta" @AddUpdateVisibleBack="AddUpdateVisibleBack" />
    <set-combin-relation :set-combin-visible="SetCombinVisible" :is-edit-combin="isEditCombin" @SetCombinBack="SetCombinBack" />
    <history-detail :history-visible="HistoryVisible" :history-list="historyList" @HistoryBack="HistoryBack" />
  </section>
</template>

<script>
import AddUpdateMeta from './dataMeta/AddUpdateMeta.vue'
import SetCombinRelation from './dataMeta/SetCombinRealation.vue'
import ElRow from 'element-ui/packages/row/src/row';
import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue';
import HistoryDetail from './dataMeta/HistoryDetail.vue'
export default {
  name: 'DataMeta',
  components: {
    ElButton,
    ElRow,
    AddUpdateMeta, SetCombinRelation,
    HistoryDetail
  },
  data() {
    return {
      rules: {
        changeInfo: [
          { required: true, message: '请填写变更原因', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ]
      },

      total: 0,
      currentPage: 1,
      pageLength: 10,

      HistoryVisible: false,
      addChangeVisible: false, // 变更
      AddUpdateVisible: false,
      SetCombinVisible: false,
      changeForm: {
        id: '',
        changeInfo: ''
      },
      isEditMeta: {
        id: '',
        currTime: new Date().getTime(),
        isHistory: false
      },
      isEditCombin: {
        id: '',
        currTime: new Date().getTime()
      },
      dataMetaForm: {
        dataOrigin: '',
        dataTable: '',
        status: '',
        category: '',
        name: ''
      },
      dataOriginList: [
        { id: '', name: '全部' }
      ],
      dataTableList: [],
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
      ],
      dataType: [
        { value: '', label: '全部', type: 0 },
        { value: 'c', des: '固定长度字符', type: 0 },
        { value: 'c..', des: '最多为xx长度的字符', type: 0 },
        { value: 'a', des: '固定长度字母', type: 0 },
        { value: 'a..', des: '最多为xx长度的字母', type: 0 },
        { value: 'n', des: '固定长度数字', type: 0 },
        { value: 'n..', des: '最多为xx长度的数字', type: 0 },
        { value: 'an', des: '固定长度字母数字组合', type: 0 },
        { value: 'an..', des: '最多为xx长度的字母数字组合', type: 0 },
        { value: 'n..()', des: '输入两个正整数，并用英文字母隔开', type: 0 },
        { value: 'd', des: '按YYYYMMDD显示的日期', type: 'd' },
        { value: 't', des: '按hhmmss显示的时间', type: 1 },
        { value: 'dt', des: '按YYYYMMDD hhmmss显示的日期时间', type: 1 },
        { value: 'b', des: '表示图片，图形等二进制类型', type: 1 }
      ],
      listAction: [],
      deleteSelection: [],
      historyList: {
        id: ''
      }
    }
  },
  mounted: function() {
    this.getData();
    this.getAllDataSource();
  },
  methods: {
    getData() {
      const param = {
        start: (this.currentPage - 1) * 10,
        length: this.pageLength,
        dataSourceId: this.dataMetaForm.dataOrigin,
        tableName: this.dataMetaForm.dataTable,
        status: this.dataMetaForm.status,
        dataElementType: this.dataMetaForm.category,
        dataElementName: this.dataMetaForm.name
      };
      this.$urlApi.dataStandard.dataElementList(param).then((res) => {
        this.listAction = res.data;
        this.total = res.recordsFiltered
      })
    },
    getAllDataSource() { // 获取所有数据源
      this.$urlApi.dataSource.getAllDataSource({ pid: -1 }).then((res) => {
        this.dataOriginList = this.dataOriginList.concat(res.data)
      })
    },
    changeDataOriginBase(val) {
      this.dataMetaForm.dataTable = '';

      if (val === '') {
        this.dataTableList = [];
      } else {
        this.$urlApi.dataSource.getDataTreeById({ pid: -2, id: val }).then((res) => {
          if (res.data.length > 0) {
            this.dataTableList = res.data
          }
        });
      }
      this.getData()
    },
    changeDataOriginTable(val) {
      this.getData()
    },
    changeDataStatus(val) {
      this.getData()
    },
    changeDatatype(val) {
      this.getData()
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
    handleCommand(command) {
      this.$message('click on item ' + command);
    },
    addNewMeta() {
      const tempDate = new Date().getTime();
      this.AddUpdateVisible = true;
      this.isEditMeta.currTime = tempDate;
    },
    sendAudit() { // 送审
      const statusArr = this.deleteSelection.map(item => item.status).join();
      if (statusArr.indexOf('1') !== -1 || statusArr.indexOf('2') !== -1 || statusArr.indexOf('4') !== -1) {
        this.$message({
          type: 'warning',
          message: '只有草稿和变更中的数据元可以送审'
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
        this.$urlApi.dataStandard.sendAudit({ ids: ids }).then((res) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '送审成功'
          });
        });
      }).catch(() => {});
    },
    editData(id) { // 编辑
      const tempDate = new Date().getTime();
      this.AddUpdateVisible = true;
      this.isEditMeta.currTime = tempDate;
      this.isEditMeta.id = id;
    },
    deleteList(id, num) {
      const statusArr = this.deleteSelection.map(item => item.status).join();
      if (statusArr.indexOf('1') !== -1 || statusArr.indexOf('2') !== -1 || statusArr.indexOf('4') !== -1) {
        this.$message({
          type: 'warning',
          message: '只有草稿、变更中及已退回的数据元可以删除！'
        });
        return
      }
      let ids = '';
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
        this.$urlApi.dataStandard.deleteElement({ ids: ids }).then((res) => {
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功'
          });
        });
      }).then(() => {
        setTimeout(() => {
          this.getData();
        }, 500);
      });
    },
    conbinRelation(id) {
      const tempDate = new Date().getTime();
      this.SetCombinVisible = true;
      this.isEditCombin.currTime = tempDate;
      this.isEditCombin.id = id;
    },
    AddUpdateVisibleBack(cb) {
      this.AddUpdateVisible = false;
      this.isEditMeta.id = '';
      this.isEditMeta.isHistory = false;
      this.getData();
    },
    SetCombinBack(cb) {
      this.SetCombinVisible = false;
    },
    closeChangeModal() {
      this.changeForm.changeInfo = '';
      this.addChangeVisible = false
    },
    showHistory(id) {
      this.HistoryVisible = true;
      this.historyList.id = id;
    },
    HistoryBack() {
      this.HistoryVisible = false;
      this.historyList.id = '';
    },
    changeStatus(id) { // 设置变更
      this.addChangeVisible = true;
      this.changeForm.id = id;
    },
    submitChange(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$urlApi.dataStandard.changeDataElement(this.changeForm).then((res) => {
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
    showDataSource(item) { // 查看数据源
      const tempDate = new Date().getTime();
      this.AddUpdateVisible = true;
      this.isEditMeta.currTime = tempDate;
      this.isEditMeta.isHistory = true;
      this.isEditMeta.id = item.id;
    }

  }

}
</script>

<style lang="scss">
    .data-meta-section {
        padding: 108px 15px;
        .content {
            .el-input .el-input__inner {
                width: 100% !important;
            }
            .el-select {
                display: block;
            }
            .el-select .el-input__inner {
                width: 100% !important;
            }
            [class*=el-col-12] {
                float: left;
            }
        }
    }
</style>
