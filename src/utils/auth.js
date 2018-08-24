const TokenKey = 'token'

export function getToken() {
  return sessionStorage.getItem('token')
}

export function setToken(token) {
  sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem(TokenKey)
}
