<template>
  <div v-loading="loading" class="analysis">
    <!-- <keep-alive>
      {{ analysis }}
    </keep-alive> -->
    <!-- <el-button @click="getAnalysis">链接</el-button> -->
    <!-- <iframe src="47.103.79.104:8080"></iframe> -->
  </div>
</template>

<script>
import { goLoginGet, goLoginPost, goWelcome } from '../../otherUrl/otherUrl';
import qs from 'qs'

export default {
  data() {
    return {
      checkok: false,
      welcomePage: '',
      analysis: {
        // csrf_token: '',
        username: 'admin',
        password: 'admin'
      },
      loading: true
    }
  },
  watch: {
    checkok: function() {
      var _this = this;
      _this.$nextTick(function() {
        this.getAnalysisPage();
      });
    }
  },
  created() {
    // this.getAnalysis()
    console.log(this.$route)
  },
  methods: {
    getAnalysis() {
      // this.analysis.csrf_token = this.getTokenFromHTML();
      window.location = 'http://192.168.3.60:9000/login?username=admin&password=123'
      setTimeout(() => {
        window.location = 'http://192.168.3.60:9000/superset/welcome'
      }, 10)
      // this.$router.push('/superset/welcome')
      // post info
      //   goLoginPost(qs.stringify(this.analysis))
      //     .then(() => {
      //       this.checkok = !this.checkok;
      //     })
      //     .catch(() => {
      //       this.checkok = !this.checkok;
      //     });
      // })
      // .catch(err => {
      //   console.log(err);
      // });
    },
    getAnalysisPage() {
      goWelcome(qs.stringify(this.analysis))
        .then(res => {
          this.welcomePage = res.data;
          // window.location.replace("http://47.103.79.104:8080/datains/welcome")
        })
        .catch(err => console.log(err));
    },
    getTokenFromHTML(htmlStr) {
      var el = document.createElement('html');
      el.innerHTML = htmlStr;
      console.log(el.querySelector('#csrf_token'));
      const ret = el.querySelector('#csrf_token').value;
      el = '';
      return ret;
    },
    json2FormData(json) {
      const formData = new FormData();
      Object.keys(json).forEach(key => {
        formData.append(key, json[key]);
      });
      return formData;
    }
  }
};
</script>

<style>
.analysis {
  padding: 20px;
  min-height: calc(100vh - 50px);
}
</style>
