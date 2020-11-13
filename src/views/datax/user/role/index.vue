<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">角色管理</div>
          <div class="right">
            <el-input v-model="roleName" size="medium" class="filter-item" placeholder="用户名" style="width: 268px;" clearable>
              <el-button slot="append" class="filter-item" style="margin: 0px; padding: 8.5px 0px" type="goon" @click="fetchData">
                搜索
              </el-button>
            </el-input>
            <el-button
              class="filter-item"
              type="goon"
              size="small"
              icon="el-icon-plus"
              @click="handleCreate"
            >
              添加
            </el-button>
            <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
              reviewer
            </el-checkbox> -->
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
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </el-table-column>
        <el-table-column label="角色名" align="center" prop="name" />
        <el-table-column label="角色" align="center" prop="type">
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
              style="
                width: 1px;
                height: 12px;
                margin: 0 5px;
                background: #e6e6e8;
                display: inline-block;
              "
            />
            <el-button type="text" @click="showMenu(row)">
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
            <el-button v-if="row.status!=='deleted'" style="color: #fe4646;" type="text" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        style="float: right;"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="fetchData"
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
            <el-form-item label="角色类型">
              <el-select v-model="form.type" placeholder="请选择角色类型">
                <el-option label="管理员" value="ROLE_ADMIN" />
                <el-option label="普通用户" value="ROLE_USER" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col></el-row>
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
            <el-form-item label="角色类型">
              <el-select v-model="editForm.type" placeholder="请选择角色类型">
                <el-option label="管理员" value="ROLE_ADMIN" />
                <el-option label="普通用户" value="ROLE_USER" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col></el-row>
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
            node-key="name"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
            @node-click="handleClickNode"
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
        current: 1,
        size: 10,
        username: undefined
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
      form: {},
      editForm: {},
      rules: {
        role: [{ required: true, message: translaterMaster('role is require'), trigger: 'change' }],
        username: [{ required: true, message: translaterMaster('username is require'), trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
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
        label: 'name'
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
      }
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
    console.log(this.treeData, 'tree')
  },
  methods: {
    // 获取角色列表
    fetchData() {
      this.listLoading = true
      role.getList(this.roleName).then(res => {
        console.log(res, 'res')
        this.list = res
        console.log('list', this.list)
        this.listLoading = false
      })
    },
    // 显示添加对话框
    handleCreate() {
      this.dialogAddVisible = true
    },
    addRole() {
      role.addRole({
        id: '',
        name: this.form.roleName,
        permission: '',
        type: this.form.type
      }).then(res => {
        console.log(res, 'res')
        if (res.code === 200) {
          this.dialogAddVisible = false
          this.fetchData()
          this.$message.success('添加成功')
        }
      })
      console.log('添加角色')
    },
    // 显示编辑对话框
    handleUpdate(row) {
      console.log(row)
      this.dialogEditVisible = true
      this.editForm.roleName = row.name
      this.editForm.type = row.type
    },
    editRole() {
      role.addRole({
        id: '',
        name: this.editForm.roleName,
        permission: '',
        type: this.editForm.type
      }).then(res => {
        console.log(res, 'res')
        if (res.code === 200) {
          this.dialogEditVisible = false
          this.fetchData()
          this.$message.success('编辑成功')
        }
      })
      console.log('编辑角色')
    },
    // 显示菜单分配对话框
    showMenu() {
      this.dialogTreeVisible = true
      setTimeout(() => {
        this.$refs.tree.setCheckedKeys(['质量评估', '质量监控', '通用规则', '个性化规则', '规则审核', '文档管理'])
      }, 200)
    },
    menuAss() {
      console.log('菜单赋予')
      // console.log(this.$refs.tree.getCheckedKeys())
      this.$refs.tree.setCheckedKeys(['质量评估', '质量监控', '通用规则', '个性化规则', '规则审核', '文档管理'])
    },
    handleClickNode(data) {
      console.log(data, 'data')
    },
    handleDelete(row) {
      role.delRole(row.id).then(res => {
        console.log(res, 'res')
        if (res.code === 200) {
          this.fetchData()
          this.$message.success('删除成功')
        }
      })
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
        .filter-item {
          display: inline-table;
        }
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
  .el-table {
    >>>th {
      background: #fafafc;
    }
  }
}
</style>
