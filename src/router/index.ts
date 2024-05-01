import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'elevator-easy',
      component: () => import('../views/ElevatorEasyView.vue')
    },
    {
      path: '/hard',
      name: 'elevator-hard',
      component: () => import('../views/ElevatorHardView.vue')
    }
  ]
})

export default router
