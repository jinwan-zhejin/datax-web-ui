<template>
  <div class="viewRe">
    <div class="main">
      <div class="operation">
        <div class="left">
          <p>
            <strong>{{ obj.interName }}</strong>
            <!-- <span>{{ obj.interState }}</span> -->
            <span>
              <i
                :class="obj.interState === '审核通过' ? 'el-icon-success' : 'el-icon-warning'"
                :style="{color: obj.interState === '审核通过' ? '#00B600' : '#FE4646'}"
              />{{ obj.interState }}
            </span>
            <span>{{ obj.isLimit }}</span>
          </p>
        </div>
        <div class="right">
          <el-button v-show="obj.interState !== '待审批'" size="mini" type="primary" plain @click="isShowApproval">审批详情</el-button>
        </div>
      </div>
      <!-- 注册信息详情 -->
      <div class="infoDetails">
        <div class="tit">
          <strong>注册信息详情</strong>
        </div>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="table-key">部门联系人</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.contacts }}</span>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <span class="table-key">联系方式</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.telephone }}</span>
          </el-col>
        </el-row>
      </div>
      <div v-show="isShow" class="show">
        <!-- 接口详情 -->
        <div class="interfaceDetails">
          <div class="tit">
            <strong>接口详情</strong>
          </div>
          <el-row>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">接口编码</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.interCode }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">实现方式</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.implMethod }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">接口地址</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.interUrl }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">注册单位</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.registerCompany }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">版本号</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.interVersion }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">归集范围</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.dataRange }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">请求方式</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.requestMethod }}</span>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <span class="table-key">请求示例</span>&nbsp;:&nbsp;<span class="table-value">{{ obj.example }}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 状态码 -->
        <p class="ptit"><span>状态码</span></p>
        <div class="stateCode">
          <el-table
            :data="tableStateCode"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column
              prop="code"
              label="状态码"
            />
            <el-table-column
              prop="describe"
              label="说明"
            />
          </el-table>
        </div>
        <!-- 输入参数 -->
        <p class="ptit"><span>输入参数</span></p>
        <div class="inParameter">
          <el-table
            :data="tableIn"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column
              prop="columnName"
              label="字段名称"
            />
            <el-table-column
              prop="columnCode"
              label="字段编码"
            />
            <el-table-column
              prop="columnRemark"
              label="描述"
            />
            <!-- <el-table-column
              prop="realName"
              label="实名认证">
            </el-table-column> -->
          </el-table>
        </div>
        <!-- 输出参数 -->
        <p class="ptit"><span>输出参数</span></p>
        <div class="toParameter">
          <el-table
            :data="tableTo"
            :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            style="width: 100%"
          >
            <el-table-column
              prop="fieldName"
              label="字段名称"
            />
            <el-table-column
              prop="fieldCode"
              label="字段编码"
            />
            <el-table-column
              prop="fieldRemark"
              label="描述"
            />
          </el-table>
        </div>
        <!-- 请求成功输出示例 -->
        <p class="ptit"><span>请求成功输出示例</span></p>
        <div class="Example">
          <!-- {{ success }} -->
          <el-input v-model="obj.success" :disabled="isBan" type="textarea" autosize />
        </div>
        <!-- 请求失败输出示例 -->
        <p class="ptit"><span>请求失败输出示例</span></p>
        <div class="Example">
          <!-- {{ success }} -->
          <el-input v-model="obj.fail" :disabled="isBan" type="textarea" autosize />
        </div>
      </div>
      <!-- 审批详情对话框 -->
      <el-dialog width="30%" title="审批详情" label-position="left" :visible.sync="dialogApproval" label-width="80px">
        <el-form :disabled="isBan" :model="approvalForm">
          <el-form-item label="审批人">
            <el-input v-model="approvalForm.reviewer" />
          </el-form-item>
          <el-form-item label="审批时间">
            <el-input v-model="approvalForm.exaTime" />
          </el-form-item>
          <el-form-item label="教管中心审批意见:">
            <el-input v-model="approvalForm.exaDescribe" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogApproval = false">取 消</el-button>
          <el-button type="primary" @click="dialogApproval = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as interFaceApi from '@/api/data-share'
