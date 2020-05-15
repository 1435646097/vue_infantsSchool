import Vue from 'vue'
import VueRouter from 'vue-router'
import notFind from '../components/404.vue'
import Welcome from '../components/Welcom.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Role from '../components/Home/Role.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/Login',
    component: Login
  },
  {
    path: '/',
    redirect: '/Login'
  },
  {
    path: '/Home',
    component: Home,
    redirect: '/Welcome',
    children: [
      {
        path: '/Welcome',
        component: Welcome,
        meta: { title: '欢迎页' }
      },
      {
        path: '/Role',
        component: Role,
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '*',
    component: notFind
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   const token = window.sessionStorage.getItem('token')
//   console.log(token)
//   //去login
//   if (to.path == '/login') {
//     if (token != null) {
//       return next('/home')
//     }
//     return next()
//   }
//   //不去login
//   if (token == null) {
//     return next('/login')
//   }
//   return next()
// })
export default router
