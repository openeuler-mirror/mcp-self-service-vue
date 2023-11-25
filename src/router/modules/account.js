// 账号设置
import Layout from '@/layout'
const accountRouter = {
  path: '/account',
  component: Layout,
  children: [{
    path: 'index',
    name: 'account',
    component: () => import('@/views/account/index'),
    meta: { title: '账号设置', icon: 'el-icon-setting' }
  }]
}
export default accountRouter