export default {
  data() {
    return {
      dialogApproval: false,
      approvalForm: {},
      isBan: true,
      isShow: false,
      obj: {},
      tableStateCode: [],
      tableIn: [],
      tableTo: [],
      registerForm: '',
      radio: '1'
    }
  },
  created() {
    console.log(this.$route)
    if (this.$route.params) {
      localStorage.setItem('resData', JSON.stringify(this.$route.params))
      console.log(this.$route.params)
    }
    this.obj = JSON.parse(localStorage.getItem('resData'))
    console.log(this.obj)
    this.tableStateCode = JSON.parse(this.obj.stateCode)
    this.tableIn = JSON.parse(this.obj.inputParam)
    this.tableTo = JSON.parse(this.obj.outputParam)
    console.log(this.tableIn)
    console.log(this.tableTo)
    if (this.obj.interState === '待审批') {
      this.isShow = false
    } else {
      this.isShow = true
    }
  },
  methods: {
    isShowApproval() {
      this.viewApproval()
    },
    // 查看审批详情
    async viewApproval() {
      interFaceApi.regExamineDetail(this.obj.id).then(
        res => {
          console.log(res)
          if (res.code === 200) {
            this.approvalForm.reviewer = res.content[0].registerCompany
            this.approvalForm.exaTime = res.content[0].updateTime
            this.approvalForm.exaDescribe = res.content[0].interRemark
            this.dialogApproval = true
          }
        }
      ).catch(err => {
        console.log(err)
      })
    },
    // 沙箱模式
    sandbox() {
      this.$router.push('/sandbox')
    },
    // 注册接口对话框显示
    regFace() {
      this.dialogRegister = true
    },
    // 下一步
    next() {
      this.dialogRegister = false
      this.dialogParameter = true
    },
    // 上一步
    back() {
      this.dialogParameter = false
      this.dialogRegister = true
    }
  }
}
</script>

<style lang="scss" scoped>
.viewRe {
  padding: 20px;
  .main {
    padding: 20px 0;
    background-color: #fff;
    border-radius:8px;
    height: calc(100vh - 98px);
    overflow-y: auto;
    .operation {
      border-bottom: 1px solid skyblue;
      overflow: hidden;
       width: 95%;
      margin: 0 auto;
      .left {
        float: left;
        img {
          float: left;
          margin: 20px;
          margin-left: 0px;
        }
        p {
          margin: 10px 0;
          width: 600px;
          span {
            // background-color: rgb(72, 179, 221);
            margin: 0 10px;
            display: inline-block;
            padding: 2px 3px;
            // color: #ffffff;
            // border-radius: 5px;
            font-size: 14px;
            color: #333333;
          }
          strong {
            font-size: 24px;
          }
        }
        .text {
          font-size: 14px;
          color: #b6adad;
        }
      }
      .right {
        float: right;
      }
    }
    .infoDetails {
      width: 95%;
      margin: 0 auto;
      .tit {
        height: 30px;
        line-height: 30px;
        padding: 0px 10px;
        margin: 20px 0;
        padding-left: 0;
        border-left: 3px solid skyblue;
        strong {
          margin: 0px 20px;
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
        span {
          font-style: 14px;
          color: gray;
        }
      }
      p {
        padding: 20px;
        padding-left: 0;
        border-bottom: 1px solid #ccc;
        span {
          display: inline-block;
          width: 5px;
          height: 25px;
          background-color: skyblue;
        }
      }
    }
    .show {
      .interfaceDetails {
        width: 95%;
        margin: 0 auto;
        .tit {
          height: 30px;
          line-height: 30px;
          padding: 0px 10px;
          margin: 20px 0;
          padding-left: 0;
          border-left: 3px solid skyblue;
          strong {
            margin: 0px 20px;
            font-style: 20px;
          }
          span {
            font-style: 14px;
            color: gray;
          }
        }
        p {
          padding: 20px;
          padding-left: 0;
          border-bottom: 1px solid #ccc;
          span {
            display: inline-block;
            width: 5px;
            height: 25px;
            background-color: skyblue;
          }
        }
        .el-row {
          .el-col {
            margin: 10px 0;
          }
        }
      }
      .ptit {
        margin: 20px 0px;
        span {
          margin-left: 30px;
        }
      }
      .inParameter {
        width: 95%;
        margin: 0 auto;
        border: 1px solid #e4e4e4;
        border-bottom: none;
      }
      .stateCode {
        width: 95%;
        margin: 0 auto;
        border: 1px solid #e4e4e4;
        border-bottom: none;
      }
      .Example {
        width: 95%;
        margin: 0 auto;
      }
      .toParameter {
        width: 95%;
        margin: 0 auto;
        border: 1px solid #e4e4e4;
        border-bottom: none;
      }
      .el-table {
        width: 95%;
        margin: 0 auto;
        text-align: center;
      }
    }
    .el-dialog {
      .import {
        p {
          margin-bottom: 10px;
          span {
            color: red;
          }
        }
        ul {
          overflow: hidden;
          li {
            text-align: center;
            width: 25%;
            float: left;
            margin-top: 10px;
            margin-bottom: 10px;
          }
        }
        .bor_ul {
          border-bottom: 1px solid #ccc;
        }
      }
      .export {
        p {
          margin-bottom: 10px;
          span {
            color: red;
          }
        }
        ul {
          overflow: hidden;
          li {
            text-align: center;
            width: 25%;
            float: left;
            margin-top: 10px;
            margin-bottom: 10px;
          }
        }
        .bor_ul {
          border-bottom: 1px solid #ccc;
        }
      }
      .el-dialog__footer {
        text-align: center;
      }
    }
    ::v-deep .el-dialog {
      border-radius: 8px;
    }
  }
}
.table-key {
  color: #999999;
}
.table-value {
  color: #333333;
}
</style>
