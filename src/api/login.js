import request from '@/utils/request'

export function login(username, password, type) {
  return request({
    url: '/api/v1/login',
    method: 'post',
    data: {
      username,
      password,
      type
    }
  })
}

export function refreshToken() {
  return request({
    url: '/api/v1/user/refreshToken',
    method: 'get'
  })
}

export function getButtons() {
  return request({
    url: '/api/v1/access/btnlist',
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/api/v1/access/navlist',
    method: 'get'
  })
}
