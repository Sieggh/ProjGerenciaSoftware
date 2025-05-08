<template>
    <div class="container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="E-mail"  required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
  
      <p>Ainda não tem conta?</p>
      <button @click="$router.push('/register')">Cadastrar-se</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        email: 'adm@adm.com', //deixar vazio depois ''
        password: '123456' //deixar vazio depois ''
      }
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          });
  
          const data = await response.json();
  
            if (!response.ok) {
                alert(data.error || 'Falha no login');
                return;
            }

            localStorage.setItem('auth', 'true');
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userImage', data.user.profileImage || '');
            this.$router.replace('/menu');
        } catch (err) {
          console.error(err);
          alert('Erro na requisição de login');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input, button {
    margin: 10px 0;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
  }
  </style>