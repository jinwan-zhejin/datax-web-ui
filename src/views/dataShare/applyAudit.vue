<template>
  <div class="batch">
    <!-- 标题 -->
    <!-- <div class="tit">
      <span>批量数据审批</span>
    </div> -->
    <!-- 菜单栏 -->
    <div class="Menu">
        <!-- 切换按钮 -->
        <div class="btn">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="待审批"></el-radio-button>
            <el-radio-button label="已同意"></el-radio-button>
            <el-radio-button label="已驳回"></el-radio-button>
          </el-radio-group>
        </div>
        <!-- 时间日期 -->
        <div class="time">
            <div class="search">
              <el-input
                placeholder="请输入内容"
                v-model="infoName">
                <i slot="suffix" style="margin-right: 5px;" class="el-icon-search" @click="search"></i>
              </el-input>
            </div>
            <div class="block">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="value2"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </div>
        </div>
    </div>
    <!-- 表格 -->
    <div class="tabel">
      <!-- 待审核 -->
      <el-table
      v-show="wait"
      :data="tabelList"
      stripe
      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="infoName"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="申请联系人">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="申请部门">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          label="操作栏">
          <template v-slot:default="{ row }">
            <a style="color:skyblue;" @click="isShowBatch(row)" href="#">审核</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已同意 -->
      <el-table
      v-show="agree"
      :data="tabelList"
      stripe
      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="infoName"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="申请联系人">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="申请部门">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          label="操作栏">
          <template v-slot:default="{ row }">
            <a style="color:skyblue;" @click="isShowViewBatch(row)" href="#">已审核(通过)</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 已驳回 -->
      <el-table
      v-show="dismiss"
      :data="tabelList"
      stripe
      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
        <el-table-column
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="infoName"
          label="资源名称">
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="申请联系人">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="联系方式">
        </el-table-column>
        <el-table-column
          prop="departmentName"
          label="申请部门">
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间">
        </el-table-column>
        <el-table-column
          label="操作栏">
          <template v-slot:default="{ row }">
            <a style="color:skyblue;" @click="isShowViewBatch(row)" href="#">已审核(驳回)</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 使用审批对话框 -->
    <el-dialog class="useBatch" title="使用审批" :visible.sync="dialogBatch">
      <el-form ref="batchForm" :model="batchForm" label-width="100px" style="height: 400px;overflow: hidden;overflow-y: auto;padding-right:30px">
        <el-form-item label="申请人信息:">
          <el-input :disabled="isBan" style="width: 45%;float: left;" v-model="batchForm.contacts"></el-input>
          <el-input :disabled="isBan" style="width: 45%;float: right;" v-model="batchForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="资源名称:">
          <el-input :disabled="isBan" v-model="batchForm.infoName"></el-input>
        </el-form-item>
        <el-form-item label="资源类型:">
          <el-input :disabled="isBan" v-model="batchForm.resType"></el-input>
        </el-form-item>
        <el-form-item label="返回数据格式:">
          <el-tag type="success">JSON</el-tag>
        </el-form-item>
        <!-- <el-form-item label="查询条件:">
        </el-form-item> -->
        <el-form-item label="申请文件地址:">
          <a @click="link" style="cursor:pointer">{{ url }}</a>
        </el-form-item>
        <el-form-item label="应用场景:">
          <el-input :disabled="isBan" type="textarea" v-model="batchForm.useScene"></el-input>
        </el-form-item>
        <!-- <el-form-item label="附件">
          <span>数据申请.doc</span>
          <a href="#">下载附件</a>
        </el-form-item> -->
        <el-form-item label="部门审批意见:">
          <el-input type="textarea" v-model="batchForm.exaDescribe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dismissM">驳 回</el-button>
        <el-button type="primary" @click="pass">通 过</el-button>
      </span>
    </el-dialog>
    <!-- 查看审批对话框 -->
    <el-dialog class="useBatch" title="查看审批情况" :visible.sync="dialogViewBatch">
     <el-form ref="batchForm" :model="batchForm" label-width="100px" style="height: 400px;overflow: hidden;overflow-y: auto;padding-right:30px">
        <el-form-item label="申请人信息:">
          <el-input :disabled="isBan" style="width: 45%;float: left;" v-model="batchForm.contacts"></el-input>
          <el-input :disabled="isBan" style="width: 45%;float: right;" v-model="batchForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="资源名称:">
          <el-input :disabled="isBan" v-model="batchForm.infoName"></el-input>
        </el-form-item>
        <el-form-item label="资源类型:">
          <el-input :disabled="isBan" v-model="batchForm.resType"></el-input>
        </el-form-item>
        <el-form-item label="返回数据格式:">
          <el-tag type="success">JSON</el-tag>
        </el-form-item>
        <!-- <el-form-item label="查询条件:">
        </el-form-item> -->
        <el-form-item label="申请文件地址:">
          <a @click="link" style="cursor:pointer">{{ url }}</a>
        </el-form-item>
        <el-form-item label="应用场景:">
          <el-input :disabled="isBan" type="textarea" v-model="batchForm.useScene"></el-input>
        </el-form-item>
        <!-- <el-form-item label="附件">
          <span>数据申请.doc</span>
          <a href="#">下载附件</a>
        </el-form-item> -->
        <el-form-item label="部门审批意见:">
          <el-input placeholder="同意" :disabled="isBan" type="textarea" v-model="batchForm.exaDescribe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewBatch = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.radio = this.radio1
  },
  data () {
    return {
      radio: '',
      radio1: '待审批',
      radio2: '已同意',
      radio3: '已驳回',
      url: '',
      pageSize: 5, //  分页条数
      pageNum: 1, //  当前页
      total: 0, //  总条数
      wait: true,
      agree: false,
      dismiss: false,
      isBan: true,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      infoName: '',
      resId: '',
      applyType: '',
      exaResult: '',
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [],
      startTime: '',
      endTime: '',
      tabelList: [],
      dialogBatch: false,
      batchForm: {},
      needData: [],
      dialogViewBatch: false
    }
  },
  watch: {
    radio: function (val) {
      if (val === '待审批') {
        this.wait = true
        this.agree = false
        this.dismiss = false
        this.search()
        console.log(val)
        console.log(this.wait)
      } else if (val === '已同意') {
        this.wait = false
        this.agree = true
        this.dismiss = false
        this.search()
        console.log(val)
        console.log(this.wait)
      } else {
        this.wait = false
        this.agree = false
        this.dismiss = true
        this.search()
        console.log(val)
        console.log(this.wait)
      }
    }
  },
  methods: {
    // 跳转查看地址
    link () {
      window.open(this.url)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllResult()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getAllResult()
    },
    isShowBatch (row) {
      console.log(row)
      this.resId = row.resId
      this.exaResult = row.exaResult
      this.batchForm.contacts = row.contacts
      this.batchForm.telephone = row.telephone
      this.batchForm.infoName = row.infoName
      this.batchForm.resType = row.resType
      this.batchForm.useScene = row.useScene
      this.url = row.applyImg
      this.dialogBatch = true
    },
    isShowViewBatch (row) {
      console.log(row)
      this.batchForm.contacts = row.contacts
      this.batchForm.telephone = row.telephone
      this.batchForm.infoName = row.infoName
      this.batchForm.resType = row.resType
      this.batchForm.useScene = row.useScene
      this.batchForm.exaDescribe = row.exaDescribe
      if (this.batchForm.exaDescribe === null) {
        this.batchForm.exaDescribe = '同意'
      }
      this.dialogViewBatch = true
    },
    // 获取全部数据
    async getAllResult () {
      const res = await this.$axios.post('/resExamine/getResourceExamPages', {
        endTime: '',
        infoName: '',
        containName: localStorage.getItem('UserName'),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: '',
        state: ''
      })
      console.log(res)
      if (res.status === 200) {
        this.tabelList = res.data.resourceExamineList
        if (this.radio) {
          this.radio = this.radio1
        }
      }
    },
    // 查询
    async search () {
      console.log(this.radio)
      const res = await this.$axios.post('/resExamine/getResourceExamPages', {
        endTime: this.value2[0],
        infoName: this.infoName,
        containName: localStorage.getItem('UserName'),
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.value2[1],
        state: this.radio
      })
      console.log(res)
      if (res.status === 200) {
        this.tabelList = res.data.resourceExamineList
      }
    },
    // 审核通过
    async pass () {
      this.exaResult = 0
      const res = await this.$axios.post('/resExamine/approveResource', {
        resId: this.resId,
        exaDescribe: this.batchForm.exaDescribe,
        exaResult: this.exaResult,
        token: localStorage.getItem('token')
      })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          this.$message.success(res.data.message)
          this.dialogBatch = false
          this.search()
        } else {
          this.$message.error(res.data.message)
          this.search()
        }
      }
    },
    // 审核驳回
    async dismissM () {
      this.exaResult = 1
      const res = await this.$axios.post('/resExamine/approveResource', {
        resId: this.resId,
        exaDescribe: this.batchForm.exaDescribe,
        exaResult: this.exaResult,
        token: localStorage.getItem('token')
      })
      console.log(res)
      if (res.status === 200) {
        if (res.data.success) {
          this.$message.success(res.data.message)
          this.dialogBatch = false
          this.search()
        } else {
          this.$message.error(res.data.message)
          this.search()
        }
      }
    }
  }
}
</script>

