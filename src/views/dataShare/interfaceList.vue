<template>
  <div class="app-container">
    <!-- 接口注册 -->
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">接口列表</div>
          <div class="right">
            <el-input v-model="interName" size="medium" placeholder="请输入接口名称" class="filter-item" style="width: 268px;">
              <el-button slot="append" class="filter-item" style="margin: 0px; padding: 8.5px 0px" @click="getAllData">搜索</el-button>
            </el-input>
            <el-button class="filter-item" style="margin-left: 30px" type="goon" size="small" @click="gotoInterface">接口注册</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 表格 -->
    <div class="main">
      <el-table
        :data="tableData"
        :header-cell-style="{background:'#fafafc'}"
      >
        <!-- height="calc(100vh - 254px)" -->
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="80"
        />
        <el-table-column
          prop="interName"
          align="left"
          label="接口名称"
          width="280"
        />
        <el-table-column
          prop="interRemark"
          label="接口描述"
          align="left"
          width="400"
        />
        <el-table-column
          prop="interState"
          label="状态"
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
          label="操作"
          align="left"
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
        style="float: right;"
        :page-size="pageSize"
        :page-sizes="[30, 60, 90]"
        layout="total, prev, pager, next, sizes"
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
  .addNew {
    .el-dialog__body {
      .el-form {
        padding: 0px 100px;
      }
    }
  }
  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
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
