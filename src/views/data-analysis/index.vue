<template>
  <div class="analysis">
    <!-- <keep-alive>
      {{ analysis }}
    </keep-alive> -->
    <el-button @click="getAnalysis">链接</el-button>
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
        csrf_token: '',
        username: 'admin',
        password: 'admin'
      }
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
  },
  methods: {
    getAnalysis() {
      goLoginGet()
        .then(res => {
          // csrf_token
          console.log(res)
          this.analysis.csrf_token = this.getTokenFromHTML(res.data);
          // post info
          goLoginPost(qs.stringify(this.analysis))
            .then(() => {
              this.checkok = !this.checkok;
            })
            .catch(() => {
              this.checkok = !this.checkok;
            });
        })
        .catch(err => {
          console.log(err);
        });
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
}
</style>
