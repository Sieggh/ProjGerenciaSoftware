<template>
  <div class="back-button">
    <button @click="$router.back()">← Voltar</button>
  </div>
  <div class="back-button">
    <button @click="$router.push('/menu')">Menu</button>
  </div>
    <div class="profile-container" v-if="user">
      <div class="profile-header">
        <img
          :src="profileImageUrl"
          alt="Foto de perfil"
          class="profile-image"
        />
        <div class="profile-info">
          <h2>{{ user.username }}</h2>
          <div class="user-name">{{ user.name }}</div>
          <div class="user-bio">{{ user.bio }}</div>
        </div>
      </div>
    </div>
    <div v-else class="loading">Carregando perfil...</div>
    <hr class="divider" />

    <div class="no-posts-section">
      <img src="/sem-publi.png" alt="Sem publicações" class="no-posts-image" />
      <p class="no-posts-text">Não há publicações</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfileView',
    data() {
      return {
        user: null
      }
    },
    computed: {
      profileImageUrl() {
        if (!this.user) return '';
        return this.user.profileImage
          ? `http://localhost:3000/uploads/${this.user.profileImage}`
          : '/default-avatar.jpg';
      }
    },
    async mounted() {
      const username = this.$route.params.username;
      try {
        const res = await fetch(`http://localhost:3000/api/users/public-profile?username=${username}`);
        if (!res.ok) throw new Error('Usuário não encontrado');
        this.user = await res.json();
      } catch (err) {
        console.error(err);
        this.user = null;
      }
    }
  }
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
  }
  
  .profile-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .profile-info h2 {
    font-size: 24px;
    font-weight: bold;
  }
  
  .user-name {
    font-weight: 600;
    margin-top: 5px;
  }
  
  .user-bio {
    font-style: italic;
    color: #555;
    margin-top: 10px;
  }
  
  .loading {
    text-align: center;
    margin-top: 100px;
    font-size: 18px;
  }

  .divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 40px 0 20px;
}

.no-posts-section {
  text-align: center;
  color: #777;
}

.no-posts-image {
  width: 80px;
  height: auto;
  margin-bottom: 10px;
}

.no-posts-text {
  font-size: 16px;
}
  </style>
  