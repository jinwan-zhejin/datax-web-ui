<template>
  <div class="app-container">
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">菜单管理</div>
          <el-col class="left-description">
            管理权限路由。
          </el-col>
        </div>
      </el-card>
    </div>
    <div class="main">
      <el-form class="action-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item>
          <el-button-group>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="showForm">添加</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="showEdit">编辑</el-button>
            <el-button type="primary" size="small" icon="el-icon-delete" @click="confirm">删除</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
      <div class="menu">
        <div class="main-body">
          <div class="left">
            <el-scrollbar>
              <el-tree
                :data="tree"
                highlight-current
                accordion
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span>
                    <el-dropdown trigger="click" placement="right">
                      <el-button type="text" size="mini" icon="el-icon-more" @click.native.stop />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native.stop="">
                          <i class="el-icon-edit" style="color: #3d5eff;" /> 编辑
                        </el-dropdown-item>
                        <el-dropdown-item @click.native.stop="">
                          <el-popconfirm
                            placement="right"
                            title="这是一段内容确定删除吗？"
                          >
                            <span slot="reference">
                              <i class="el-icon-delete" style="color: #fe4646;" /> 删除
                            </span>
                          </el-popconfirm>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </span> -->
              </el-tree>
            </el-scrollbar>
          </div>
          <div class="right">
            <!-- 查看表单 -->
            <el-col style="text-align: center;font-size: 20px; font-weight: 700; margin: 20px 0;">
              <span v-if="isView">查看</span>
              <span v-if="isAdd">添加</span>
              <span v-if="isEdit">编辑</span>
            </el-col>
            <el-col :span="18" :offset="2">
              <el-form
                v-show="isView"
                ref="form"
                disabled
                :model="viewForm"
                :rules="rules"
                label-width="100px"
                class="demo-form"
              >
                <el-form-item label="菜单名称:" prop="name">
                  <el-input v-model="viewForm.name" />
                </el-form-item>
                <el-form-item label="菜单标识:" prop="code">
                  <el-input v-model="viewForm.code" />
                </el-form-item>
                <el-form-item label="菜单地址:" prop="url">
                  <el-input v-model="viewForm.url" />
                </el-form-item>
              </el-form>
              <!-- 添加表单 -->
              <el-form
                v-show="isAdd"
                ref="form"
                :model="form"
                :rules="rules"
                label-width="100px"
                class="demo-form"
              >
                <el-form-item label="菜单名称:" prop="name">
                  <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="菜单标识:" prop="code">
                  <el-input v-model="form.code" />
                </el-form-item>
                <el-form-item label="菜单地址:" prop="url">
                  <el-input v-model="form.url" />
                </el-form-item>
              </el-form>
              <!-- 编辑表单 -->
              <el-form
                v-show="isEdit"
                ref="editForm"
                :model="editForm"
                :rules="rules"
                label-width="100px"
                class="demo-form"
              >
                <el-form-item label="菜单名称:" prop="name">
                  <el-input v-model="editForm.name" />
                </el-form-item>
                <el-form-item label="菜单标识:" prop="code">
                  <el-input v-model="editForm.code" />
                </el-form-item>
                <el-form-item label="菜单地址:" prop="url">
                  <el-input v-model="editForm.url" />
                </el-form-item>
              </el-form>
              <el-col style="text-align: center;">
                <template v-if="isAdd">
                  <el-button type="primary" size="small" @click="addMenu">保存</el-button>
                  <el-button type="primary" size="small" @click="reset('form')">重置</el-button>
                </template>
                <template v-if="isEdit">
                  <el-button type="primary" size="small" @click="editMenu">保存</el-button>
                  <el-button type="primary" size="small" @click="reset('editForm')">重置</el-button>
                </template>
              </el-col>
            </el-col>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as user from '@/api/datax-user';
import * as role from '@/api/datax-role';
import * as menu from '@/api/datax-menu';
import waves from '@/directive/waves'; // waves directive
import { translaterMaster } from '@/utils/dictionary';

