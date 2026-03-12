import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'inspection-desktop',
    component: () => import('@/views/InspectionFormDesktop.vue'),
    meta: { title: '配電工程帶料材料外觀抽查表（桌面版）' },
  },
  {
    path: '/mobile',
    name: 'inspection-mobile',
    component: () => import('@/views/InspectionFormMobile.vue'),
    meta: { title: '配電工程帶料材料外觀抽查表（手機版）' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} | TAI Power Demo`
  }
})

export default router
