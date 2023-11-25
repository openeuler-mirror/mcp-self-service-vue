
import request from '@/utils/request'

// 根据操作对象获取操作日志
export function monitoringList(data) {
    return request({
        url: '/monitoring/machineExpireList',
        method: 'post',
        data
    })
}