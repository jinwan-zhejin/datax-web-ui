<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">用户管理</div>
          <el-col class="left-description">
            管理系统用户增、删、改、查，编辑用户角色。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="用户名：">
          <el-input
            v-model="listQuery.username"
            clearable
            size="small"
            placeholder="用户名"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="fetchData"
          >搜 索</el-button>
        </el-form-item>
      </el-form>
      <el-form class="action-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
          >添 加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        fit
        highlight-current-row
        :header-cell-style="{background:'#fafafc', color: '#666666'}"
      >
        <!-- height="calc(100vh - 310px)" -->
        <el-table-column label="序号" align="center" width="95">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="角色" align="center">
          <template slot-scope="scope">
            <span v-for="item in scope.row.roleName" :key="item">{{ item }}</br></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-divider direction="vertical" />
            <el-button v-if="row.status!=='deleted'" style="color: #fe4646;" type="text" @click="open(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        style="float: right; margin-top: 0;"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="fetchData"
      />
    </div>

    <el-dialog width="40%" :title="textMap[dialogStatus] +'用户'" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="temp"
            label-position="right"
            label-width="80px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="temp.username" style="width: 100%;" placeholder="用户名" />
            </el-form-item>
            <el-form-item label="密  码" prop="password">
              <el-input v-model="temp.password" type="password" placeholder="请输入密码" />
            </el-form-item>
            <el-form-item label="角色" prop="roleIdList">
              <el-select v-model="temp.roleIdList" multiple class="filter-item" placeholder="角色类型" style="width: 100%;">
                <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
import * as role from '@/api/datax-role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { translaterMaster } from '@/utils/dictionary'

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
        callback(new Error(translaterMaster('The password cannot be less than 6 digits')))
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
        update: '编辑',
        create: '新增'
      },
      rules: {
        username: [{ required: true, message: translaterMaster('username is require'), trigger: 'blur' }],
        password: [{ required: true, message: translaterMaster('password is require'), trigger: 'blur', validator: validatePassword }],
        roleIdList: [{ required: true, message: translaterMaster('role is require'), trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        roleIdList: '',
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
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      role.getList().then((res) => {
        this.roles = res.records
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchData() {
      this.listLoading = true
      user.getList1({
        page: this.listQuery.current,
        limit: this.listQuery.size,
        username: this.listQuery.username
      }).then(res => {
        this.total = res.total
        this.list = res.records
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
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
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
              title: '成功',
              message: '修改成功',
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
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    open(row) {
      this.$confirm('此操作将会删除该角色，是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;

  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;

    .el-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0,0,0,0.1);
      border: 0 !important;
      border-radius: 0;

      .left {
        float: left;
        font-size: 24px;
        font-family: PingFangHK-Medium, PingFangHK;
        font-weight: 500;
        color: #333333;
        margin-left: 24px;
      }

      .left-description {
        float: left;
        font-size: 14px;
        font-family: PingFangHK-Medium, PingFangHK;
        color: #000000A6;
        margin: 15px 24px;
      }
    }
  }
  .main {
    padding: 24px;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;

    .search-bar {
      background: #ffffff;

      >>> .el-form-item__label {
        font-weight: normal;
        font-size: 15px;
        line-height: 42px;
      }
    }
  }

  >>> .el-dialog__footer {
    border-top: 1px solid #f3f3f3;
    padding: 20px;
  }

  .el-table {
    >>>th {
      background: #fafafc;
    }
  }
}
</style>
