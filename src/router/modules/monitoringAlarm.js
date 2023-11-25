// 账号设置
import Layout from '@/layout'
const accountRouter = {
  path: '/monitoringAlarm',
  component: Layout,
  children: [{
    path: 'index',
    name: 'monitoringAlarm',
    component: () => import('@/views/monitoringAlarm/index'),
    meta: { title: '监控报警', icon: 'el-icon-bell' }
  }]
}
export default accountRouter
