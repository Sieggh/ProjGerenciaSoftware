<template>
    <div>
        <button @click="this.$router.push('/profile')">Perfil</button>
        <button @click="logout">Sair</button>  
      <div class="menu-content">
        <h2>Bem-vindo ao Menu Principal</h2>
        <p>Escolha uma opção no menu acima.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuView',
    mounted() {
      // Limpa o histórico anterior e evita voltar para login
      history.pushState(null, null, location.href);
      window.addEventListener('popstate', this.preventBack);
    },
    beforeUnmount() {
      window.removeEventListener('popstate', this.preventBack);
    },
    methods: {
      preventBack() {
        history.pushState(null, null, location.href);
      },
      logout() {
        localStorage.removeItem('auth');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userImage');
        this.$router.push('/');
      }
    }
    
  }
  </script>
  
  <style scoped>
  .menu-content {
    text-align: center;
    margin-top: 50px;
  }
  
</style>