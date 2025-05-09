<template>
    <div>
        <button @click="this.$router.push('/profile')">Perfil</button>
        <button @click="logout">Sair</button>  
      <div class="menu-content">
        <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          @input="searchUsers"
          placeholder="Buscar usuários..."
        />
        <ul v-if="searchResults.length" class="search-results">
          <li v-for="user in searchResults" :key="user._id" @click="goToUserProfile(user.username)">
            <img :src="`http://localhost:3000/uploads/${user.profileImage}`" alt="foto" class="search-avatar" />
            <span>{{ user.username }}</span>
          </li>
        </ul>
      </div>
      </div>
    </div>

  </template>
  
  <script>
  export default {
    name: 'MenuView',
    data() {
      return {
        searchQuery: '',
        searchResults: []
      }
    },
    mounted() {
      // Limpa o histórico anterior e evita voltar para login
      history.pushState(null, null, location.href);
      window.addEventListener('popstate', this.preventBack);
    },
    beforeUnmount() {
      window.removeEventListener('popstate', this.preventBack);
    },
    methods: {
      preventBack() {
        history.pushState(null, null, location.href);
      },
      logout() {
        localStorage.removeItem('auth');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userImage');
        this.$router.push('/');
      },
      async searchUsers() {
        if (this.searchQuery.trim() === '') {
          this.searchResults = [];
          return;
        }

        const res = await fetch(`http://localhost:3000/api/users/search?q=${this.searchQuery}`);
        const data = await res.json();
        this.searchResults = data;
      },
      goToUserProfile(username) {
        this.$router.push(`/user/${username}`);
        this.searchQuery = '';
        this.searchResults = [];
      }
    }
    
  }
  </script>
  
  <style scoped>
  .menu-content {
    text-align: center;
    margin-top: 50px;
  }
  .search-bar {
  position: relative;
  max-width: 400px;
  margin: 0 auto;
}

.search-results {
  position: absolute;
  background: white;
  list-style: none;
  padding: 10px;
  width: 100%;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 1000;
}

.search-results li {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}

.search-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}
  
</style>