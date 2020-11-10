<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">执行器管理</div>
          <div class="right">
            <el-button class="filter-item" type="goon" size="small" icon="el-icon-plus" @click="handleCreate">
              创建执行器
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        highlight-current-row
        :header-cell-style="{background:'#fafafc'}"
      >
        <!-- height="calc(100vh - 310px)" -->
        <el-table-column label="排序" width="50" align="center">
          <template slot-scope="scope">{{ scope.row.order }}</template>
        </el-table-column>
        <el-table-column label="名称" width="120" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="分组标识" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.appName }}</template>
        </el-table-column>
        <el-table-column label="注册方式" width="110" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope"> {{ addressTypes.find(t => t.value === scope.row.addressType).label }}</template>
        </el-table-column>
        <el-table-column label="在线机器" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{ scope.row.addressList }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleUpdate(row)">
              编辑
            </el-button>
            <span
              v-show="row.status!='deleted'"
              style="
                width: 1px;
                height: 12px;
                margin: 0 5px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <el-button v-if="row.status!='deleted'" style="color: #fe4646;" type="text" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" style="float: right;" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
    </div>

    <el-dialog :title="translaterMaster(textMap[dialogStatus])" :visible.sync="dialogFormVisible" width="40%">
      <el-row>
        <el-col v-if="dialogStatus !== 'delete'" :span="18" :offset="3">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px">
            <el-form-item label="分组标识" prop="appName">
              <el-input v-model="temp.appName" placeholder="分组标识" />
            </el-form-item>
            <el-form-item label="名称" prop="title">
              <el-input v-model="temp.title" placeholder="请输入执行器名称" />
            </el-form-item>
            <el-form-item label="排序" prop="prop">
              <el-input v-model="temp.order" placeholder="执行器序号" />
            </el-form-item>
            <el-form-item label="注册方式" prop="addressType">
              <el-radio-group v-model="temp.addressType">
                <el-radio :label="0">自动注册</el-radio>
                <el-radio :label="1">手动录入</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="机器地址" prop="addressList">
              <el-input v-model="temp.addressList" :disabled="dialogStatus!=='create'" placeholder="多个以逗号分隔" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-else>
          <el-form>
            <el-form-item>
              <span style="font-size: 16px;">删除该执行器 ？</span>
            </el-form-item>
          </el-form>
          <el-col :span="18" :offset="3" style="margin-top: 5px;">
            <span style="font-size: 16px; color: #999999;">名称：</span>
            <span style="font-size: 16px; color: #333333;">{{ temp.title }}</span>
          </el-col>
          <el-col :span="18" :offset="3" style="margin-top: 5px;">
            <span style="font-size: 16px; color: #999999;">分组标识：</span>
            <span style="font-size: 16px; color: #333333;">{{ temp.appName }}</span>
          </el-col>
          <el-col :span="18" :offset="3" style="margin-top: 5px;">
            <span style="font-size: 16px; color: #999999;">执行器序号：</span>
            <span style="font-size: 16px; color: #333333;">{{ temp.order }}</span>
          </el-col>
          <el-col :span="18" :offset="3" style="margin-top: 5px;">
            <span style="font-size: 16px; color: #999999;">注册方式：</span>
            <span style="font-size: 16px; color: #333333;">{{ temp.addressType === '0' ? '自动注册' : '手动录入' }}</span>
          </el-col>
          <el-col :span="18" :offset="3" style="margin-top: 5px;">
            <span style="font-size: 16px; color: #999999;">机器地址：</span>
            <span style="font-size: 16px; color: #333333;">{{ temp.addressList === null ? 'null' : temp.addressList }}</span>
          </el-col>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="small" @click="dialogStatus==='create'?createData():(dialogStatus==='update'?updateData():deleteData())">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as executor from '@/api/datax-executor'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { translaterMaster } from '@/utils/dictionary'

export default {
  name: 'Executor',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        jobGroup: undefined
      },
      editJsonVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        delete: 'Delete'
      },
      rules: {
        appName: [{ required: true, message: 'appName is required', trigger: 'blur' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        order: [{ required: true, message: 'title is required', trigger: 'blur' }],
        addressType: [{ required: true, message: 'title is required', trigger: 'change' }]
      },
      temp: {
        id: undefined,
        appName: undefined,
        title: undefined,
        order: undefined,
        addressType: undefined,
        addressList: undefined
      },
      addressTypes: [
        { value: 0, label: '自动注册' },
        { value: 1, label: '手动录入' }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      executor.getList().then(response => {
        const { content } = response
        this.list = content
        this.total = content.length
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        appName: undefined,
        title: undefined,
        order: undefined,
        addressType: undefined,
        addressList: undefined
      }
    },
    /**
     * @description: 创建
     */
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * @description: 创建提交
     */
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          executor.created(this.temp).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    /**
     * @description: 编辑
     */
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
     * @description: 编辑提交
     */
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.configJson = this.configJson
          executor.updated(tempData).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    /**
     * @description: 删除
     */
    handleDelete(row) {
      this.resetTemp()
      this.dialogStatus = 'delete'
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
    },
    /**
     * @description: 删除提交
     */
    deleteData() {
      executor.deleted(this.temp.id).then(response => {
        this.fetchData()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
      // const index = this.list.indexOf(row)
    },
    handleFetchPv(id) {
      executor.fetch(id).then(response => {
        this.pluginData = response
        this.dialogPvVisible = true
      })
    },
    /**
     * @description: 引用翻译
     */
    translaterMaster(str) {
      if (str !== undefined) {
        return translaterMaster(str)
      } else {
        return str
      }
    }
  }
}
</script>
<style lang="scss">
.app-container {
  .filter-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .el-card {
      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }
      .right {
        float: right;
        margin-right: 20px;
        .el-input {
          overflow: hidden;
          .el-input__inner {
            float: left;
            width: 200px;
            height: 32px;
            line-height: 32px;
            padding-right: 15px;
          }
          .el-input-group__append {
            float: left;
             width: 60px;
             padding: 0px 15px;
             text-align: center;
             color: #fff;
             background-color: #3d5fff;
          }
        }
      }
    }
  }
  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
  }
}
.el-table {
  >>>th {
    background: #fafafc;
  }
}
</style>
