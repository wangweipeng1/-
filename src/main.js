// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import moment from 'moment'
import HttpServer from './components/http'
import cusBread from '@/components/cusBread.vue'
Vue.use(ELEMENT)
Vue.use(HttpServer)

Vue.config.productionTip = false

Vue.component(cusBread.name, cusBread)

Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
