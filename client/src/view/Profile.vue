<template>
    <div class="back-button">
        <button @click="$router.back()">← Voltar</button>
    </div>
    <div class="back-button">
        <button @click="$router.push('/menu')">Menu</button>
    </div>
  <div class="profile-container">
    <div class="profile-header">
      <img
        :src="profileImageUrl"
        alt="Foto de perfil"
        class="profile-image"
      />
      <div class="profile-info">
        <div class="top-info">
          <h2>{{ user.username }}</h2>
          <button @click="$router.push('/editprofile')">Editar perfil</button>
        </div>
        <div class="user-name">{{ user.name }}</div>
        <div class="user-bio">{{ user.descricao }}</div>
      </div>
    </div>
  </div>
  <hr class="divider" />

    <div class="no-posts-section">
    <img src="/sem-publi.png" alt="Sem publicações" class="no-posts-image" />
    <p class="no-posts-text">Você ainda não tem nenhuma publicação</p>
    </div>
</template>

<script>
export default {
  name: 'ProfileView',
  data() {
    return {
      user: {
        name: '',
        username: '',
        descricao: '',
        profileImage: ''
      }
    };
  },
  computed: {
    profileImageUrl() {
      return this.user.profileImage
        ? `http://localhost:3000/uploads/${this.user.profileImage}`
        : '/default-avatar.jpg';
    }
  },
  methods: {
    async fetchUser() {
      const email = localStorage.getItem('userEmail');
      const res = await fetch(`http://localhost:3000/api/users/me?email=${email}`);
      const data = await res.json();
      this.user = data;
    }
  },
  mounted() {
    this.fetchUser();
  }
};
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

.top-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.top-info h2 {
  font-size: 24px;
  font-weight: bold;
}

.user-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.user-bio {
  font-style: italic;
  color: #555;
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
