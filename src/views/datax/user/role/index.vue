<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">角色管理</div>
          <el-col class="left-description">
            管理系统角色增、删、改、查，编辑角色权限。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="角色名：">
          <el-input
            v-model="roleName"
            clearable
            size="small"
            placeholder="角色名"
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
        :header-cell-style="{background:'#fafafc'}"
      >
        <!-- height="calc(100vh - 310px)" -->
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="角色名" align="center" prop="roleName" />
        <el-table-column label="角色描述" align="center" prop="remark">
          <!-- <template slot-scope="scope">
            <span>{{ scope }}</span>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleUpdate(row)">
              编辑
            </el-button>
            <span
              v-show="row.status!='deleted'"
              v-if="row.remark !== '管理员'"
              style="
                width: 1px;
                height: 12px;
                margin: 0 5px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <el-button v-if="row.remark !== '管理员'" type="text" @click="showMenu(row)">
              权限
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
            <el-button v-if="row.status!=='deleted'" style="color: #fe4646;" type="text" @click="open(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        style="float: right; margin: 0;"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
      />
    </div>
    <!-- 添加角色 -->
    <el-dialog width="40%" title="角色添加" :visible.sync="dialogAddVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="form.roleName" />
            </el-form-item>
            <el-form-item label="角色备注">
              <el-input v-model="form.remark" />
            </el-form-item>
            <!-- <el-form-item label="角色类型">
              <el-select v-model="form.type" placeholder="请选择角色类型">
                <el-option label="管理员" value="ROLE_ADMIN" />
                <el-option label="普通用户" value="ROLE_USER" />
              </el-select>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogAddVisible = false">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="addRole">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog width="40%" title="角色编辑" :visible.sync="dialogEditVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form :model="editForm" label-width="80px">
            <el-form-item label="角色名称">
              <el-input v-model="editForm.roleName" />
            </el-form-item>
            <el-form-item label="角色备注">
              <el-input v-model="editForm.remark" />
            </el-form-item>
            <!-- <el-form-item label="角色类型">
              <el-select v-model="editForm.type" placeholder="请选择角色类型">
                <el-option label="管理员" value="ROLE_ADMIN" />
                <el-option label="普通用户" value="ROLE_USER" />
              </el-select>
            </el-form-item> -->
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogEditVisible = false">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="editRole">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 菜单赋予 -->
    <el-dialog width="40%" title="菜单权限赋予" :visible.sync="dialogTreeVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            current-node-key
            node-key="menuId"
            default-expand-all
            :props="defaultProps"
            @check-change="handleCheckChange"
            @setCurrentKey="handleNode"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTreeVisible = false">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="menuAss">
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
      list: [],
      listLoading: true,
      total: 0,
      roleName: '',
      listQuery: {
        page: 1,
        limit: 10
      },
      roles: ['ROLE_USER', 'ROLE_ADMIN'],
      dialogPluginVisible: false,
      pluginData: [],
      dialogTreeVisible: false,
      dialogEditVisible: false,
      dialogAddVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      form: {
        roleName: '',
        remark: '',
        menu: ''
      },
      editForm: {
        roleName: '',
        remark: '',
        menu: ''
      },
      editRoleId: '',
      menuList: [],
      rules: {
        roleName: [{ required: true, message: translaterMaster('role is require'), trigger: 'change' }],
        remark: [{ required: false, message: translaterMaster('remark is require'), trigger: 'blur' }]
      },
      treeData: [
        {
          name: '运行报表',
          children: [
            {
              name: '运行报表'
            },
            {
              name: '数据访问量统计'
            }
          ]
        },
        {
          name: '项目管理'
        },
        {
          name: '元数据管理',
          children: [
            {
              name: '元数据管理'
            },
            {
              name: '元数据对比'
            }
          ]
        },
        {
          name: '任务管理',
          children: [
            {
              name: '任务管理'
            }
          ]
        },
        {
          name: '数据开发',
          children: [
            {
              name: '数据开发'
            },
            {
              name: 'DDL构建'
            }
          ]
        },
        {
          name: '数据质量',
          children: [
            {
              name: '质量评估'
            },
            {
              name: '质量监控'
            },
            {
              name: '通用规则'
            },
            {
              name: '个性化规则'
            },
            {
              name: '规则审核'
            },
            {
              name: '规则配置详情'
            },
            {
              name: '文档管理'
            }
          ]
        },
        {
          name: '数据建模'
        },
        {
          name: '数据资产'
        },
        {
          name: '数据探查'
        },
        {
          name: '数据脱敏'
        },
        {
          name: '数据共享',
          children: [
            {
              name: '接口列表'
            },
            {
              name: '接口注册'
            },
            {
              name: '注册审批'
            },
            {
              name: '接口调试'
            }
          ]
        },
        {
          name: '日志管理'
        },
        {
          name: '数据分析'
        },
        {
          name: '执行器管理'
        },
        {
          name: '账户管理',
          children: [
            {
              name: '用户管理'
            },
            {
              name: '角色管理'
            }
          ]
        },
        {
          name: '资源监控'
        },
        {
          name: 'JSON格式化'
        }
      ],
      // defaultProps: {
      //   children: 'children',
      //   label: function(data, node) {
      //     console.log(node)
      //     return data.meta.title
      //   }
      // },
      defaultProps: {
        children: 'children',
        label: 'title'
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
        this.dialogFormVisible = true
      },
      checkedArr: [],
      getArr: [],
      half: [],
      rid: ''
    }
  },
  created() {
    this.fetchData()
    // const arr = this.$store.getters.permission_routes
    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i].meta) {
    //     this.treeData.push(arr[i])
    //   }
    // }
    this.getMenuList()
    console.log(this.treeData, 'tree')
  },
  methods: {
    // 获取权限列表
    getMenuList() {
      role.menuList().then(res => {
        console.log(res, '权限列表')
        this.treeData = res
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取角色列表
    fetchData() {
      this.listLoading = true
      let params = {}
      params = this.listQuery
      params['roleName'] = this.roleName
      role.getList(params).then(res => {
        console.log(res, 'res')
        this.list = res.records
        this.total = res.total
        console.log('list', this.list)
        this.listLoading = false
      })
    },
    // 显示添加对话框
    handleCreate() {
      this.dialogAddVisible = true
    },
    addRole() {
      role.addRole(this.form).then(res => {
        this.dialogAddVisible = false
        this.fetchData()
        this.$message.success(res)
      })
      console.log('添加角色')
    },
    // 显示编辑对话框
    handleUpdate(row) {
      console.log(row)
      this.dialogEditVisible = true
      this.editForm.roleName = row.roleName
      this.editForm.remark = row.remark
      this.editRoleId = row.roleId
    },
    editRole() {
      role.updataRole({
        roleId: this.editRoleId,
        roleName: this.editForm.roleName,
        remark: this.editForm.remark
      }).then(res => {
        this.dialogEditVisible = false
        this.fetchData()
        this.$message.success(res)
      })
      console.log('编辑角色')
    },
    // 显示菜单分配对话框
    showMenu(row) {
      this.dialogTreeVisible = true
      console.log(row.menuIdList)
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(row.menuIdList)
      }, 10)
      console.log(row)
      this.rid = row.roleId
    },
    menuAss() {
      console.log('菜单赋予')
      role.updataRole({
        roleId: this.rid,
        menuIdList: this.getArr
      }).then(res => {
        this.dialogTreeVisible = false
        this.fetchData()
        this.$message.success('权限设置成功')
      })
    },
    handleCheckChange(val, node) {
      this.getArr = this.$refs.tree.getCheckedKeys()
      this.half = this.$refs.tree.getHalfCheckedKeys()
      console.log(this.half)
      console.log(this.getArr)
      console.log(val, '123')
      console.log(node, '123weqw')
    },
    handleNode(key) {
      console.log(key)
    },
    handleDelete(row) {
      role.delRole(row.roleId).then(res => {
        console.log(res, 'res')
        this.fetchData()
        this.$message.success(res)
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
  .el-table {
    >>>th {
      background: #fafafc;
    }
  }
}
</style>