<style lang="scss">
.batch {
  width: 100%;
  height: 100%;
  background-color: rgb(253, 253, 253);
  .tit {
    font-size: 16px;
    height: 35px;
    line-height: 30px;
    border-bottom: 1px solid #cccccc;
    span {
      display: block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      border-bottom: 2px solid skyblue;
    }
  }
  .Menu {
    width: 100%;
    margin: 0 auto;
    margin-top: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #fbf8f8;
    padding-bottom: 5px;
    border: 1px solid #f1f1f1;
    .btn {
      float: left;
      margin-left: 20px;
      margin-top: 0px;
      .el-button {
        background: cornflowerblue;
      }
      .el-radio-group {
        height: 30px;
        .el-radio-button {
          .el-radio-button__inner {
            border-radius: 20px;
            border: none;
            background-color: initial;
          }
          .el-radio-button__inner:active {
            background-color: #409EFF;
            color: #ffffff;
          }
        }
        .is-active {
          background-color: #409EFF;
          border-radius: 20px;
          color: #ffffff;
        }
      }
    }
    .block {
      float: right;
      .el-date-editor {
        width: 360px;
      }
    }
    .search {
      float: right;
      margin-left: 10px;
      .el-input {
        width: 150px;
      }
    }
  }
  .tabel {
    width: 100%;
    margin: 20px auto;
    .el-table {
    }
  }
  .el-dialog {
    .needTable {
      border: 1px solid rgb(238, 232, 232);
      text-align: center;
    }
  }
}
</style>
