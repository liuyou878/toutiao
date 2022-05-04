// 保存token
export const saveToken = (token, key = 'token') => {
  localStorage.setItem(key, token)
}
// 获取token
export const getToken = (key) => {
  return localStorage.getItem(key)
}
// 删除token
export const removeToken = (key) => {
  return localStorage.removeItem(key)
}
