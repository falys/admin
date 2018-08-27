import request from '@/utils/request'

export function roleOptionsList() {
  return request({
    url: '/api/v1/role/optionslist',
    method: 'get'
  })
}
