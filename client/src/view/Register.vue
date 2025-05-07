<template>
    <div class="form-container">
      <h2>Cadastro</h2>
      <form @submit.prevent="register">
        <input v-model="user.name" type="text" placeholder="Nome" required />
        <input v-model="user.email" type="email" placeholder="E-mail" required />
        <input v-model="user.password" type="password" placeholder="Senha" required />
        <input v-model="user.phone" type="text" placeholder="Telefone" required />
        <input v-model="user.city" type="text" placeholder="Cidade" required />
        <input v-model="user.age" type="number" placeholder="Idade" required />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'RegisterView',
    data() {
      return {
        user: {
          name: '',
          email: '',
          password: '',
          phone: '',
          city: '',
          age: ''
        }
      };
    },
    methods: {
      async register() {
        try {
          const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.user)
          });
  
          const data = await response.json();
          if (response.ok) {
            alert(data.message);
            localStorage.setItem('auth', 'true');
            this.$router.push('/menu');
          } else {
            alert(data.error || 'Erro ao cadastrar.');
          }
        } catch (err) {
          alert('Erro na requisição.');
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 400px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
  }
  input, button {
    margin: 10px 0;
    padding: 10px;
  }
  </style>
  