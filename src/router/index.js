import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'
import toolRouter from './modules/tool'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'Dashboard',
        meta: { title: '运行报表', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/cloudbeaver',
    component: Layout,
    children: [
      {
        path: '/cloudbeaver',
        component: () => import('@/views/cloudbeaver/index'),
        name: 'cloudbeaver',
        meta: { title: '元数据管理', icon: 'dashboard', keepAlive: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/data/log',
    hidden: true,
    component: () => import('@/views/datax/jobLog/log'),
    meta: { title: '任务日志', icon: 'work' }
  },
  {
    path: '/datax/project',
    component: Layout,
    redirect: '/datax/jobProject',
    name: 'datasource',
    meta: { title: '项目管理', icon: 'excel' },
    children: [
      {
        path: 'jobProject',
        name: 'jobProject',
        component: () => import('@/views/datax/jobProject/index'),
        meta: { title: '项目管理', icon: 'excel' }
      }
    ]
  },
  {
    path: '/datax/job',
    component: Layout,
    redirect: '/datax/job',
    name: 'job',
    meta: { title: '任务管理', icon: 'component' },
    children: [

      {
        path: 'jobInfo',
        name: 'JobInfo',
        component: () => import('@/views/datax/jobInfo/index'),
        meta: { title: '任务管理', icon: 'renwu' }
      },
      {
        path: 'jsonBuild',
        name: 'JsonBuild',
        component: () => import('@/views/datax/json-build/index'),
        meta: { title: '任务构建', icon: 'guide' }
      },
      {
        path: 'jsonBuildBatch',
        name: 'JsonBuildBatch',
        component: () => import('@/views/datax/json-build-batch/index'),
        meta: { title: '任务批量构建', icon: 'clipboard' }
      },
      {
        path: 'jobTemplate',
        name: 'JobTemplate',
        component: () => import('@/views/datax/jobTemplate/index'),
        meta: { title: 'DataX任务模板', icon: 'renwu_1' }
      }
    ]
  },

  // 数据质量

  {
    path: '/datax/quality',
    component: Layout,
    redirect: '/datax/quality',
    name: 'quality',
    meta: { title: '数据质量', icon: 'work' },
    children: [

      {
        path: 'metaModel',
        name: 'metaModel',
        component: () => import('@/views/datax/metaModel/index'),
        meta: { title: '数据元', icon: 'task-cfg' }
      },
      {
        path: 'dataCollect',
        name: 'dataCollect',
        component: () => import('@/views/datax/dataCollect/index'),
        meta: { title: '数据集', icon: 'guide' }
      },
      {
        path: 'BusinessTerms',
        name: 'BusinessTerms',
        component: () => import('@/views/datax/BusinessTerms/index'),
        meta: { title: '业务术语', icon: 'batch-create' }
      },
      {
        path: 'DocumentManage',
        name: 'DocumentManage',
        component: () => import('@/views/datax/DocumentManage/index'),
        meta: { title: '文档管理', icon: 'task-tmp' }
      },
      {
        path: 'standardCheck',
        name: 'standardCheck',
        component: () => import('@/views/datax/standardCheck/index'),
        meta: { title: '标准审核', icon: 'task-tmp' }
      },
      {
        path: 'dataQuality',
        name: 'dataQuality',
        component: () => import('@/views/datax/dataQuality/index'),
        meta: { title: '规则设计', icon: 'task-tmp' }
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/datax/question/index'),
        meta: { title: ' 问题数据', icon: 'task-tmp' }
      },
    ]
  },


  {
    path: '/datax/datasource',
    component: Layout,
    redirect: '/datax/jdbc-datasource',
    name: 'datasource',
    meta: { title: '数据源管理', icon: 'cfg-datasouce' },
    children: [
      {
        path: 'jdbcDatasource',
        name: 'JdbcDatasource',
        component: () => import('@/views/datax/jdbc-datasource/index'),
        meta: { title: '数据源管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/datax/log',
    component: Layout,
    redirect: '/datax/jobLog',
    name: 'log',
    meta: { title: '日志管理', icon: 'work' },
    children: [
      {
        path: 'jobLog',
        name: 'JobLog',
        component: () => import('@/views/datax/jobLog/index'),
        meta: { title: '日志管理', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/datax/executor',
    component: Layout,
    redirect: '/datax/executor',
    name: 'executor',
    meta: { title: '执行器管理', icon: 'work' },
    children: [
      {
        path: 'executor',
        name: 'Executor',
        component: () => import('@/views/datax/executor/index'),
        meta: { title: '执行器管理', icon: 'yun' }
      }
    ]
  },
  {
    path: '/datax/user',
    component: Layout,
    redirect: '/datax/user',
    name: 'user',
    meta: { title: '用户管理', icon: 'work', roles: ['ROLE_ADMIN'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/datax/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/datax/registry',
    component: Layout,
    redirect: '/datax/registry',
    name: 'registry',
    children: [
      {
        path: 'registry',
        name: 'Registry',
        component: () => import('@/views/datax/registry/index'),
        meta: { title: '资源监控', icon: 'chart' }
      }
    ]
  },
  {
    path: '/dataExplore',
    component: Layout,
    redirect: '/dataExplore/dataDiscovery',
    children: [
      {
        path: 'dataDiscovery',
        name: 'DataDiscovery',
        component: () => import('@/views/dataExplore/index.vue'),
        meta: { title: '数据探查', icon: 'eye-open' }
      },
      {
        path: 'details',
        name: 'details',
        hidden: true,
        component: () => import('@/views/dataExplore/details.vue'),
        meta: { title: '探查详情', noCache: true, activeMenu: '/dataExplore/dataDiscovery' }
      }
    ]
  },
  // 数据质量
  
  toolRouter,
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
