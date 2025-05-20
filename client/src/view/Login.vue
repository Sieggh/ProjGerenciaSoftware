<template>
  <div class="wrapper" :class="{ expand: transitioning }">
    <div class="backGround">
      <div class="container">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="E-mail" required />
          <input v-model="password" type="password" placeholder="Senha" required />
          <button type="submit">Entrar</button>
        </form>
    
        <p>Ainda não tem conta?</p>
        <button @click="goToRegister">Cadastrar-se</button>
      </div>
    </div>
    <div class="rightImage">
      <img src="/login.jpg"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      transitioning: false,
      email: 'adm@adm.com', //deixar vazio depois ''
      password: '123456'     //deixar vazio depois ''
    }
  },
  methods: {
    goToRegister() {
      this.transitioning = true;
      setTimeout(() => {
        this.$router.push('/register');
      }, 500); // tempo igual ao da animação
    },
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
/* container geral full‐screen com flex em linha */
.wrapper {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  transition: all 0.5s ease-in-out;
}

.backGround {
  flex: 0 0 30%;
  background: linear-gradient(to right, #0e246b, #8ba6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
}

.rightImage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.rightImage img {
  width: 100%;
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 320px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

p {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
h1, p{
  color: aliceblue;
  font-weight: 700;
}
.wrapper.expand .backGround {
  flex: 1 1 100%;
}
.wrapper.expand .rightImage {
  display: none;
}
</style>