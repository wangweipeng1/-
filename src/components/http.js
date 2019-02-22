import axios from 'axios'
import { Message } from 'element-ui'
const HttpServer = {}
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    console.log('拦截器被触发----')
    if (config.url !== 'login') {
      const token = localStorage.getItem('token')
      // axios.defaults.headers.common['Authorization'] = token
      config.headers.Authorization = token
      // console.log(config)
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response, '---------')
    const {meta: {msg, status}} = response.data
    if (status !== 200 && status !== 201) {
      Message.error(msg)
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });


  Vue.prototype.$http = axios
}
export default HttpServer
