// 云服务器
import Layout from '@/layout'
const ecsRouter = {
  path: '/',
  component: Layout,
  meta: { title: '云服务器' },
  redirect: '/ecs',
  children: [{
    path: 'ecs',
    name: 'ecs',
    component: () => import('@/views/ecs/index'),
    meta: { title: '云服务器', icon: 'el-icon-cloudy', default: true }
  },
  {
    path: 'ecs/detail/:serverVmUuid/:tab/:clusterId',
    name: 'serviceDetail',
    hidden: true,
    component: () => import('@/views/ecs/components/detail/index.vue'),
    meta: { title: '云服务器详情' }
  }]
}
export default ecsRouter
