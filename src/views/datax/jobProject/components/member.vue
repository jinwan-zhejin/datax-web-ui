<!--
 * @Date: 2020-12-28 17:11:49
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-12-28 18:57:42
 * @FilePath: \datax-web-ui\src\views\datax\jobProject\components\member.vue
 * @Description: 成员管理
-->
<template>
  <el-dialog :visible="show" title="成员管理" @close="$emit('close')">
    <el-row style="margin-bottom: 15px;">
      <el-col style="text-align: right;">
        <el-input v-model="username" style="width: 200px;" placeholder="成员名搜索" clearable>
          <el-button slot="append" icon="el-icon-search" @click="getUserListProject" />
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-plus">添加新成员</el-button>
      </el-col>
    </el-row>
    <el-table :data="projectUsers" :header-cell-style="{ background: '#FAFAFC' }" style="border: 1px solid #dfe6ec; border-radius: 4px;">
      <el-table-column label="id" prop="id" />
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="角色">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.roleName" :key="index">
            {{ index === 0 ? '' : ', ' }}{{ item }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #fe4646;" @click="onDelMember(scope.row)">移除</el-button>
          <!-- <el-divider direction="vertical" /> -->
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
    <el-dialog :visible.sync="memberManage" title="添加成员" append-to-body>
      <el-transfer v-model="value" :data="data"></el-transfer>
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
      // 成员列表
      users: [],
      // 项目成员列表
      projectUsers: [],
      username: '',
      current: 1,
      size: 10,
      total: 0,
      memberManage: true
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
  methods: {
    getUserList() {
      getAllUser().then(response => {
        this.users = response
      })
    },
    getUserListProject() {
      getAllUserProject({
        projectId: this.projectId,
        current: this.current,
        size: this.size,
        username: this.username
      }).then(response => {
        console.log(response);
        this.projectUsers = response.records
        this.total = response.total
      }).catch(error => {
        console.log(error)
        this.projectUsers = []
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
    onDelMember(row) {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
