<template>
  <div class="myRegister">
    <!-- 接口列表选择 -->
    <!--    <div class="choose">
      <div class="btn">
        <el-button @click="gotoUse">接口使用列表</el-button>
        <el-button @click="gotoRegister"  type="primary">接口注册列表</el-button>
      </div>
    </div> -->
    <!-- 接口注册 -->
    <div class="interRegister">
      <!-- <p><i style="margin-right:10px;" class="el-icon-search"></i><span>查询条件</span></p> -->
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="gotoInterface">接口注册</el-button>
        <el-input v-model="interName" placeholder="请输入接口名称" class="input-with-select sort">
          <el-button slot="append" class="search" style="padding: 0px 10px;" icon="el-icon-search" @click="getAllData" />
        </el-input>
      </div>
    </div>
    <!-- 表格 -->
    <!-- <p style="margin-bottom:10px;"><i style="margin-right:10px;" class="el-icon-document"></i><span>查询结果</span></p> -->
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
      />
      <el-table-column
        prop="interName"
        border
        align="center"
        label="接口名称"
      />
      <el-table-column
        prop="interRemark"
        label="接口描述"
        align="center"
      />
      <el-table-column
        prop="interState"
        label="状态"
        width="230"
      >
        <template v-slot:default="{ row }">
          <el-tag>{{ row.interState }}</el-tag>
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
        align="center"
      >
        <template v-slot:default="{ row }">
          <a style="color: skyblue;cursor:pointer;" @click="gotoViewRegister(row)">查看详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[30, 60, 90]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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

<style lang="scss" scoped>
.myRegister {
  margin-left: 20px;
  margin-right: 20px;
  .choose {
    .btn {
      text-align: center;
      .el-button {
        margin: 0;
        width: 200px;
        margin: 0px 10px;
      }
      .defaultColor {
        background-color: rgb(90, 195, 236);
        color: #fff;
      }
      .el-button:hover {
        background-color: rgb(90, 195, 236);
        color: #fff;
      }
    }
  }
  .filter {
    margin-bottom: 10px;
    .el-form {
      overflow: hidden;
      margin-top: 10px;
      .el-form-item {
        width: 280px;
        float: left;
        .el-form-item__label {
          float: left;
        }
        .el-form-item__content {
          float: left;
        }
        .el-input {
          width: 200px;
        }
        .el-select {
          width: 200px;
        }
      }
      .sreach {
        float: left;
      }
      .el-input-group__append {
        padding: 0;
      }
    }
  }
  .interRegister {
    overflow: hidden;
    margin-bottom: 29px;
    margin-left: 10px;
    .sort {
      width: 300px;
    }
    .el-input {
      float: right;
    }
    .el-button {
      float: right;
      margin-left: 10px;
    }
    .el-input-group__append {
      padding: 0;
      .el-button {
        float: right;
        margin: 0 auto;
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
  .el-pagination {
    margin-top: 10px;
  }
  .el-table {
    border-left: 1px solid #f1f1f1;
    border-right: 1px solid #f1f1f1;
  }
}
</style>
