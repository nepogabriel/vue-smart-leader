<template>
  <div id="app">
    <header class="bg-dark text-white p-3">
      <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#"><i class="fas fa-home"></i> Smart Leader</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item" v-if="isAuth">
                <span class="nav-link">{{ user?.name || '' }} | {{ user?.company || '' }}</span>
              </li>
              <li class="nav-item" v-if="isAuth">
                <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
              </li>
              <li class="nav-item" v-if="isAuth">
                <a class="nav-link logout" @click="logout">Sair</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="container my-4">
      <router-view />
    </main>

    <footer class="bg-dark text-white text-center p-3 mt-4">
      <p><i class="fas fa-copyright"></i> Smart Leader 2025 - Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (this.$store.getters['auth/isAuth']) {
      this.$store.dispatch('auth/fetchUser');
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth'];
    },
    user() {
      return this.$store.getters['auth/user'];
    },
    company() {
      return this.$store.getters['auth/company'];
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 200px);
}

.logout {
  cursor: pointer;
}
</style>
