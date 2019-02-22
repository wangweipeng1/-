import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('@/components/login.vue')
const Home = () => import('@/components/home.vue')
const Users = () => import('@/components/users.vue')
const Rights = () => import('@/components/rights.vue')
const Roles = () => import('@/components/roles.vue')
const Goods = () => import('@/components/goods.vue')
const Goodsadd = () => import('@/components/goodsadd.vue')
const Params = () => import('@/components/params.vue')
const Categories = () => import('@/components/categories.vue')
const Orders = () => import('@/components/orders.vue')
const Reports = () => import('@/components/reports.vue')

import { Message } from 'element-ui'

Vue.use(VueRouter)

const router = new VueRouter({
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
