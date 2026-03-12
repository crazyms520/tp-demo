import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'inspection',
    component: () => import('@/views/InspectionFormDesktop.vue'),
    meta: { title: '配電工程帶料材料外觀抽查表' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} | TP Demo`
  }
})

export default router