export default {
  name: 'Menu',
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      form: {
        name: '',
        code: '',
        remark: '',
        url: ''
      },
      viewForm: {
        name: '',
        code: '',
        remark: '',
        url: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入菜单标识', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入菜单描述', trigger: 'blur' }
        ]
      },
      editForm: {
        name: '',
        code: '',
        remark: '',
        url: ''
      },
      isView: true,
      isAdd: false,
      isEdit: false,
      selectMid: '',
      mids: [],
      selectObj: {}
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    test(info) {
      console.log(info)
    },
    handleNodeClick(data) {
      console.log(data)
      this.selectObj = data
      this.selectMid = data.menuId
      this.mids = []
      this.mids.push(data.menuId)
      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          this.mids.push(data.children[i].menuId)
          if (data.children[i].children) {
            for (let j = 0; j < data.children[i].children.length; j++) {
              this.mids.push(data.children[i].children[i].menuId)
            }
          }
        }
      }
      console.log(this.mids)
      this.editForm.name = data.title
      this.editForm.code = data.name
      this.editForm.url = data.path
      this.viewForm.name = data.title
      this.viewForm.code = data.name
      this.viewForm.url = data.path
    },
    // 获取菜单管理列表
    getMenuList() {
      role.menuList().then(res => {
        console.log(res, '权限列表')
        this.tree = res
      }).catch(err => {
        console.log(err)
      })
    },
    // 显示添加表单
    showForm() {
      this.isAdd = true
      this.isView = false
      this.isEdit = false
    },
    // 显示编辑表单
    showEdit() {
      this.isView = false
      this.isEdit = true
      this.isAdd = false
    },
    // 添加菜单
    async addMenu() {
      if (!this.selectMid) {
        this.selectMid = '0'
      }
      console.log(this.selectObj, 'mid')
      menu.addMenu({
        title: this.form.name,
        name: this.form.code,
        path: this.form.url,
        parentId: this.selectMid
      }).then((res) => {
        console.log(res)
        this.$message.success(res)
        this.form = {}
        this.getMenuList()
      }).catch((err) => {
        console.log(err);
      })
    },
    // 编辑菜单
    async editMenu() {
      menu.addMenu({
        title: this.editForm.name,
        name: this.editForm.code,
        path: this.editForm.url,
        menuId: this.selectObj.menuId
      }).then((res) => {
        console.log(res)
        this.$message.success(res)
        this.editForm = {}
        this.getMenuList()
      }).catch((err) => {
        console.log(err);
        this.$message.err(err)
      })
    },
    // 重置
    reset(formName) {
      this.$refs[formName].resetFields()
      this.form = {}
      this.editForm = {}
    },
    // 删除菜单
    async deleteMenu() {
      menu.delMenu(this.selectObj.menuId).then((res) => {
        console.log(res)
        this.$message.success('删除成功')
        this.getMenuList()
        this.selectObj = ''
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除确认框
    confirm() {
      console.log(this.mids.length)
      if (this.mids.length > 0) {
        this.$alert('确定要删除吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.deleteMenu()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请选中需要删除的菜单',
          type: 'warning'
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;
  .head-container {
    overflow: hidden;
    background-color: #ffffff;
    padding: 0px;
    .el-card {
      box-shadow: inset 0px 5px 10px -8px rgba(0, 0, 0, 0.1);
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
        color: #000000a6;
        margin: 15px 24px;
      }
    }
  }
  .main {
    padding: 24px;
    background-color: #fff;
    overflow: hidden;
    margin: 20px 20px 0 20px;
    .menu {
      width: 100%;
      height: 100%;
      background-color: #fff;
      // padding-bottom: 300px;
      .main-body {
        overflow: hidden;
        height: 100%;
        .left {
          width: 25%;
          float: left;
          padding: 10px;
          border-right: 1px solid #DCDFE6;
          overflow-x: hidden;
          .el-scrollbar {
            height: calc(100vh - 310px);
            >>> .el-scrollbar__wrap {
              overflow-x: hidden;
            }
            .el-tree {
              .custom-tree-node {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding-right: 16px;
              }
            }
          }
        }
        .right {
          width: 75%;
          float: right;
          padding: 10px;
          .el-form {
            text-align: center;
            .el-input {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .el-table {
    >>> th {
      background: #fafafc;
    }
  }
}
</style>
