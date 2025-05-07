<template>
    <div>
      <nav class="navbar">
        <span class="logo">Meu App</span>
        <ul class="nav-links">
          <li><a @click.prevent="$router.push('/profile')">Perfil</a></li>
          <!-- Adicione mais opções aqui se quiser -->
        </ul>
      </nav>
  
      <div class="menu-content">
        <h2>Bem-vindo ao Menu Principal</h2>
        <p>Escolha uma opção no menu acima.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MenuView'
  }
  </script>
  
  <style scoped>
  .navbar {
    background-color: #333;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    color: #fff;
  }
  .logo {
    font-weight: bold;
  }
  .nav-links {
    list-style: none;
    display: flex;
    gap: 20px;
  }
  .nav-links a {
    color: white;
    text-decoration: none;
    cursor: pointer;
  }
  .menu-content {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  