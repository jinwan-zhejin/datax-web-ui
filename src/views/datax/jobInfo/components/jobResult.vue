<!--
 * @Date: 2020-12-23 11:29:50
 * @Author: Anybody
 * @LastEditors: Anybody
 * @LastEditTime: 2020-12-23 16:00:51
 * @FilePath: \datax-web-ui\src\views\datax\jobInfo\components\jobResult.vue
 * @Description: 任务运行结果
-->
<template>
  <div>
    <el-row :gutter="48">
      <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
        <el-input v-model="fileName" placeholder="文件名" clearable>
          <template slot="append">.xls</template>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" size="small" icon="el-icon-download" @click="download">导出结果</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="isLoading"
      style="margin: 20px 0;"
      :data="tableData"
      element-loading-text="Loading"
      fit
      height="calc(100vh - 460px)"
      highlight-current-row
      :header-cell-style="{
        background: '#F8F8FA',
        'font-weight': 500,
        color: '#333333'
      }"
    >
      <el-table-column v-for="(item, index) in tableColums" :key="index" align="center" :label="item" min-width="120">
        <template slot-scope="scope">{{ scope.row[item] }}</template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right;"
      background
      layout="total, sizes, prev, pager, next"
      :total="total"
      :current-page.sync="current"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size.sync="size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getTaskResult, exportTaskResult } from '@/api/datax-job-info'

export default {
  name: 'JobResult',
  props: ['id'],
  data() {
    return {
      isLoading: false,
      i: [],
      tableData: [],
      tableColums: [],
      current: 1, // 当前页码
      size: 10, // 当前尺寸
      total: 0, // 当前总数
      fileName: '导出结果'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    /**
     * @description: 获取结果列表
     */
    fetchData() {
      this.isLoading = true
      getTaskResult({
        taskId: this.id,
        current: this.current,
        size: this.size
      }).then(response => {
        if (response.code === 200) {
          console.log(response.content)
          this.tableColums = response.content.colums
          const columnsLength = response.content.colums.length
          this.total = response.content.count
          const data = response.content.data
          const temp = []
          if (data) {
            data.forEach(ele => {
              const child = {}
              for (let i = 0; i < columnsLength; i++) {
                child[this.tableColums[i]] = ele[i]
              }
              temp.push(child)
            })
          }
          this.tableData = temp
          console.log(this.tableData);
          this.isLoading = false
        } else {
          this.$notify.error({
            title: '错误',
            message: response.msg
          });
          this.isLoading = false
        }
      }).catch(error => {
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.isLoading = false
      })
    },
    /**
     * @description: 页码改变
     */
    handleSizeChange(size) {
      this.current = 1
      // console.log(`每页 ${this.size} 条`)
      // console.log(`当前页: ${this.current}`)
      this.fetchData()
    },
    handleCurrentChange(page) {
      // console.log(`每页 ${this.size} 条`)
      // console.log(`当前页: ${this.current}`)
      this.fetchData()
    },
    /**
     * @description: 导出
     */
    download() {
      exportTaskResult({
        taskId: this.id
      }).then(response => {
        // 二进制流
        const fileBlob = new Blob([response], { type: 'application/vnd.ms-excel' })
        const fileName = this.fileName === '' ? '导出结果' : this.fileName + '.xls'
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(fileBlob, fileName);
        } else {
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(fileBlob)
          downloadElement.href = href
          downloadElement.download = fileName
          document.body.appendChild(downloadElement) // 将a标签添加到body当中
          downloadElement.click() // 启动下载
          document.body.removeChild(downloadElement) // 下载完毕删除a标签
          window.URL.revokeObjectURL(href)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  border-radius: 4px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  >>> .gutter {
    background: #F8F8FA;
    border-bottom: 1px solid #dfe6ec;
  }
}
</style>
