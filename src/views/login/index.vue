<template>
  <div class="container">
    <div class="nav">
      <div class="logo"></div>
    </div>
    <div class="login-container">
      <div class="login" ref="login">
        <p class="title">一站式DW能力平台</p>

        <span class="mes"
          >集数据集成、数据开发、数据管理、数据治理于一体，助力企业专注数据价值的挖掘和探索</span
        >

        <input
          class="login_Account"
          type="text"
          placeholder="请输入登录账户"
          ref="username"
          v-model="loginForm.username"
        />
        <input
          class="login_Account"
          type="password"
          placeholder="请输入登录密码"
          ref="password"
          v-model="loginForm.password"
        />
        <div class="login_error"><span v-if="errorMes">密码输入错误</span></div>
        <div class="login_btn" @click="handleLogin">登录</div>
      </div>
      <span class="statement">Copyright © 2020 上海哲锦信息科技有限公司</span>
    </div>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
import SocialSign from "./components/SocialSignin";

export default {
  name: "Login",
  components: { SocialSign },
  data() {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      errorMes: false,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true,
    },
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
     document.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        this.handleLogin()
      }
    });
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= "a" && key <= "z") ||
          (!shiftKey && key >= "A" && key <= "Z")
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (!this.loginForm.username || !this.loginForm.password) return;
      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          this.$router.push({
            path: this.redirect || "/",
            query: this.otherQuery,
          });
          this.loading = false;
          this.errorMes = false;
        })
        .catch(() => {
          this.loading = false;
          this.errorMes = true;
        });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  },
  mounted() {
    const loginEle = this.$refs.login;
    const _this = this;
    function fontSize() {
      var deviceWidth = loginEle.clientWidth;
      _this.$refs.login.style.fontSize = deviceWidth * 0.068 + "px";
    }
    fontSize();
    window.onresize = fontSize;
  },
};
</script>

<style lang="scss">
.container {
  height: 100%;
  width: 100%;
  .nav {
    padding-bottom: 4.2%;
    background: #ffffff;
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.05);
    .logo {
      width: 9.375%;
      padding-bottom: 2%;
      background-image: url("../../../public/img/logo.png");
      background-size: 100%;
      margin-left: 17.2%;
      margin-top: 1%;
      float: left;
    }
  }
  .login-container {
    height: 90%;
    width: 100%;
    background-image: url("../../../public/img/login.png");
    background-size: 100%;
    background-repeat: no-repeat;
    overflow: hidden;

    .login {
      width: 24.3%;
      padding-bottom: 25.7%;
      margin-left: 58.7%;
      margin-top: 5.55%;
      .title {
        font-weight: bold;
        font-size: 1em;
        margin-bottom: 0.83em;
      }
      .mes {
        font-size: 0.67em;
        color: rgba(0, 0, 0, 0.65);
        line-height: 1.16em;
      }

      .login_Account {
        margin-top: 1.75em;
        width: 100%;
        height: 3.5em;
        box-sizing: border-box;
        padding: 0.4em 0.67em;
        font-size: 0.58em;
        border: 1px solid rgba(163, 192, 255, 1);
      }
      .login_Account::placeholder {
        font-size: 0.58em;
      }

      .login_Account:focus {
        border: 1px solid rgba(0, 45, 255, 1);
        outline: none;
      }

      .login_error {
        color: rgba(255, 77, 79, 1);
        height: 1em;
        font-size: 0.5em;
        margin-top: 1em;
      }

      .login_btn {
        // padding-bottom: 1em;
        margin-top: 1em;
        height: 3.5em;
        color: #ffffff;
        line-height: 3.5em;
        font-size: 0.67em;
        text-align: center;
        cursor: pointer;
        background: rgba(11, 54, 255, 1);
      }

      .login_btn:hover {
        background: rgba(9, 50, 192, 1);
      }
    }

    .statement {
      color: rgba(0, 0, 0, 0.45);
      position: absolute;
      bottom: 25px;
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>