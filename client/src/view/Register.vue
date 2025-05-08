<template>
  <div class="back-button">
    <button @click="$router.back()">← Voltar</button>
  </div>
    <div class="form-container">
      <h2>Cadastro</h2>
      <form @submit.prevent="register">
        <input v-model="user.name" type="text" placeholder="Nome" required />
        <input v-model="user.username" type="text" placeholder="Nome de usuário" required />
        <input v-model="user.email" type="email" placeholder="E-mail" required />
        <input v-model="user.password" type="password" placeholder="Senha" required />
        <input v-model="user.phone" type="text" placeholder="Telefone" required />
        <input v-model="user.city" type="text" placeholder="Cidade" required />
        <input v-model="user.age" type="number" placeholder="Idade" required />
        Foto do perfil:
        <input type="file" @change="handleFileUpload" required />
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
          username: '',
          email: '',
          password: '',
          phone: '',
          city: '',
          age: ''
        },
        imageFile: null
      };
    },
    methods: {
      handleFileUpload(event) {
        this.imageFile = event.target.files[0];
      },
      async register() {
        const formData = new FormData();
        for (const key in this.user) {
          formData.append(key, this.user[key]);
        }
        if (this.imageFile) {
          formData.append('profileImage', this.imageFile);
        }

        const res = await fetch('http://localhost:3000/api/users/register', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

          if (res.ok) {
            alert(data.message);
            localStorage.setItem('auth', 'true');
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userImage', data.user.profileImage || '');
            this.$router.replace('/menu');
          } else {
            alert(data.error || 'Erro ao cadastrar.');
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
  