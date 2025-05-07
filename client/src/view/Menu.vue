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
    methods: {
      logout() {
        localStorage.removeItem('auth')
        this.$router.push('/')
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