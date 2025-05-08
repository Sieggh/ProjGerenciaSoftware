import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/Login.vue'
import RegisterView from '../view/Register.vue'
import MenuView from '../view/Menu.vue'
import EditProfileView from '../view/EditProfile.vue'
import ProfileView from '../view/Profile.vue'

const routes = [
  { path: '/', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/menu', component: MenuView },
  { path: '/editprofile', component: EditProfileView },
  { path: '/profile', component: ProfileView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteção de rota
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true';

  const publicPaths = ['/', '/register'];

  // Se já está logado, não deixa acessar login ou register
  if (isAuthenticated && publicPaths.includes(to.path)) {
    next('/menu');
  }
  else if (!isAuthenticated && !publicPaths.includes(to.path)) {
    next('/'); // redireciona para login
  } else {
    next();
  }
});


export default router