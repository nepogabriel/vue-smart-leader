<template>
  <header class="bg-dark text-white p-3">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"><i class="fa fa-home fa-2x text-success"></i> Smart Leader</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" v-if="isAuth">
              <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto" v-if="isAuth">
            <li class="nav-item">
              <span class="nav-link"><i class="fa fa-user"></i> {{ user?.name || 'Usuário' }}</span>
            </li>
            <li class="nav-item">
              <span class="nav-link"><i class="fa fa-building"></i> {{ user?.company || 'Empresa' }}</span>
            </li>
            <li class="nav-item">
              <span class="nav-link logout" @click="logout"><i class="fa fa-sign-out"></i> Sair</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'Header',
  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth'];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
  },
  methods: {
    async logout() {
      try {
        await api.post('/logout');
        await this.$store.dispatch('auth/clearToken');
        this.$router.replace({ name: 'login' });
      } catch (e) {
        console.error('Erro ao fazer logout:', e);
      }
    },
  },
};
</script>

<style scoped>
.logout {
  cursor: pointer;
}
</style>