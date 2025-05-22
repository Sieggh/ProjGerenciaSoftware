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
        <button @click="logout">Sair</button>
      </div>
    </div>

    <div class="menu-content">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          @input="searchUsers"
          placeholder="Buscar usuários..."
          class="search-input"
        />
        <ul v-if="searchResults.length" class="search-results">
          <li
            v-for="user in searchResults"
            :key="user._id"
            @click="goToUserProfile(user.username)"
          >
            <img
              :src="`http://localhost:3000/uploads/${user.profileImage}`"
              alt="foto"
              class="search-avatar"
            />
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

.search-bar {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-results {
  position: absolute;
  background: white;
  list-style: none;
  padding: 10px;
  width: 100%;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.search-results li {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  transition: background-color 0.2s;
}

.search-results li:hover {
  background-color: #f9f9f9;
}

.search-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
