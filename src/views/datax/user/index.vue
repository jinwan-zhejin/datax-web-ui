<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="top-container">
        <span>用户管理</span>
        <span class="search">
          <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" clearable />
          <el-button style="margin: 0 0 0 10px;" type="primary" size="small" icon="el-icon-search" @click="fetchData">
            搜索
          </el-button>
          <el-button
            style="margin: 0 0 0 10px;"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleCreate"
          >
            添加
          </el-button>
          <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
        </span>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
      :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
      height="calc(100vh - 310px)"
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="text" @click="handleUpdate(row)">
            编辑
          </el-button>
          <span style="font-size: 16px; color: #999999;">|</span>
          <el-button v-if="row.status!=='deleted'" style="color: #fe4646;" type="text" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密  码" prop="password">
          <el-input v-model="temp.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" class="filter-item" placeholder="角色类型">
            <el-option v-for="item in roles" :key="item.key" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as user from '@/api/datax-user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'User',
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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        username: undefined
      },
      roles: ['ROLE_USER', 'ROLE_ADMIN'],
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        role: [{ required: true, message: 'role is required', trigger: 'change' }],
        username: [{ required: true, message: 'username is required', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      temp: {
        id: undefined,
        role: '',
        username: '',
        password: '',
        permission: ''
      },
      resetTemp() {
        this.temp = this.$options.data().temp
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      user.getList(this.listQuery).then(response => {
        const { content } = response
        this.total = content.recordsTotal
        this.list = content.data
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          user.createUser(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          user.updateUser(tempData).then(() => {
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
    handleDelete(row) {
      user.deleteUser(row.id).then(response => {
        this.fetchData()
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  margin: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  .top-container {
    height: 64px;
    span {
      line-height: 64px;
      font-size: 24px;
    }
    .search {
      float: right;
    }
  }
  >>>.pagination-container {
    margin-top: 0;
  }
  .el-table {
    border: 1px solid #e9e9e9dd;
    color: #333333;
    border-radius: 2px;
    >>>th {
      background: #fafafc;
    }
  }
}
</style>
