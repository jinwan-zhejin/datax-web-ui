<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu === '/datax/datasource/jdbcDatasource' ? '/datax/project/jobProject' : activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <el-menu-item style="text-align: center;">
          <template slot="title">
            <img v-show="!isCollapse" slot="title" src="@/assets/LogoTit.png" alt="">
          </template>
          <svg-icon v-show="isCollapse" style="fontSize: 20px;text-align: center;" icon-class="logo1" />
        </el-menu-item>
        <div v-for="item in userRouter" :key="item.menuId">
          <router-link :to="returnPath(item.path)">
            <el-submenu v-if="item.children" :index="item.menuId + ''">
              <template slot="title">
                <svg-icon style="fontSize: 20px;text-align: center;" :icon-class="item.icon" />
                <span>{{ item.title }}</span>
              </template>
              <div :v-if="item.children !== null">
                <el-menu-item-group v-for="i in item.children" :key="i.menuId">
                  <router-link :to="returnPath(i.path)">
                    <el-menu-item :index="i.path">
                      <template slot="title">
                        <svg-icon style="fontSize: 20px;text-align: center;" :icon-class="i.icon" />
                        <span>{{ i.meta.title }}</span>
                      </template>
                    </el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </div>
            </el-submenu>
            <el-menu-item v-else :index="item.path">
              <svg-icon style="fontSize: 20px;text-align: center;" :icon-class="item.icon" />
              <span>{{ item.title }}</span>
            </el-menu-item>
          </router-link>
        </div>
        <!-- <sidebar-item v-for="route in beforeRouter" :key="route.path" :item="route" :base-path="route.path" /> -->
      </el-menu>
    </el-scrollbar>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import * as permission from '@/api/datax-user.js'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        // console.log(meta.activeMenu, '____________12')
        // if (meta.activeMenu === '数据源管理' || meta.activeMenu === '普通数据源') {
        //   return '项目管理'
        // } else {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  data() {
    return {
      userRouter: [],
      beforeRouter: [],
      arr: [],
      children: []
    }
  },
  created() {
    if (this.$route.name === 'analysis') {
      console.log(this.$route, ',.....................')
      this.getAnalysis()
    }
    console.log(this.$route, ',.....................')
    if (this.$route.query.level === '2') {
      sessionStorage.setItem('level', this.$route.query.level)
    }

    if (JSON.parse(localStorage.getItem('userId')) !== 1) {
      if (sessionStorage.getItem('level') === '2') {
        const myLeft = JSON.parse(localStorage.getItem('permission'))
        const arr = []
        for (let i = 0; i < myLeft.length; i++) {
          if (myLeft[i].menuId !== 1 && myLeft[i].menuId !== 4 && myLeft[i].menuId !== 61) {
            arr.push(myLeft[i])
          }
        }
        this.userRouter = arr
      } else {
        const myLeft = JSON.parse(localStorage.getItem('permission'))
        const arr = []
        for (let i = 0; i < myLeft.length; i++) {
          if (myLeft[i].menuId === 1 || myLeft[i].menuId === 4 || myLeft[i].menuId === 61) {
            arr.push(myLeft[i])
          }
        }
        this.userRouter = arr
        console.log(arr, '当前用户显示')
      }
    } else {
      this.userRouter = JSON.parse(localStorage.getItem('permission'))
    }

    console.log(this.userRouter, 'session')
  },
  methods: {
    returnPath(path) {
      if (path) {
        return path
      } else {
        return ''
      }
    },
    getAnalysis() {
      window.location = 'http://192.168.3.60:9000/login?username=admin&password=123'
      setTimeout(() => {
        window.location = 'http://192.168.3.60:9000/superset/welcome'
      }, 200)
    },
    // 当前用户权限显示
    showUserPer() {
      this.userRouter = JSON.parse(sessionStorage.getItem('permission'))
      console.log(this.permission_routes, '123')
      for (let i = 0; i < this.permission_routes.length; i++) {
        if (!this.permission_routes[i].name) {
          this.arr.push(this.permission_routes[i])
        } else if (this.permission_routes[i].name === ('ErrorPages')) {
          this.arr.push(this.permission_routes[i])
        }
      }
      console.log(this.beforeRouter, this.arr, 'beforeRouter')
      for (let k = 0; k < this.permission_routes.length; k++) {
        for (let j = 0; j < this.userRouter.length; j++) {
          if (this.permission_routes[k].meta) {
            if (this.permission_routes[k].meta.title.replace(/\s*/g, '') === this.userRouter[j].meta.title.replace(/\s*/g, '') || this.permission_routes[k].name === this.userRouter[j].meta.title) {
              this.beforeRouter.push(this.permission_routes[k])
            }
          } else {
            if (this.permission_routes[k].children && this.permission_routes[k].children[0].meta) {
              if (this.permission_routes[k].children[0].meta.title === this.userRouter[j].meta.title) {
                this.beforeRouter.push(this.permission_routes[k])
              }
            }
          }
        }
      }
      this.beforeRouter = [...new Set(this.beforeRouter.concat(this.arr))]
      for (let i = 0; i < this.beforeRouter.length; i++) {
        for (let j = 0; j < this.userRouter.length; j++) {
          if (this.beforeRouter[i].meta.title.replace(/\s*/g, '') === this.userRouter[j].title.replace(/\s*/g, '')) {
            if (this.userRouter[j].children && this.beforeRouter[i].children) {
              // for (let n = 0; n < this.beforeRouter[i].children.length; n++) {
              //   if (this.beforeRouter[i].children[n].meta) {
              //     for (let m = 0; m < this.userRouter[j].children.length; m++) {
              //       if (this.beforeRouter[i].children[n].meta.title.replace(/\s*/g, '') === this.userRouter[j].children[m].title.replace(/\s*/g, '')) {
              //         this.children.push(this.beforeRouter[i].children[n])
              //         continue
              //       }
              //     }
              //     if (this.children.length > 0) {
              //       this.beforeRouter[i].children = this.children
              //     }
              //   }
              // }
              for (let n = 0; n < this.userRouter[j].children.length; n++) {
                for (let m = 0; m < this.beforeRouter[j].children.length; m++) {
                  if (this.beforeRouter[i].children[m].meta) {
                    if (this.beforeRouter[i].children[m].meta.title.replace(/\s*/g, '') === this.userRouter[j].children[n].title.replace(/\s*/g, '')) {
                      break
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(this.beforeRouter, 'beforeRouter')
    }
  }
}
</script>

<style lang="scss">
.Title {
  font-size: 24px;
  font-family:Verdana, Geneva, Tahoma, sans-serif;
  text-align: center;
  color: aliceblue;
}
img {
  width: 160px;
}
</style>
