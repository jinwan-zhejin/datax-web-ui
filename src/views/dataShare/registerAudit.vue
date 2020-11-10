<template>
  <div class="app-container">
    <!-- 标题 -->
    <div class="filter-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">注册审批</div>
          <div class="right">
            <el-input v-model="interName" size="medium" class="filter-item" style="width: 268px;" placeholder="请输入内容" clearable>
              <el-button slot="append" class="filter-item" style="margin: 0px; padding: 8.5px 0px" @click="search">搜索</el-button>
            </el-input>
          </div>
        </div>
      </el-card>
    </div>
    <div class="main">
      <!-- 菜单栏 -->
      <div class="Menu">
        <!-- 切换按钮 -->
        <div class="btn" style="line-height: 40px;height: 40px;">
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="待审批" />
            <el-radio-button label="已同意" />
            <el-radio-button label="已驳回" />
          </el-radio-group>
        </div>
        <!-- 时间日期 -->
        <!-- <div class="time">
          <div class="search">
            <el-input
              v-model="interName"
              style="width: 300px;"
              placeholder="请输入接口名称"
            >
              <i slot="suffix" style="margin-right: 5px;cursor: pointer;" class="el-icon-search" @click="search" />
            </el-input>
          </div>
        </div> -->
      </div>
      <!-- 表格 -->
      <div class="tabel">
        <!-- 待审核 -->
        <el-table
          v-show="wait"
          :data="tabelList"
          :header-cell-style="{background:'#fafafc'}"
        >
          <!-- height="calc(100vh - 290px)" -->
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="interName"
            label="接口名称"
            align="left"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="left"
          />
          <!-- <el-table-column
            prop="telephone"
            label="联系方式">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="申请部门">
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="注册时间"
            width="170"
            align="left"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="left"
          />
          <el-table-column
            label="操作栏"
            align="left"
            width="120"
          >
            <template v-slot:default="{ row }">
              <a style="color:#3d5eff;" href="#" @click="isShowBatch(row)">审核</a>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已同意 -->
        <el-table
          v-show="agree"
          :data="tabelList"
          :header-cell-style="{background:'#fafafc'}"
        >
          <!-- height="calc(100vh - 290px)" -->
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="interName"
            label="接口名称"
            align="left"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="left"
          />
          <!-- <el-table-column
            prop="telephone"
            label="联系方式">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="申请部门">
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="注册时间"
            width="170"
            align="left"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="left"
          />
          <el-table-column
            label="操作栏"
            align="left"
            width="120"
          >
            <template v-slot:default="{ row }">
              <a style="color:#3d5eff;" href="#" @click="isShowViewBatch(row)">已审核(通过)</a>
            </template>
          </el-table-column>
        </el-table>
        <!-- 已驳回 -->
        <el-table
          v-show="dismiss"
          :data="tabelList"
          :header-cell-style="{background:'#fafafc'}"
        >
          <!-- height="calc(100vh - 290px)" -->
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="interName"
            label="接口名称"
            align="left"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="left"
          />
          <!-- <el-table-column
            prop="telephone"
            label="联系方式">
          </el-table-column>
          <el-table-column
            prop="departmentName"
            label="申请部门">
          </el-table-column> -->
          <el-table-column
            prop="createTime"
            label="注册时间"
            width="170"
            align="left"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="left"
          />
          <el-table-column
            label="操作栏"
            align="left"
            width="120"
          >
            <template v-slot:default="{ row }">
              <a style="color:#3d5eff;" href="#" @click="isShowViewBatch(row)">已审核(驳回)</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 使用审批对话框 -->
    <el-dialog width="30%" class="useBatch" title="使用审批" :visible.sync="dialogBatch">
      <el-form ref="batchForm" :model="batchForm" label-width="120px" style="height: 240px;overflow: hidden;overflow-y: auto;padding-right:30px">
        <el-form-item label="接口名称:">
          <el-input v-model="batchForm.interName" :disabled="isBan" />
        </el-form-item>
        <el-form-item label="接口描述:">
          <el-input v-model="batchForm.interRemark" :disabled="isBan" />
        </el-form-item>
        <el-form-item label="部门审批意见:">
          <el-input v-model="batchForm.exaDescribe" type="textarea" height="80px" @focus="clearDescribe" />
          <el-radio v-model="judge" label="通过">通过</el-radio>
          <el-radio v-model="judge" label="驳回">驳回</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" :disabled="isDis" @click="dismissM">驳 回</el-button>
        <el-button size="small" type="primary" :disabled="isPass" @click="pass">通 过</el-button>
      </span>
    </el-dialog>
    <!-- 查看审批对话框 -->
    <el-dialog width="30%" class="useBatch" title="查看审批情况" :visible.sync="dialogViewBatch">
      <el-form ref="batchForm" :model="batchForm" label-width="120px" style="height: 230px;overflow: hidden;overflow-y: auto;padding-right:30px">
        <el-form-item label="接口名称:">
          <el-input v-model="batchForm.interName" :disabled="isBan" />
        </el-form-item>
        <el-form-item label="接口描述:">
          <el-input v-model="batchForm.interRemark" :disabled="isBan" />
        </el-form-item>
        <el-form-item label="部门审批意见:">
          <el-input v-model="batchForm.exaDescribe" placeholder="同意" :disabled="isBan" height="80px" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="dialogViewBatch = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as interFaceApi from '@/api/data-share'
