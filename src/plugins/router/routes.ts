export const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('@/pages/auth/login.vue'),
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('@/pages/auth/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/common/[...error].vue'),
      },
      {
        path: 'no-existence',
        component: () => import('@/pages/common/[...error].vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/common/[...error].vue'),
      },
    ],
  },
  {
    name: 'Project',
    path: '/admin',
    component: () => import('@/layouts/horizontal.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        name: 'Project',
        path: 'project',
        component: () => import('@/pages/project/project.vue'),
      },
      {
        name: 'ProjectDetail',
        path: 'project/detail',
        component: () => import('@/pages/project/projectDetail.vue'),
      },
      {
        name: 'Scenario',
        path: 'scenario',
        component: () => import('@/pages/scenario/scenario.vue'),
      },

      /* { // UUID型
        name: '数据项',
        path: 'item/:uuid',
        component: () => import('@/pages/share/item.vue'),
        props: true,
      }, */
    ],
  },
  {
    path: '/user',
    component: () => import('@/layouts/horizontal.vue'),
    meta: { requiresAuth: true, role: 'user' },
    children: [],
  },
]
