import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/api/v1/user/getPagingList',
    method: 'post',
    data
  })
}
