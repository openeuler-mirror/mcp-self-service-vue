// 工单管理
import Layout from '@/layout'
const workorderRouter = {
  path: '/billDetails',
  component: Layout,
  meta: { title: '账单明细' },
  redirect: '/billDetails/index',
  children: [
    {
      path: 'index',
      name: 'billDetails',
      component: () => import('@/views/billDetails/index'),
      meta: { title: '账单明细', icon: 'el-icon-money', default: true }
    },
  ]
}
export default workorderRouter
