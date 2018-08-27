import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
// import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  const token = sessionStorage.getItem('token')
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.buttons instanceof Array === false || store.getters.addRouters.length < 1) {
        store.dispatch('GetButtons')
      }
      if (store.getters.addRouters instanceof Array === false || store.getters.addRouters.length < 1) {
        store.dispatch('GenerateRoutes').then(() => {
          for (const v of store.getters.addRouters) {
            if (v.name !== 'home') {
              router.options.routes.push(v)
              router.addRoutes(router.options.routes)
            }
          }
          next({ ...to, replace: true })
          next()
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
