import request from '@/utils/request'


// 获取组织列表
export function getOrganizationList(data) {
  return request({
    url: '/org/queryOrgList',
    method: 'post',
    data
  })
}
// 注册
export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

// 修改姓名
export function updateRealName(data) {
  return request({
    url: '/user/updateRealName',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: '/user/updatePwd',
    method: 'post',
    data
  })
}
