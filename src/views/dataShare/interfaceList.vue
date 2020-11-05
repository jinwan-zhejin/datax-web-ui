<template>
  <div class="myRegister">
    <!-- 接口注册 -->
    <div class="interRegister">
      <div style="margin-top: 20px;">
        <span class="titSpan">接口列表</span>
        <el-button type="goon" size="medium" @click="gotoInterface">接口注册</el-button>
        <el-input v-model="interName" size="medium" placeholder="请输入接口名称" class="input-with-select sort" style="width: 208px;">
          <el-button slot="append" class="search" style="padding: 0px 10px;" @click="getAllData">搜索</el-button>
        </el-input>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="tableData"
        height="calc(100vh - 254px)"
        :header-cell-style="{background:'#fafafc',color:'#333333',fontSize:'14px',fontWeight:'500'}"
      >
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
    </div>
    <!-- 分页 -->
    <el-pagination
      background
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[30, 60, 90]"
      layout="total, prev, pager, next, sizes"
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

<style lang="scss">
.myRegister {
  padding: 24px;
  border-radius: 8px;
  .interRegister {
    overflow: hidden;
    height: 84px;
    line-height: 84px;
    text-align:right;
    position: relative;
    background-color: #fff;
    border-radius: 8px 8px 0px 0px;
    .el-button {
      border-radius: 4px;
    }
    .el-input .el-input__inner {
      height: 36px;
      line-height: 36px;
    }
    .titSpan {
      position: absolute;
      left: 24px;
      top: 50%;
      font-size: 24px;
      font-family: PingFangHK-Medium, PingFangHK;
      font-weight: 500;
      color: #333333;
      transform: translateY(-50%);
    }
    .sort {
      width: 300px;
    }
    .el-input {
      float: right;
      margin-right: 24px;
    }
    .el-button {
      float: right;
      margin: 0px 24px;
    }
    .el-input-group__append {
      padding: 0;
      background-color: #3D5FFF;
      color: #FFF;
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
    background-color: #fff;
    padding: 20px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    .el-input__inner {
      height: 28px;
    }
  }
  .table {
    background: white;
    padding: 0 20px;
    .el-table {
      color: #333333;
      margin: 0 0px;
      border-radius: 4px;
      border-left: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
      border-top: 1px solid #e0e0e0;
      th {
        background: #fafafc;
        border-bottom: 1px solid #e0e0e0;
      }
    }
  }
}

</style>
