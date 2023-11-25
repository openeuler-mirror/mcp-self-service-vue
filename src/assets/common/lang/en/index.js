import common from './common.js'
import serverVirtualization from './serverVirtualization'

export default {
    common,// 公共模块
    ...serverVirtualization // kcp及自服务云服务器详情-操作日志，参考mc将任务详情，和失败原因，进行国际化转移
}