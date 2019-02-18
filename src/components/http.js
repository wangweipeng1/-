import axios from 'axios'
const HttpServer = {}
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    console.log('拦截器被触发----')
    if (config.url !== 'login') {
      const token = localStorage.getItem('token')
      // axios.defaults.headers.common['Authorization'] = token
      config.headers.Authorization = token
      console.log(config, 111)
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  Vue.prototype.$http = axios
}
export default HttpServer
