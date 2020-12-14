<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      console.log(this.$route)
      // if (this.$route.name === 'JdbcDatasource') {
      //   let i = 0
      //   if (i === 0) {
      //     location.reload();
      //     i++
      //     console.log(i, 'i')
      //   }
      // }
      if (this.$route.name === 'analysis') {
        this.getAnalysis()
      }
      return this.$route.path
    }
  },
  methods: {
    getAnalysis() {
      window.location = 'http://192.168.3.60:9000/login?username=admin&password=123'
      setTimeout(() => {
        window.location = 'http://192.168.3.60:9000/superset/welcome'
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  background-color: #f5f6fa;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    // min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
