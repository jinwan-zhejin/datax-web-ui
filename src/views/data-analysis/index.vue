<template>
  <div class="analysis">
    <!-- <keep-alive>
      {{ analysis }}
    </keep-alive> -->
    <el-button @click="getAnalysis">链接</el-button>
  </div>
</template>

<script>
import { goLogin } from '../../otherUrl/otherUrl'
export default {
  data() {
    return {
      analysis: ''
    }
  },
  created() {
    // this.getAnalysis()
  },
  methods: {
    getAnalysis() {
      goLogin().then((res) => {
        console.log(res)
        this.analysis = res
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
.analysis {
  padding: 20px;
}
</style>

