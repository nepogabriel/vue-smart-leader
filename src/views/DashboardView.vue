<template>
  <div>
    <h1>Dashboard</h1>
    <p>Olá, {{ user?.name || 'usuário' }}!</p>
    <button @click="sair">Sair</button>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
  },
  methods: {
    async sair() {
      await this.$store.dispatch('auth/logout');
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>
