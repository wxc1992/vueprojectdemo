import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// const Login = () =>
//   import( /* webpackChunkName: "Login" */ '@/components/Login')
// const Home = () =>
//   import( /* webpackChunkName: "Home" */ '@/components/Home')
// const User = () =>
//   import( /* webpackChunkName: "User" */ '@/components/user/Users')
Vue.use(Router)

const router =  new Router({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('path',to)
  if (to.matched.length == 0){
    // next('/error')
    next() //权限稍后弄
  } else {
    next()
  }
  // const token = localStorage.getItem('token');
  // const outerLogin = to.query.token||(to.query.oa_user&&to.query.oa_sign);
  // if (to.path === '/login' || token || outerLogin) {
  //   next()
  // } else {
  //   // alert('请先登录')
  //   next('/login')
  // }
})
router.afterEach(() => {
  NProgress.done()
})
export default router
