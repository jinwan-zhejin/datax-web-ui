<template>
  <div class="myInterface">
    <!-- 接口列表选择 -->
    <div class="choose">
      <div class="btn">
        <el-button :header-cell-style="defaultColor" @click="gotoUse" type="primary">接口使用列表</el-button>
        <el-button @click="gotoRegister">接口注册列表</el-button>
      </div>
    </div>
    <!-- 条件筛选查询 -->
    <div class="filter" v-show="isShowFilter">
      <p><i style="margin-right:10px;" class="el-icon-search"></i><span>查询条件</span></p>
      <el-form ref="form" :model="form">
        <!-- <el-form-item label="应用选择">
          <el-select v-model="form.apply" placeholder="请选择">
            <el-option label="应用一" value="one"></el-option>
            <el-option label="应用二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="form.service" placeholder="请选择">
            <el-option label="业务一" value="one"></el-option>
            <el-option label="业务二" value="two"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-input placeholder="请输入接口名称" v-model="form.name"></el-input>
        </el-form-item>
        <div class="sreach">
          <el-button @click="search" type="primary" plain>查询</el-button>
          <!-- <el-button type="primary" plain>重置</el-button> -->
        </div>
      </el-form>
    </div>
    <!-- 表格 -->
    <p style="margin-bottom:10px;"><i style="margin-right:10px;" class="el-icon-document"></i><span>查询结果</span></p>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
      <el-table-column
        type="index"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="infoName"
        border
        label="接口名称"
        width="230">
      </el-table-column>
      <el-table-column
        prop="infoExtract"
        label="接口描述">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="100">
        <template v-slot:default="{ row }">
          <el-tag>{{ row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="resType"
        label="业务类型"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template v-slot:default="{ row }">
          <a style="color: skyblue;cursor:pointer;" @click="gotoViewDetails(row)">查看详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[30, 60, 90]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 新接口申请对话框 -->
    <el-dialog title="新接口申请" :visible.sync="dialogNewInter">
      <el-table :data="newData">
        <el-table-column type="index"  width="50"></el-table-column>
        <el-table-column label="描述" width="200"></el-table-column>
        <el-table-column label="是/否"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogNewInter = false">取 消</el-button>
        <el-button type="primary" @click="isShowAddNew">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 新增接口对话框 -->
    <!-- <el-dialog class="addNew" title="新增接口" :visible.sync="dialogAddNewInter">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="部门联系人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="接口名称">
          <el-input v-model="form.interName"></el-input>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="form.region" placeholder="验证">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接口名称">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="查询条件">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="数据项来源">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="应用场景">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="应用场景">
          <el-table :data="newData">
            <el-table-column type="index"  width="50"></el-table-column>
            <el-table-column label="描述" width="200"></el-table-column>
            <el-table-column label="是/否"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddNewInter = false">取 消</el-button>
        <el-button type="primary" @click="dialogAddNewInter = false">上一步</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
export default {
  created () {
    this.getAllData()
    if (window.location.href.split('#')[1].split('/')[1] !== 'viewDetails') {
      localStorage.removeItem('row')
      localStorage.removeItem('infoId')
    }
  },
  data () {
    return {
      activeName: 'second',
      form: {},
      isShowFilter: true,
      isShowInter: false,
      dialogAddNewInter: false, // 新增接口对话框
      defaultColor: {
        backgroundColor: '#eef1f6',
        Color: '#606266'
      },
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
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getAllData()
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    gotoUse () {
      this.$router.push('/myInterface')
    },
    gotoRegister () {
      this.$router.push('/register')
    },
    // 接口注册
    gotoInterface () {
      this.$router.push('/infaceReg')
    },
    // 显示新接口对话框
    isShowNew () {
      this.dialogNewInter = true
    },
    gotoViewDetails (row) {
      console.log(row)
      this.myObj = row
      console.log(this.myObj)
      this.$router.push({
        name: 'viewDetails',
        params: {
          row: JSON.stringify(this.myObj)
        }
      })
    },
    onSubmit () {
      console.log('创建')
    },
    // 显示新增接口对话框
    isShowAddNew () {
      this.dialogNewInter = false
      this.dialogAddNewInter = true
    },
    // 获取全部数据
    async getAllData () {
      const res = await this.$axios.post('/applyResource/getMyApplyResourcePages', {
        dataCompany: '',
        infoName: '',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        token: localStorage.getItem('token')
      })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          this.total = res.data.message.total
          this.tableData = res.data.message.resourceList
        } else {
          this.$message.error(res.data.message)
          this.$router.push(localStorage.removeItem('token'))
        }
      }
      // if (res.status === 200) {
      //   if (res.data.success) {
      //     this.$message.success(res.data.message)
      //     this.total = res.data.total
      //     this.tableData = res.data.resourceList
      //   } else {
      //     this.$message.error(res.data.message)
      //     localStorage.removeItem('token')
      //     this.gotoLogin()
      //   }
      // }
    },
    // token异常跳转到登录页
    gotoLogin () {
      window.location.href = 'http://localhost:8080/#/homePage?isOverdue=' + 'true'
      console.log(123)
    },
    // 查询
    async search () {
      const res = await this.$axios.post('/applyResource/getMyApplyResourcePages', {
        dataCompany: '',
        infoName: this.form.name,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        token: localStorage.getItem('token')
      })
      console.log(res)
      if (res.status === 200) {
        this.total = res.data.total
        this.tableData = res.data.resourceList
      }
      // if (res.status === 200) {
      //   if (res.data.success) {
      //     this.$message.success(res.data.message)
      //     this.total = res.data.total
      //     this.tableData = res.data.resourceList
      //   } else {
      //     this.$message.error(res.data.message)
      //     localStorage.removeItem('token')
      //     window.open('http://localhost:8080/#/homePage')
      //   }
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.myInterface {
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
