<template>
  <div id="app">
    <Header />
    <main class="container my-4">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
  created() {
    if (this.isAuth) {
      this.$store.dispatch('auth/fetchUser');
    }
  },
  computed: {
    isAuth() {
      return this.$store.getters['auth/isAuth'];
    },
  },
  watch: {
    isAuth(newVal) {
      if (newVal) {
        this.$store.dispatch('auth/fetchUser');
      }
    },
  },
};
</script>

<style scoped>
main {
  min-height: calc(100vh - 200px);
}
</style>
