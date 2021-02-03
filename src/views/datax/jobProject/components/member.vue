<!--
 * @Date: 2020-12-28 17:11:49
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2021-02-02 11:03:26
 * @FilePath: \datax-web-ui\src\views\datax\jobProject\components\member.vue
 * @Description: 成员管理
-->
<template>
  <el-dialog :visible="show" title="成员管理" @close="$emit('close')">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" style="margin-bottom: 15px;">
        <el-input v-model="username" style="width: 100%;" placeholder="成员名搜索" clearable>
          <el-button slot="append" @click="getUserListProject">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" style="margin-bottom: 15px;">
        <el-button :disabled="!usersData" type="primary" icon="el-icon-s-custom" @click="addMember = true">管理成员组成</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="projectUsers"
      :header-cell-style="{ background: '#FAFAFC' }"
      style="border: 1px solid #dfe6ec; border-radius: 4px;"
      height="calc(100vh - 452px)"
    >
      <el-table-column label="id" prop="id" align="center" />
      <el-table-column label="用户名" prop="username" align="center" />
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.roleName" :key="index">
            {{ index === 0 ? '' : ', ' }}{{ item }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 15px; text-align: right;"
      :current-page.sync="current"
      :page-size.sync="size"
      :page-sizes="[10, 20, 30, 40, 50]"
      layout="total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog :visible.sync="addMember" title="管理成员组成" append-to-body width="558px">
      <el-transfer
        v-model="selectedUsers"
        :data="usersData"
        :titles="['可选成员','已选成员']"
        filter-placeholder="请输入成员名"
        filterable
      >
        <el-button slot="left-footer" class="transfer-footer" type="text" @click="handleSelectAll">添加所有成员</el-button>
        <el-button slot="right-footer" class="transfer-footer" type="text" @click="handleClear">清空成员列表</el-button>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="info" plain :disabled="compareTwoArr" @click="reduceList">还 原</el-button>
        <el-button size="small" @click="onCancel">取 消</el-button>
        <el-button v-loading="isLoading" size="small" type="primary" @click="onManageMember">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getAllUser, getAllUserProject } from '@/api/datax-user'
import * as jobProjectApi from '@/api/datax-job-project'

export default {
  name: 'Member',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      /** 所有成员列表,用于穿梭框 */
      usersData: [],
      /** 已选择成员 */
      selectedUsers: [],
      selectedUsersBackup: [],
      /** 项目成员列表 */
      projectUsers: [],
      username: '',
      current: 1,
      size: 10,
      total: 0,
      /** 添加成员 */
      addMember: false,
      /** 移除成员 */
      delMember: false,
      isLoading: false
    }
  },
  computed: {
    compareTwoArr() {
      return this.selectedUsers.every(item => this.selectedUsersBackup.includes(item)) &&
      this.selectedUsers.length === this.selectedUsersBackup.length
    }
  },
  watch: {
    projectId(val) {
      this.getUserListProject()
    }
  },
  created() {
    this.getUserList()
    this.getUserListProject()
  },
  mounted() {
  },
  methods: {
    /**
     * @description: 获取所有成员
     */
    getUserList() {
      getAllUser().then(response => {
        this.usersData = []
        response.forEach((ele, index) => {
          this.usersData.push({
            label: ele.username,
            key: ele.id,
            disabled: false
          })
        })
      })
    },
    /**
     * @description: 获取该项目所包含的成员
     */
    getUserListProject() {
      getAllUserProject({
        projectId: this.projectId,
        current: this.current,
        size: this.size,
        username: this.username
      }).then(response => {
        this.projectUsers = response.records
        this.selectedUsers = []
        this.projectUsers.forEach(ele => {
          this.selectedUsers.push(ele.id)
        })
        this.selectedUsersBackup = this.selectedUsers
        this.total = response.total
      }).catch(error => {
        console.log(error)
        this.projectUsers = []
        this.selectedUsers = []
        this.total = 0
      })
    },
    handleSizeChange(size) {
      this.current = 1
      console.log(`每页 ${this.size} 条`)
      console.log(`当前 ${this.current} `)
      this.getUserListProject()
    },
    handleCurrentChange(page) {
      console.log(`每页 ${this.size} 条`)
      console.log(`当前 ${this.current} `)
      this.getUserListProject()
    },
    /**
     * @description: 管理成员变更
     */
    onManageMember() {
      this.isLoading = true
      jobProjectApi.addUser({
        id: this.projectId,
        userIds: this.selectedUsers
      }).then(response => {
        this.isLoading = false
        this.addMember = false
        this.getUserListProject()
        this.$notify({
          title: '成功',
          message: response,
          type: 'success'
        })
      }).catch(error => {
        console.log(error)
        this.isLoading = false
        this.$notify({
          title: '错误',
          message: '成员变更失败',
          type: 'error'
        })
      })
    },
    onCancel() {
      this.addMember = false
      setTimeout(() => {
        this.reduceList()
      }, 500)
    },
    reduceList() {
      this.selectedUsers = []
      this.projectUsers.forEach(ele => {
        this.selectedUsers.push(ele.id)
      })
    },
    handleClear() {
      this.selectedUsers = []
    },
    handleSelectAll() {
      this.selectedUsers = []
      this.usersData.forEach(ele => {
        this.selectedUsers.push(ele.key)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.el-transfer {
  >>> .el-transfer__buttons {
    width: 117px !important;
    .el-button {
      margin: 5px 0;
    }
  }
}

>>> .el-dialog__footer {
  border-top: 1px solid #f3f3f3;
  padding: 20px;
}

.el-table {
  >>> .gutter {
    background: #fafafc;
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>