export default {
  data() {
    return {
      radio: '',
      radio1: '待审批',
      radio2: '已同意',
      radio3: '已驳回',
      judge: '',
      url: '',
      pageSize: 5, //  分页条数
      pageNum: 1, //  当前页
      total: 0, //  总条数
      wait: true,
      agree: false,
      dismiss: false,
      isBan: true,
      isDis: false,
      isPass: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      interName: '',
      resId: '',
      applyType: '',
      exaResult: '',
      value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      value2: [],
      startTime: '',
      endTime: '',
      tabelList: [],
      dialogBatch: false,
      batchForm: {
        interName: '',
        interRemark: '',
        exaDescribe: ''
      },
      needData: [],
      interId: '',
      dialogViewBatch: false
    }
  },
  watch: {
    radio: function(val) {
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
    },
    judge: function(val) {
      if (val === '通过') {
        this.isDis = true
        this.isPass = false
        if (!this.batchForm.exaDescribe) {
          this.batchForm.exaDescribe = val
        }
      } else if (val === '驳回') {
        this.isDis = false
        this.isPass = true
        if (!this.batchForm.exaDescribe) {
          this.batchForm.exaDescribe = val
        }
      }
    }
  },
  created() {
    this.radio = this.radio1
    this.search()
  },
  methods: {
    // 跳转查看地址
    link() {
      window.open(this.url)
    },
    clearDescribe() {
      console.log(123)
      this.judge = ''
      this.batchForm.exaDescribe = ''
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.pageNum = 1
      this.getAllResult()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAllResult()
    },
    isShowBatch(row) {
      console.log(row)
      this.interId = row.interId
      this.exaResult = row.exaResult
      this.batchForm.interName = row.interName
      this.batchForm.interRemark = row.interRemark
      this.dialogBatch = true
    },
    isShowViewBatch(row) {
      console.log(row)
      this.interId = row.interId
      this.batchForm.exaDescribe = row.exaDescribe
      this.batchForm.interName = row.interName
      this.batchForm.interRemark = row.interRemark
      if (this.batchForm.exaDescribe === null) {
        this.batchForm.exaDescribe = '同意'
      }
      this.dialogViewBatch = true
    },
    // 获取全部数据
    async getAllResult() {
      const res = await this.$axios.post('/interface/getInterfaceExamPage', {
        interName: '',
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        registerCompany: localStorage.getItem('UserName'),
        state: ''
      })
      console.log(res)
      if (res.status === 200) {
        this.tabelList = res.data.examineList
        if (this.radio) {
          this.radio = this.radio1
        }
      }
    },
    // 查询
    async search() {
      console.log(this.radio)
      interFaceApi.auditSearch({
        interName: this.interName,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        registerCompany: 'admin',
        state: this.radio
      }).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.tabelList = response.content.examineList
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 审核通过
    async pass() {
      this.exaResult = 0
      interFaceApi.interFaceAudit({
        exaDescribe: this.batchForm.exaDescribe,
        exaResult: this.exaResult,
        interId: this.interId,
        applyUserName: JSON.parse(localStorage.getItem('roles'))[0].split('_')[1].toLowerCase(),
        token: JSON.parse(localStorage.getItem('token'))
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.content.success) {
            this.$message.success(res.content.message)
            this.dialogBatch = false
            this.search()
          } else {
            this.$message.error(res.content.message)
            this.search()
          }
        }
      })
    },
    // 审核驳回
    async dismissM() {
      this.exaResult = 1
      interFaceApi.interFaceAudit({
        exaDescribe: this.batchForm.exaDescribe,
        exaResult: this.exaResult,
        interId: this.interId,
        applyUserName: JSON.parse(localStorage.getItem('roles'))[0].split('_')[1].toLowerCase(),
        token: JSON.parse(localStorage.getItem('token'))
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          if (res.content.success) {
            this.$message.success(res.content.message)
            this.dialogBatch = false
            this.search()
          } else {
            this.$message.error(res.content.message)
            this.search()
          }
        }
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
        .filter-item {
          display: inline-table;
        }
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
  .main {
    background-color: #fff;
    overflow: hidden;
    margin-top: 10px;
    .Menu {
      width: 100%;
      margin: 12px auto;
      height: 40px;
      line-height: 40px;
      padding-bottom: 5px;
      padding-left: 14px;
      // margin-bottom: 24px;
      .btn {
        float: left;
        margin-top: 0px;
        // .el-button {
        //   background: cornflowerblue;
        // }
        .el-radio-group {
          height: 30px;
          // .el-radio-button {
          //   .el-radio-button__inner {
          //     border-radius: 20px;
          //     border: none;
          //     background-color: initial;
          //   }
          //   .el-radio-button__inner:active {
          //     background-color: #409EFF;
          //     color: #ffffff;
          //   }
          // }
          // .is-active {
          //   background-color: #409EFF;
          //   border-radius: 20px;
          //   color: #ffffff;
          // }
        }
      }
    }
    .tabel {
      width: 100%;
      background-color: #fff;
      // border-radius: 4px;
      // border-left: 1px solid #E0E0E0;
      // border-right: 1px solid #E0E0E0;
      // border-top: 1px solid #E0E0E0;
    }
  }
  .el-dialog {
    .needTable {
      border: 1px solid rgb(238, 232, 232);
      text-align: center;
    }
  }
  ::v-deep .el-dialog {
    border-radius: 8px;
  }
}
</style>
