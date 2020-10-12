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
    meta: { title: '运行报表', icon: 'excel' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'Dashboard',
        meta: { title: '运行报表', icon: 'dashboard', affix: true }
      },
      {
        path: 'dataUsage',
        component: () => import('@/views/dashboard/admin/index'),
        name: 'dataUsage',
        meta: { title: '数据访问量统计', icon: 'fenxi_1', affix: true }
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
    path: '/datax/datasource',
    component: Layout,
    redirect: '/datax/datasource',
    name: 'datasource',
    meta: { title: '数据源管理', icon: 'cfg-datasouce' },
    children: [
      {
        path: 'jdbcDatasource',
        name: 'JdbcDatasource',
        component: () => import('@/views/datax/jdbc-datasource/index'),
        meta: { title: '普通数据源', icon: 'table' }
      },
      {
        path: 'compute',
        name: 'compute',
        component: () => import('@/views/datax/jdbc-datasource/compute-datasource/index'),
        meta: { title: '计算数据源', icon: 'tree-table' }
      }
    ]
  },
  // {
  //   path: '/cloudbeaver',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/cloudbeaver',
  //       component: () => import('@/views/cloudbeaver/index'),
  //       name: 'cloudbeaver',
  //       meta: { title: '元数据管理', icon: 'form', keepAlive: true }
  //     }
  //   ]
  // },
  {
    path: '/cloudbeaveratlas',
    component: Layout,
    redirect: '/cloudbeaveratlas',
    name: 'cloudbeaveratlas',
    meta: { title: '元数据管理', icon: 'cfg-datasouce' },
    children: [
      {
        path: 'cloudbeaveratlas',
        component: () => import('@/views/cloudbeaveratlas/index'),
        name: 'cloudbeaveratlas',
        meta: { title: '元数据管理From Atlas', icon: 'form', keepAlive: true }
      },
      {
        path: 'compare',
        component: () => import('@/views/cloudbeaveratlas/metaCompare'),
        name: 'compare',
        meta: { title: '元数据比对', icon: 'form', keepAlive: true }
      },
      {
        path: 'analysis',
        component: () => import('@/views/cloudbeaveratlas/index'),
        name: 'streamanalysis',
        meta: { title: '数据流分析', icon: 'form', keepAlive: true }
      }
    ]
  },
  {
    path: '/datax/job',
    component: Layout,
    redirect: '/datax/job',
    name: 'job',
    meta: { title: '任务管理', icon: 'chuangjianyingyong' },
    children: [

      {
        path: 'jobInfo',
        name: 'JobInfo',
        component: () => import('@/views/datax/jobInfo/index'),
        meta: { title: '任务管理', icon: 'renwu' }
      },
      {
        path: 'jobInfo2',
        name: 'JobInfo2',
        component: () => import('@/views/datax/jobInfo/index1'),
        meta: { title: '任务管理2', icon: 'renwu' }
      }
      // {
      //   path: 'jsonBuild',
      //   name: 'JsonBuild',
      //   component: () => import('@/views/datax/json-build/index'),
      //   meta: { title: '普通任务构建', icon: 'guide' }
      // },
      // {
      //   path: 'importJob',
      //   name: 'importJob',
      //   component: () => import('@/views/datax/json-build/index'),
      //   meta: { title: '引入任务构建', icon: 'nested' }
      // },
      // {
      //   path: 'exportJob',
      //   name: 'exportJob',
      //   component: () => import('@/views/datax/json-build/index'),
      //   meta: { title: '导出任务构建', icon: 'example' }
      // },
      // {
      //   path: 'computeJob',
      //   name: 'computeJob',
      //   component: () => import('@/views/datax/json-build/index'),
      //   meta: { title: '计算任务构建', icon: 'list' }
      // },
      // {
      //   path: 'sqlJob',
      //   name: 'sqlJob',
      //   component: () => import('@/views/dataDev/dataDev'),
      //   meta: { title: 'SQL任务构建', icon: 'component' }
      // },
      // {
      //   path: 'dqcJob',
      //   name: 'dqcJob',
      //   component: () => import('@/views/datax/jsonQuality/index'),
      //   meta: { title: '质量任务构建', icon: 'chuangjiangongdan' }
      // },
      // {
      //   path: 'jsonBuildBatch',
      //   name: 'JsonBuildBatch',
      //   component: () => import('@/views/datax/json-build-batch/index'),
      //   meta: { title: '任务批量构建', icon: 'clipboard' }
      // },
      // {
      //   path: 'jobTemplate',
      //   name: 'JobTemplate',
      //   component: () => import('@/views/datax/jobTemplate/index'),
      //   meta: { title: '普通任务模板', icon: 'chuangjianmoban' }
      // }
    ]
  },

  {
    path: '/dataDev',
    component: Layout,
    children: [
      {
        path: '/dataDev',
        component: () => import('@/views/dataDev/dataDev'),
        name: 'dataDev',
        meta: { title: '数据开发', icon: 'kaifajindu', keepAlive: true }
      }
    ]
  },
  // 数据质量

  {
    path: '/datax/quality',
    component: Layout,
    redirect: '/datax/quality',
    name: 'quality',
    meta: { title: '数据质量', icon: 'shujuzhiliang' },
    children: [
      // {
      //   path: 'techStandard',
      //   name: 'techStandard',
      //   component: () => import('@/views/datax/metaModel/index'),
      //   meta: { title: '技术标准', icon: 'biaozhunhuazhanxian' }
      // },
      // {
      //   path: 'bizStandard',
      //   name: 'bizStandard',
      //   component: () => import('@/views/datax/dataCollect/index'),
      //   meta: { title: '业务标准', icon: 'shujujiguanli' }
      // },
      // {
      //   path: 'dataCollect',
      //   name: 'dataCollect',
      //   component: () => import('@/views/datax/dataCollect/index'),
      //   meta: { title: '数据集', icon: 'guide' }
      // },

      // {
      //   path: 'dataQuality',
      //   name: 'dataQuality',
      //   component: () => import('@/views/datax/dataQuality/index'),
      //   meta: { title: '规则设计', icon: 'shuju' }
      // },
      // {
      //   path: 'dataQuality',
      //   name: 'dataQuality',
      //   component: () => import('@/views/datax/dataQuality/index'),
      //   meta: { title: '规则设计', icon: 'task-tmp' }
      // },

      {
        path: 'dqEstimate',
        name: 'dqEstimate',
        component: () => import('@/views/dataQuality/generalRules/index'),
        meta: { title: '质量评估', icon: 'guize' }
      },
      {
        path: 'dqNotify',
        name: 'dqNotify',
        component: () => import('@/views/dataQuality/generalRules/index'),
        meta: { title: '质量监控', icon: 'guize' }
      },
      {
        path: 'general',
        name: 'general',
        component: () => import('@/views/dataQuality/generalRules/index'),
        meta: { title: ' 通用规则', icon: 'guize' }
      },
      {
        path: 'individuation',
        name: 'individuation',
        component: () => import('@/views/dataQuality/specificRules/index'),
        meta: { title: ' 个性化规则', icon: 'guize_1' }
      },
      {
        path: 'standardCheck',
        name: 'standardCheck',
        component: () => import('@/views/dataQuality/standardCheck/index'),
        meta: { title: '规则审核', icon: 'shenhe' }
      },
      {
        path: 'appliedStandard',
        name: 'appliedStandard',
        component: () => import('@/views/dataQuality/standardCheck/index'),
        meta: { title: '规则配置详情', icon: 'shenhe' }
      },
      // {
      //   path: 'BusinessTerms',
      //   name: 'BusinessTerms',
      //   component: () => import('@/views/datax/BusinessTerms/index'),
      //   meta: { title: '业务术语', icon: 'business' }
      // },
      {
        path: 'DocumentManage',
        name: 'DocumentManage',
        component: () => import('@/views/datax/DocumentManage/index'),
        meta: { title: '文档管理', icon: 'documentation' }
      }
    ]
  },
  {
    path: '/model',
    component: Layout,
    redirect: '/model',
    name: 'modeldesign',
    meta: { title: '数据模型', icon: 'excel' },
    children: [
      {
        path: 'design',
        name: 'design',
        component: () => import('@/views/dataModel/dataModel.vue'),
        meta: { title: '数据建模', icon: 'education' }
      }
      // {
      //   path: 'dataDictionary',
      //   name: 'dataDictionary',
      //   component: () => import('@/views/datax/dataCollect/index'),
      //   meta: { title: '数据字典', icon: 'shujujiguanli' }
      // },
    ]
  },
  {
    path: '/asset',
    component: Layout,
    redirect: '/asset',
    name: 'asset',
    meta: { title: '数据资产', icon: 'excel' },
    children: [
      {
        path: 'design',
        name: 'design',
        component: () => import('@/views/dataModel/dataModel.vue'),
        meta: { title: '数据资产', icon: 'education' }
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
  {
    path: '/dataMask',
    component: Layout,
    redirect: '/dataMask',
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/dataExplore/index.vue'),
        meta: { title: '数据脱敏', icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data',
    name: 'dataShare',
    meta: { title: '数据共享', icon: 'work' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/dataShare/interfaceList.vue'),
        meta: { title: '接口列表', icon: 'business' }
      },
      {
        path: 'viewRegister',
        name: 'viewRegister',
        component: () => import('@/views/dataShare/viewRegister.vue'),
        meta: { title: '接口详情', icon: 'chuangjiangongdan' },
        hidden: true
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/dataShare/register.vue'),
        meta: { title: '接口注册', icon: 'chuangjiangongdan' }
      },
      {
        path: 'registerAudit',
        name: 'registerAudit',
        component: () => import('@/views/dataShare/registerAudit.vue'),
        meta: { title: '注册审批', icon: 'chuangjiangongdan' }
      },
      {
        path: 'debug',
        name: 'debug',
        component: () => import('@/views/dataShare/debug.vue'),
        meta: { title: '接口调试', icon: 'business' }
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
    path: '/data-analysis',
    component: Layout,
    redirect: '/data-analysis/analysis',
    meta: { title: '数据分析', icon: 'work' },
    children: [
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('@/views/data-analysis/index'),
        meta: { title: '数据分析', icon: 'fenxi' }
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
