import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import { routes } from './routes'
import TokenTool from '@/utils/TokenTool'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const toolObj = new TokenTool()

const handleAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.meta.requiresAuth) {
    // 如果目标路由有权限
    if (localStorage.type === 'user' && to.meta.role === 'user') {
      // 普通用户
      next()
    }
    else if (localStorage.type === 'admin' && to.meta.role === 'admin') {
      // 管理员
      next()
    }
    else {
      next('/no-auth')
    }
  }
  else {
    // 目标路由无权限则放行
    next()
  }
}

// 路由导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !toolObj.IsEmpty(localStorage.getItem('token'))

  NProgress.start()
  if (isAuthenticated) { // 已登录
    const expDate = localStorage.getItem('expDate') as string
    const currDate = toolObj.GetDate()
    if (to.path === '/login') {
      if (expDate >= currDate) {
        next()
      }
      else { // 登录过期即清除本地缓存
        toolObj.ClearLocalStorage()
        next()
      }
    }
    else { // 跳转其他路径，过期即清除本地缓存，且强制跳转登陆页面
      if (expDate < currDate) {
        ElMessage.warning('Login has expired, please login again')
        toolObj.ClearLocalStorage()

        // 给用户以缓冲
        window.setInterval(() => {
          next('/login')
        }, 1000)
      }
      else {
        handleAuth(to, from, next)
      }
    }
  }
  else { // 未登录
    // 增加判断以防止重定向，next('/login')表示强制跳转页面会进行重新判断，next则放行
    if (to.path === '/login' || to.path === '/register') {
      next()
    }
    else if (to.path.startsWith('/invite')) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    }
    else {
      next('/login')
    }
  }
})

router.afterEach(_to => {
  NProgress.done()
})
export { router }
