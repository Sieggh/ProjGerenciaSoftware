<template>
    <div>
      <h1>Bem-vindo!</h1>
      <button @click="logout">Sair</button>
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
  button {
    margin-top: 20px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  