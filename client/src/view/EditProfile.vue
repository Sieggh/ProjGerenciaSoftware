<template>
  <div class="back-button">
    <button @click="$router.back()">← Voltar</button>
  </div>
  <div class="back-button">
    <button @click="$router.push('/menu')">Menu</button>
  </div>
  <div class="profile-image-container">
    <img
      v-if="originalUser.profileImage"
      :src="`http://localhost:3000/uploads/${originalUser.profileImage}`"
      alt="Foto de perfil"
      class="profile-image"
    />
    <img
      v-else
      src="/default-avatar.jpg"
      alt="Sem imagem"
      class="profile-image"
    />

    <div class="image-actions">
      <button @click="togglePhotoEdit">
        {{ editingField === 'photo' ? 'Cancelar' : 'Trocar foto' }}
      </button>
      <button @click="resetToDefaultPhoto" class="remove">Remover foto</button>
      <input
        v-if="editingField === 'photo'"
        type="file"
        @change="handlePhotoUpload"
        style="margin-top: 10px"
      />
    </div>
  </div>
  <div class="username-section">
    <!-- NOME DE USUÁRIO -->
    <label>Nome de usuário</label>
    <input
      :readonly="editingField !== 'username'"
      v-model="editableUser.username"
    />
  

    <div v-if="editingField === 'username'">
      <button
        @click="updateUsername"
        :disabled="editableUser.username === originalUser.username"
      >Salvar nome de usuário</button>
      <button @click="cancelEditingUsername">Cancelar</button>
    </div>
    <div v-else>
      <button @click="startEditing('username')">Alterar nome de usuário</button>
    </div>
  </div>

    <div class="profile">

      <label>Bio</label>
      <textarea v-model="editableUser.descricao" placeholder="Escreva algo sobre você..."></textarea>
      <button @click="updateDescricao">Salvar descrição</button>

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
    name: 'EditProfileView',
    data() {
      return {
        originalUser: {
          name: '',
          phone: '',
          city: '',
          age: '',
          email: '',
          password: '',
          profileImage: ''
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

    cancelEditingUsername() {
    this.editableUser.username = this.originalUser.username;
    this.editingField = null;
    },

    togglePhotoEdit() {
    this.editingField = this.editingField === 'photo' ? null : 'photo';
    },
    resetToDefaultPhoto() {
      this.editableUser.profileImage = 'default-avatar.jpg';
      this.updatePhoto(true);
    },
    handlePhotoUpload(event) {
      this.selectedPhoto = event.target.files[0];
      this.updatePhoto();
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


    async updatePhoto(isDefault = false) {
    const formData = new FormData();
    formData.append('email', this.originalUser.email);

    if (!isDefault && this.selectedPhoto) {
      formData.append('profileImage', this.selectedPhoto);
    } else {
      formData.append('useDefault', 'true');
    }

    const res = await fetch('http://localhost:3000/api/users/update-photo', {
      method: 'PUT',
      body: formData
    });

    const data = await res.json();
    if (res.ok) {
      this.originalUser.profileImage = data.profileImage;
      this.editableUser.profileImage = data.profileImage;
      this.editingField = null;
      alert('Imagem de perfil atualizada!');
    } else {
      alert(data.error || 'Erro ao atualizar imagem');
    }
  },
      async updateUsername() {
        if (this.editableUser.username === this.originalUser.username) return;

        const res = await fetch('http://localhost:3000/api/users/update-username', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.originalUser.email,
            newUsername: this.editableUser.username
          })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
          this.originalUser.username = this.editableUser.username;
          this.editingField = null;
        } else {
          alert(data.error || 'Nome de usuário já existe.');
        }
      },

    async updateDescricao() {
      const res = await fetch('http://localhost:3000/api/users/update-descricao', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.originalUser.email,
          descricao: this.editableUser.descricao
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Descrição atualizada!');
        this.originalUser.descricao = this.editableUser.descricao;
      } else {
        alert(data.error || 'Erro ao atualizar descrição.');
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

  .profile-image-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .profile-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ccc;
  }

  .image-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.image-actions .remove {
  background-color: #d33;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}

.username-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.username-section label,
.username-section input,
.username-section button {
  margin: 5px 0;
  width: 100%;
  max-width: 300px;
  text-align: center;
}

</style>
  