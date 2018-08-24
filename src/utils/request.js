import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import router from '@/router/index'

axios.defaults.retry = 3
axios.defaults.timeout = 10000

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = 'token ' + sessionStorage.getItem('token') // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    if (store.getters.token) {
      const expire = sessionStorage.getItem('token_expire') * 1000
      const current_time = new Date().getTime() - 1000 * 60 * 3
      if (current_time > expire) {
        store.dispatch('refreshToken').then(() => {
          console.log('refreshToken')
        })
      }
    }
    const res = response.data
    if (res.code !== 1) {
      // -100 Token 过期了;
      if (res.code === -100) {
        Message({
          message: '登录超时，请重新登录！',
          type: 'error',
          duration: 3 * 1000
        })
        setTimeout(() => {
          store.dispatch('LogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }, 3 * 1000)
      } else if (res.code === 1008) {
        const userid = res.data.userid
        const url = '/edit/' + userid
        console.log(url)
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
        setTimeout(() => {
          // window.location.href = url
          router.push({ path: url })
        }, 3 * 1000)
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    var config = error.config
    if (!config || !config.retry) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    config.__retryCount = config.__retryCount || 0

    if (config.__retryCount >= config.retry) {
      console.log('promise error:' + error)
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
    config.__retryCount += 1
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, config.retryDelay || 1)
    })

    return backoff.then(function() {
      return axios(config)
    })
  }
)

export default service
