<template>
  <div class="wrap">
    <div class="sideBar">
        <div class="logo">
          <img src="/foodLogo.png" class="logo-img" />
          <span>Nothser</span>
        </div>
        <div class="menu-buttons">
          <button @click="$router.push('/profile')">Perfil</button>
          <hr />
          <button @click="$router.push('/menu')">Início</button>
        </div>
      </div>
      <div class="profileColumn">
      <div class="profile-container" v-if="user">
        <div class="profile-header">
          <img :src="profileImageUrl" alt="Foto de perfil" class="profile-image" />
          <div class="profile-info">
            <div class="top-info">
              <h2>{{ user.username }}</h2>
            </div>
            <div class="user-name">{{ user.name }}</div>
            <div class="user-bio">{{ user.descricao }}</div>
          </div>
        </div>
      </div>
      <div v-else class="loading">Carregando perfil...</div>
      <hr class="divider" />

      <div class="no-posts-section">
        <img src="/sem-publi.png" alt="Sem publicações" class="no-posts-image" />
        <p class="no-posts-text">Não há publicações</p>
      </div>
    </div>
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
  .profileColumn{
  width: 80%;
  }
  .wrap {
  display: flex;
  min-height: 100vh;
  font-family: sans-serif;
  }

.sideBar {
  width: 220px;
  padding: 20px 10px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  font-size: 20px;
  margin-left: 10px;
}

.logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.menu-buttons button {
  all: unset;
  padding: 10px 15px;
  margin-bottom: 10px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 16px;
  transition: background-color 0.2s;
}

.menu-buttons button:hover {
  background-color: #f0f0f0;
}

.menu-buttons hr {
  width: 90%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px auto;
}

.menu-content {
  flex: 1;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
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
  