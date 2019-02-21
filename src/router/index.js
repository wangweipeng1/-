import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Params from '@/components/params.vue'
import Categories from '@/components/categories.vue'
import Orders from '@/components/orders.vue'
import Reports from '@/components/reports.vue'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'users',
        path: '/users',
        component: Users
      }, {
        name: 'rights',
        path: '/rights',
        component: Rights
      }, {
        name: 'roles',
        path: '/roles',
        component: Roles
      }, {
        name: 'goods',
        path: '/goods',
        component: Goods
      }, {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      }, {
        name: 'params',
        path: '/params',
        component: Params
      }, {
        name: 'categories',
        path: '/categories',
        component: Categories
      }, {
        name: 'orders',
        path: '/orders',
        component: Orders
      }, {
        name: 'reports',
        path: '/reports',
        component: Reports
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('路由守卫执行')
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }
})
export default router
