import { login, refreshToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.type).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          setToken(data.username)
          commit('SET_USERNAME', data.token)
          sessionStorage.setItem('username', data.username)
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('token_expire', data.token_expire)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    refreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = sessionStorage.getItem('token')
        refreshToken(token).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          resolve()
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('token_expire', data.token_expire)
        }).catch(error => {
          reject(error)
        })
      })
    },

    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      sessionStorage.removeItem('token_expire')
      removeToken()
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
