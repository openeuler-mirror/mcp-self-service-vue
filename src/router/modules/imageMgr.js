// 镜像管理
import Layout from '@/layout'
const imageMgr = {
    path: '/imageMgr',
    component: Layout,
    meta: { title: '镜像管理' },
    redirect: '/imageMgr',
    children: [
        {
            path: '/imageMgr',
            name: 'imageMgr',
            component: () => import('@/views/imageMgr/index'),
            meta: { title: '镜像管理', icon: 'el-icon-cloudy', default: true }
        },
        {
            path: '/imageMgr/components/imageupload',
            name: 'imageupload',
            routeKey: 'servervm',
            hidden: true,
            noRedirect: '',
            component: () => import('@/views/imageMgr/components/imageupload.vue'),
            meta: {
                title: '上传镜像', // '上传镜像',
                icon: 'el-icon-s-order', default: false, routeKey: 'servervm'
            }
        },
        {
            path: '/imageMgr/components/imageuploading',
            name: 'imageuploading',
            routeKey: 'servervm',
            hidden: true,
            noRedirect: '',
            component: () => import('@/views/imageMgr/components/imageuploading.vue'),
            meta: {
                title: '上传镜像', // '上传镜像',
                icon: 'el-icon-s-order', default: false, routeKey: 'servervm'
            }
        },
        {
            path: 'detail/:id/:type',
            name: 'imageDetail',
            routeKey: 'servervm',
            hidden: true,
            noRedirect: '',
            component: () => import('@/views/imageMgr/components/imageDetail.vue'),
            meta: {
                title: '详情镜像', // '详情镜像',
                icon: 'el-icon-s-order', default: false, routeKey: 'servervm'
            }
        },
    ]
}
export default imageMgr
