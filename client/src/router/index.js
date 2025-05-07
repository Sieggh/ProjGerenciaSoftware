import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/Login.vue'
import RegisterView from '../view/Register.vue'
import MenuView from '../view/Menu.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/menu', component: MenuView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rota
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true'
  if (to.path === '/menu' && !isAuthenticated) {
    next('/') // redireciona pro login
  } else {
    next() // segue normalmente
  }
})

export default router