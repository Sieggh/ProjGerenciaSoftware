<template>
    <div class="profile">
      <h2>Editar Perfil</h2>
      
      <label>Nome</label>
      <input v-model="editableUser.name" type="text" />
  
      <label>Telefone</label>
      <input v-model="editableUser.phone" type="text" />
  
      <label>Cidade</label>
      <input v-model="editableUser.city" type="text" />
  
      <label>Idade</label>
      <input v-model="editableUser.age" type="number" />
  
      <button :disabled="!isModified" @click="saveBasicChanges">Salvar alterações</button>
      <button @click="cancelEditingBasic">Cancelar</button>
  
      <hr/>

      <h3>Dados de acesso</h3>

        <label>E-mail</label>
        <input
        :readonly="editingField !== 'email'"
        v-model="editableUser.email"
        type="email"
        />

        <label>Nova senha</label>
        <input
        :readonly="editingField !== 'password'"
        v-model="editableUser.password"
        type="password"
        />

        <div v-if="!editingField">
        <button @click="startEditing('email')">Alterar e-mail</button>
        <button @click="startEditing('password')">Alterar senha</button>
        </div>

        <div v-else>
        <button v-if="editingField === 'email'" @click="updateEmail">Salvar e-mail</button>
        <button v-if="editingField === 'password'" @click="updatePassword">Salvar senha</button>
        <button @click="cancelEditing">Cancelar</button>
        </div>

        <hr />

        <button class="danger" @click="confirmDeleteAccount">Excluir conta</button>

    </div>

</template>
  
<script>
  export default {
    name: 'ProfileView',
    data() {
      return {
        originalUser: {
          name: '',
          phone: '',
          city: '',
          age: '',
          email: '',
          password: ''
        },
        editableUser: {},
        editingField: null
      }
    },
    computed: {
      isModified() {
        return (
          this.editableUser.name !== this.originalUser.name ||
          this.editableUser.phone !== this.originalUser.phone ||
          this.editableUser.city !== this.originalUser.city ||
          this.editableUser.age !== this.originalUser.age
        );
      }
    },
    methods: {
      async fetchUser() {
        const email = localStorage.getItem('userEmail');
        const res = await fetch(`http://localhost:3000/api/users/me?email=${email}`);
        const user = await res.json();
        
        console.log('Usuário carregado:', user); // Debug
        
        this.originalUser = { ...user }; 
        this.editableUser = { ...user };
      },
      
      async saveBasicChanges() {
        const res = await fetch('http://localhost:3000/api/users/update-basic', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editableUser)
        });
  
        const data = await res.json();
        if (res.ok) {
          alert('Dados atualizados com sucesso!');
          this.originalUser = { ...this.editableUser };
        } else {
          alert(data.error || 'Erro ao atualizar');
        }
      },
      cancelEditingBasic() {
        this.editableUser = { ...this.originalUser };
      },
      
    startEditing(field) {
        this.editingField = field;
    },
    cancelEditing() {
        this.editingField = null;
        this.editableUser.email = this.originalUser.email;
        this.editableUser.password = '';
    },
    async updateEmail() {
        const confirmacao = confirm('Deseja realmente alterar o e-mail?');
        if (!confirmacao) return;

        const res = await fetch('http://localhost:3000/api/users/update-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currentEmail: this.originalUser.email,
            newEmail: this.editableUser.email
        })
        });

        const data = await res.json();
        if (res.ok) {
        alert(data.message);
        this.originalUser.email = this.editableUser.email;
        localStorage.setItem('userEmail', this.editableUser.email);
        this.editingField = null;
        } else {
        alert(data.error || 'Erro ao atualizar e-mail');
        }
    },
    async updatePassword() {
        const confirmacao = confirm('Deseja realmente alterar a senha?');
        if (!confirmacao) return;

        const res = await fetch('http://localhost:3000/api/users/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: this.originalUser.email,
            newPassword: this.editableUser.password
        })
        });

        const data = await res.json();
        if (res.ok) {
        alert(data.message);
        this.editingField = null;
        this.editableUser.password = '';
        } else {
        alert(data.error || 'Erro ao atualizar senha');
        }
    },
    async confirmDeleteAccount() {
        const confirmar = confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');

        if (!confirmar) return;

        const res = await fetch('http://localhost:3000/api/users/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            email: this.originalUser.email
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Conta excluída com sucesso.');
            localStorage.removeItem('auth');
            localStorage.removeItem('userEmail');
            this.$router.push('/');
        } else {
            alert(data.error || 'Erro ao excluir conta.');
        }
        }
    },
    mounted() {
      this.fetchUser();
    }
  }
</script>
  
<style scoped>
  .profile {
    max-width: 500px;
    margin: 40px auto;
    display: flex;
    flex-direction: column;
  }
  input {
    margin-bottom: 10px;
    padding: 8px;
  }
  button {
    margin-top: 10px;
    padding: 10px;
  }
  input[readonly] {
    background-color: #f0f0f0;
    color: #888;
    cursor: not-allowed;
    border: 1px solid #ccc;
    }
</style>
  