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
    // if the target router requires auth
    if (localStorage.type === 'user' && to.meta.role === 'user') {
      // normal user
      next()
    }
    else if (localStorage.type === 'admin' && to.meta.role === 'admin') {
      // admin user
      next()
    }
    else {
      next('/no-auth')
    }
  }
  else {
    // let it go when the target router doesn't require auth
    next()
  }
}

// before reaching the router
router.beforeEach((to, from, next) => {
  const isAuthenticated = !toolObj.IsEmpty(localStorage.getItem('token'))

  NProgress.start()
  if (isAuthenticated) { // already sign in
    const expDate = localStorage.getItem('expDate') as string
    const currDate = toolObj.GetDate()
    if (to.path === '/login') {
      if (expDate >= currDate) {
        next()
      }
      else { // clear localStorage when login expired
        toolObj.ClearLocalStorage()
        next()
      }
    }
    else { // if reaching the router except login
      if (expDate < currDate) {
        ElMessage.warning('Login has expired, please login again')
        toolObj.ClearLocalStorage()

        // slowly open a new page
        window.setInterval(() => {
          next('/login')
        }, 1000)
      }
      else {
        handleAuth(to, from, next)
      }
    }
  }
  else { // Not signed in
    // avoid redirect
    // next('/login') forces to enter the login/register page, and do the recheck, let it go when it's next().
    if (to.path === '/login' || to.path === '/register') {
      next()
    }

    // else if (to.path.startsWith('/invite')) {
    //   next({
    //     path: '/login',
    //     query: { redirect: to.fullPath },
    //   })
    // }

    // reaching the page with redirect parameter
    else if (!to.path.startsWith('/login') && !to.path.startsWith('/register')) {
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

// the animation when loading the new page
router.afterEach(_to => {
  NProgress.done()
})
export { router }
