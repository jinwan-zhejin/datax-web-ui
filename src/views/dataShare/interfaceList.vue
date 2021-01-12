<template>
  <div class="app-container">
    <!-- 接口注册 -->
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">接口列表</div>
          <el-col class="left-description">
            管理接口增、删、注册。
          </el-col>
        </div>
      </el-card>
    </div>
    <!-- 表格 -->
    <div class="main">
      <el-form class="search-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item label="接口名称：">
          <el-input
            v-model="interName"
            clearable
            size="small"
            placeholder="接口名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-search"
            @click="getAllData"
          >搜 索</el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="reSet"
          >重 置</el-button>
        </el-form-item>
      </el-form>
      <el-form class="action-bar" label-position="right" label-width="auto" :inline="true">
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-plus"
            @click="gotoInterface"
          >接口注册</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#fafafc', color: '#666666'}"
      >
        <el-table-column
          fixed
          type="index"
          label="序号"
          align="center"
          width="80"
        />
        <el-table-column
          prop="interName"
          align="center"
          label="接口名称"
          width="280"
        />
        <el-table-column
          prop="interRemark"
          label="接口描述"
          align="center"
          width="400"
        />
        <el-table-column
          prop="interState"
          label="状态"
          align="center"
          width="250"
        >
          <template v-slot:default="{ row }">
            <!-- <el-tag>{{ row.interState }}</el-tag> -->
            <i
              :class="row.interState === '审核通过' ? 'el-icon-success' : 'el-icon-warning'"
              :style="{fontSize: '14px', color: row.interState === '审核通过' ? '#00B600' : '#FE4646'}"
            />
            {{ row.interState }}
          </template>
        </el-table-column>
        <!-- <el-table-column
        prop="implMethod"
        label="实现方式"
        width="100">
      </el-table-column>
      <el-table-column
        prop="deployMethod"
        label="业务类型"
        width="100">
      </el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          min-width="120"
        >
          <template v-slot:default="{ row }">
            <a style="color: #3d5eff;cursor:pointer;" @click="gotoViewRegister(row)">查看详情</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :current-page="pageNum"
        style="float: right; margin: 0;"
        :page-size="pageSize"
        :page-sizes="[30, 60, 90]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import * as interFaceApi from '@/api/data-share'
export default {
  data() {
    return {
      activeName: 'second',
      form: {},
      interName: '',
      newData: [
        {}
      ],
      dialogNewInter: false, // 新接口申请对话框
      pageSize: 30, //  分页条数
      pageNum: 1, //  当前页
      total: 0, //  总条数
      tableData: [],
      myObj: {}
    }
  },
  created() {
    this.getAllData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAllData()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    gotoUse() {
      this.$router.push('/myInterface')
    },
    gotoRegister() {
      this.$router.push('/data/register')
    },
    // 接口注册
    gotoInterface() {
      this.$router.push('/data/register')
    },
    // 显示新接口对话框
    isShowNew() {
      this.dialogNewInter = true
    },
    gotoViewRegister(row) {
      console.log(row)
      interFaceApi.viewDetail(row.id).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.$router.push({
            name: 'viewRegister',
            params: response.content
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    onSubmit() {
      console.log('创建')
    },
    // 显示新增接口对话框
    isShowAddNew() {
      this.dialogNewInter = false
      this.dialogAddNewInter = true
    },
    // 获取全部数据
    getAllData() {
      interFaceApi.getList({
        interName: this.interName,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        dataCompany: this.interName
      }).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.total = response.content.total
          this.tableData = response.content.resourceList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @description: 重置
     */
    reSet() {
      this.interName = ''
      this.getAllData()
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
  .addNew {
    .el-dialog__body {
      .el-form {
        padding: 0px 100px;
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
    .el-pagination {
      background-color: #fff;
      margin-top: 30px;
      padding: 32px 16px;
      border-bottom-right-radius: 8px;
      border-bottom-left-radius: 8px;
      .el-input__inner {
        height: 28px;
      }
    }
  }
}
</style>
