import request from '@/utils/request'

export function groupOptionsList() {
  return request({
    url: '/api/v1/group/optionslist',
    method: 'get'
  })
}
