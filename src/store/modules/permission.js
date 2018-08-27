import { asyncRouterMap, constantRouterMap } from '@/router'
import { getButtons, getRoutes } from '@/api/login'
import { in_array } from '@/utils'

// /**
//  * 通过meta.role判断是否与当前用户权限匹配
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, navlist) {
  const accessedRouters = []
  for (var item of asyncRouterMap) {
    for (const v of navlist) {
      if (v.name === item.name) {
        if (item.children && item.children.length) {
          for (var i = 0; i < item.children.length; i++) {
            if (!in_array(item.children[i].path, v.children) && item.children[i].hidden !== true) {
              item.children.splice(i, 1)
            }
          }
        }
        accessedRouters.push(item)
        continue
      }
    }
    if (item.name === '404') {
      accessedRouters.push(item)
    }
  }
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    navs: [],
    buttons: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getRoutes().then(response => {
          const navList = response.data
          const accessedRouters = filterAsyncRouter(asyncRouterMap, navList)
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        })
      })
    },
    GetButtons({ commit, state }) {
      return new Promise((resolve, reject) => {
        getButtons().then(response => {
          const data = response.data
          commit('SET_BUTTONS', data)
        })
      })
    }
  }
}

export default permission
