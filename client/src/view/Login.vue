<template>
    <div class="container">
      <h1>Vai escolhendo aí</h1>
      <button @click="$router.push('/login')">Fazer Login</button>
      <button @click="$router.push('/register')">Cadastrar-se</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView'
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
  }
  button {
    margin: 10px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  