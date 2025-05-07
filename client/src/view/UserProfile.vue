<template>
    <div class="profile-container" v-if="user">
      <h2>Perfil do Usuário</h2>
      <form @submit.prevent="updateProfile">
        <input v-model="user.name" type="text" placeholder="Nome" />
        <input v-model="user.email" type="email" placeholder="E-mail" disabled />
        <input v-model="user.phone" type="text" placeholder="Telefone" />
        <input v-model="user.city" type="text" placeholder="Cidade" />
        <input v-model="user.age" type="number" placeholder="Idade" />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfile',
    data() {
      return {
        user: null
      };
    },
    async created() {
      try {
        const email = localStorage.getItem('userEmail'); // Simples persistência
        const response = await fetch(`http://localhost:3000/api/users/${email}`);
        const data = await response.json();
        if (response.ok) {
          this.user = data;
        } else {
          alert(data.error);
        }
      } catch (err) {
        alert('Erro ao carregar perfil');
        console.error(err);
      }
    },
    methods: {
      async updateProfile() {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${this.user.email}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.user)
          });
  
          const data = await response.json();
          if (response.ok) {
            alert('Perfil atualizado com sucesso!');
          } else {
            alert(data.error);
          }
        } catch (err) {
          alert('Erro ao atualizar perfil');
          console.error(err);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
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
  