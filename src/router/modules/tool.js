/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

// 工具一路径，后面再改名

const toolRouter = {
  path: '/tool',
  component: Layout,
  redirect: 'noRedirect',
  name: '工具',
  meta: {
    title: '工具',
    icon: 'icon_svg16'
  },
  children: [
    {
      path: 'jsonFormat',
      component: () => import('@/views/tool/jsonFormat'),
      name: 'MixChart',
      meta: { title: 'Formatter', noCache: false }
    }
  ]
}

export default toolRouter
