import request from '@/utils/request'

export function getGroupList(data) {
  return request({
    url: '/api/v1/group/groupList',
    method: 'post',
    data
  })
}

export function groupSave(data) {
  return request({
    url: '/api/v1/group/store',
    method: 'post',
    data
  })
}

export function groupDelete(data) {
  return request({
    url: '/api/v1/group/delete',
    method: 'post',
    data
  })
}

export function getRoleList(data) {
  return request({
    url: '/api/v1/role/roleList',
    method: 'post',
    data
  })
}

export function roleSave(data) {
  return request({
    url: '/api/v1/role/store',
    method: 'post',
    data
  })
}

export function roleDelete(data) {
  return request({
    url: '/api/v1/role/delete',
    method: 'post',
    data
  })
}

export function getRoleNodelist(data) {
  return request({
    url: '/api/v1/access/roleNodelist',
    method: 'post',
    data
  })
}

export function roleNodeSave(data) {
  return request({
    url: '/api/v1/access/roleNodeSave',
    method: 'post',
    data
  })
}

export function getNodeList(data) {
  return request({
    url: '/api/v1/node/nodeList',
    method: 'post',
    data
  })
}

export function nodeSave(data) {
  return request({
    url: '/api/v1/node/store',
    method: 'post',
    data
  })
}

export function nodeDelete(data) {
  return request({
    url: '/api/v1/node/delete',
    method: 'post',
    data
  })
}

