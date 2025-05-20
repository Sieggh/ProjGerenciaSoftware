<template>
  <!-- ALTERAÇÃO -->
  <div class="wrapper" :class="{ shrink: transitioning }"> <!-- ALTERAÇÃO -->
    <div class="backGround"> <!-- ALTERAÇÃO -->
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
          <p>Foto do perfil:</p>
          <input type="file" @change="handleFileUpload" required />
          <button type="submit">Cadastrar</button>
        </form>
        <div class="back-button">
          <!-- ALTERAÇÃO -->
          <button @click="goBack">← Voltar</button> <!-- ALTERAÇÃO -->
        </div>
      </div>
    </div> <!-- ALTERAÇÃO -->
  </div> <!-- ALTERAÇÃO -->
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
      imageFile: null,
      transitioning: false // ← ALTERAÇÃO
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
    },
    goBack() { // ← ALTERAÇÃO
      this.transitioning = true; // ← ALTERAÇÃO
      setTimeout(() => { // ← ALTERAÇÃO
        this.$router.push('/login'); // ← ALTERAÇÃO
      }, 500); // ← ALTERAÇÃO
    } // ← ALTERAÇÃO
  }
};
</script>

<style scoped>
/* ORIGINAIS */
.form-container {
  max-width: 400px;
  display: flex;
  flex-direction: column;
}
input, button {
  margin: 10px 0;
  padding: 10px;
}

/* ALTERAÇÃO */
.wrapper {
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  display: flex;
  transition: all 0.5s ease-in-out;
}

.backGround {
  flex: 1 1 100%;
  background: linear-gradient(to right, #0e246b, #8ba6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
}

.wrapper.shrink .backGround {
  flex: 0 0 30%;
}

input, button {
  margin: 0.5rem 0;
  padding: 0.75rem;
  width: 100%;
  border-radius: 8px;
  border: none;
  box-sizing: border-box;
}

button{
  font-weight: 500;
}

input, button:hover{
  cursor: pointer;
}

button:hover{
  background-color: #cbcbcb;
}

h2, p{
  color: aliceblue;
  font-weight: 700;
  text-align: center;
}

</style>
