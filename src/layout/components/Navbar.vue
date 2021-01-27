<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <!--        <search id="header-search" class="right-menu-item" />-->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <!--        <screenfull id="screenfull" class="right-menu-item hover-effect" />-->

        <!--        <el-tooltip content="Global Size" effect="dark" placement="bottom">-->
        <!--          <size-select id="size-select" class="right-menu-item hover-effect" />-->
        <!--        </el-tooltip>-->

      </template>
      <el-dropdown v-if="showCurrent" class="right-menu-item" trigger="click" @command="handleCommand">
        <span style="font-size: 14px;cursor: pointer;">
          {{ dropdownText }}<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown" style="max-height: calc(100vh - 200px); overflow: auto;">
          <el-dropdown-item v-for="item in options" :key="item.id" :command="item.id + '/' + item.name">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../../public/avatar.jpg" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--<router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>-->
          <!-- <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item>
            <span style="display:block;" @click="showPsw">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog width="40%" title="修改密码" :visible.sync="dialogPSWVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form
            ref="pswForm"
            :rules="rules"
            :model="pswForm"
            label-position="right"
            label-width="120px"
          >
            <el-form-item label="原密码:" prop="oldPsw">
              <el-input v-model="pswForm.oldPsw" autocomplete="off" placeholder="原密码" />
            </el-form-item>
            <el-form-item label="新密码:" prop="newPsw">
              <el-input v-model="pswForm.newPsw" type="password" autocomplete="off" placeholder="新密码" />
            </el-form-item>
            <el-form-item label="确认新密码:" prop="VerifyPsw">
              <el-input v-model="pswForm.VerifyPsw" type="password" autocomplete="off" placeholder="确认密码" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogPSWVisible = false">
          取消
        </el-button>
        <el-button type="goon" size="small" @click="editPsw">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import { updatePsw } from '@/api/user'
import * as jobProjectApi from '@/api/datax-job-project';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.pswForm.newPsw) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialogPSWVisible: false,
      pswForm: {
        oldPsw: '',
        newPsw: '',
        VerifyPsw: ''
      },
      options: [], // 项目数组
      listQuery: {
        pageNo: 1,
        pageSize: 99999,
        userId: ''
      },
      dropdownText: '请选择',
      showCurrent: false,
      rules: {
        oldPsw: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '密码必须是6-20位', trigger: ['blur', 'change'] }
          // { pattern: /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/, message: '请输入至少有数组、字母、字符两种组合的6-16位的密码' }
        ],
        newPsw: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '密码必须是6-20位', trigger: ['blur', 'change'] }
        ],
        VerifyPsw: [
          { required: true, message: '密码不能为空', trigger: ['blur', 'change'] },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created() {
    this.getProjectList()
    const str = sessionStorage.getItem('strParam')
    if (sessionStorage.getItem('level') === '2') {
      if (str) {
        this.dropdownText = str.split('/')[1]
        this.$store.commit('changeCurrent', str)
      }
      this.showCurrent = true
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      localStorage.clear()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      sessionStorage.clear()
    },
    handleCommand(command) {
      console.log(command)
      const commandName = command.split('/')[1]
      this.dropdownText = commandName
      this.$store.commit('changeCurrent', command)
      console.log(this.$store.state.project.currentItem, 'item')
    },
    // 获取项目列表
    getProjectList() {
      this.listQuery.userId = parseInt(localStorage.getItem('userId'))
      jobProjectApi.list(this.listQuery).then((res) => {
        console.log(res, 'zzzzzzzzzzc')
        this.options = res.records
      }).catch(error => {
        console.log(error)
      })
    },
    showPsw() {
      this.dialogPSWVisible = true
    },
    editPsw() {
      this.$refs.pswForm.validate((valid) => {
        if (valid) {
          console.log(valid)
          const params = {
            userId: parseInt(localStorage.getItem('userId')),
            passWorld: this.pswForm.oldPsw,
            newPassWorld: this.pswForm.newPsw
          }
          updatePsw(params).then((res) => {
            console.log(res)
            if (res.code === '200') {
              this.$message.success(res.message)
              this.dialogPSWVisible = false
            } else {
              this.$message.error(res.message)
            }
          }).catch((err) => {
            console.error(err)
          })
        } else {
          this.$message.error('验证未通过')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }

  >>> .el-dialog__footer {
    border-top: 1px solid #f3f3f3;
    padding: 20px;
  }
}
</style>
