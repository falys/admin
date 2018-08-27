import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/v1/user/getPagingList',
    method: 'post',
    data
  })
}

export function userStore(data) {
  return request({
    url: '/api/v1/user/store',
    method: 'post',
    data
  })
}

export function userDelete(data) {
  return request({
    url: '/api/v1/user/delete',
    method: 'post',
    data
  })
}

export function statusChange(data) {
  return request({
    url: '/api/v1/user/statusChange',
    method: 'post',
    data
  })
}
