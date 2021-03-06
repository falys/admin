import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'home',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/home/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    name: 'user',
    children: [{
      path: 'index',
      name: 'user_index',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'people' }
    }]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: { title: '权限管理', icon: 'permission' },
    children: [
      {
        path: 'group',
        name: 'group',
        component: () => import('@/views/permission/grouplist'),
        meta: { title: '用户组管理', icon: 'group' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/permission/role'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'node',
        name: 'node',
        component: () => import('@/views/permission/nodes'),
        meta: { title: '权限管理', icon: 'permission' }
      },
      {
        path: 'authallocate/:role_id',
        name: 'authallocate',
        component: () => import('@/views/permission/authallocate'),
        meta: { title: '权限分配' }, hidden: true
      }
    ]
  },
  { path: '*', name: '404', redirect: '/404', hidden: true }
]

