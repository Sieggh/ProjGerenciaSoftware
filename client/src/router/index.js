import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/Login.vue'
import RegisterView from '../view/Register.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
