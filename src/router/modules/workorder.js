// 工单管理
import Layout from '@/layout'
const workorderRouter = {
  path: '/workorder',
  component: Layout,
  meta: { title: '工单管理' },
  redirect: '/workorder/index',
  children: [
    {
      path: 'index',
      name: 'workorder',
      component: () => import('@/views/workorder/index'),
      meta: { title: '工单管理', icon: 'el-icon-s-order', default: true }
    },
    {
      path: 'detail/:id/:type',
      name: 'workDetail',
      hidden: true,
      component: () => import('@/views/workorder/detail'),
      meta: { title: '工单详情' }
    }
  ]
}
export default workorderRouter
