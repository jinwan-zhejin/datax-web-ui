<template>
  <div class="app-container">
    <!-- 标题 -->
    <div class="head-container">
      <el-card class="box-card">
        <div class="text item">
          <div class="left">注册审批</div>
          <el-col class="left-description">
            管理接口注册申请的审批。
          </el-col>
        </div>
      </el-card>
    </div>
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
            @click="search"
          >搜 索</el-button>
          <el-button
            size="small"
            icon="el-icon-refresh"
            @click="reSet"
          >重 置</el-button>
        </el-form-item>
      </el-form>
      <!-- 菜单栏 -->
      <div class="Menu">
        <!-- 切换按钮 -->
        <div class="btn">
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
          :header-cell-style="{background:'#fafafc', color: '#666666'}"
        >
          <!-- height="calc(100vh - 290px)" -->
          <el-table-column
            fixed
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <el-table-column
            prop="interName"
            label="接口名称"
            align="center"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="center"
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
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            width="120"
            fixed="right"
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
          :header-cell-style="{background:'#fafafc', color: '#666666'}"
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
            align="center"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="center"
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
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
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
          :header-cell-style="{background:'#fafafc', color: '#666666'}"
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
            align="center"
          />
          <el-table-column
            prop="interRemark"
            label="接口描述"
            width="350"
            align="center"
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
            align="center"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="170"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
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
    },
    /**
     * @description: 重置
     */
    reSet() {
      this.interName = ''
      this.search()
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
    .Menu {
      width: 100%;
      padding-bottom: 5px;
      .btn {
        float: left;
        margin-bottom: 10px;
      }
    }
    .tabel {
      width: 100%;
      background-color: #fff;
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
  >>> .el-dialog__footer {
  border-top: 1px solid #f3f3f3;
  padding: 20px;
}
}
</style>
