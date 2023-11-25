import request from '@/utils/request'

// 工单列表查询
export function getWorkOrderList(data) {
    return request({
        url: '/workOrder/pageWorkOrder',
        method: 'post',
        data
    })
}

// 申请云服务器
export function getApplyServerVmDetail(data) {
    return request({
        url: '/workOrder/applyServerVmDetail',
        method: 'post',
        data
    })
}

// 变更云服务器
export function getModifyServerVmDetail(data) {
    return request({
        url: '/workOrder/modifyServerVmDetail',
        method: 'post',
        data
    })
}

// 延期云服务器
export function getApplyDeferredDetail(data) {
    return request({
        url: '/workOrder/applyDeferredDetail',
        method: 'post',
        data
    })
}

// 注册账号
export function getRegisterUserDetail(data) {
    return request({
        url: '/workOrder/registerUserDetail',
        method: 'post',
        data
    })
}

// 修改账号
export function getUpdateUserDetail(data) {
    return request({
        url: '/workOrder/updateUserDetail',
        method: 'post',
        data
    })
}