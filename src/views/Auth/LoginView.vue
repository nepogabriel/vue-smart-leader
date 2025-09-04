<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <div>
        <label>Email</label>
        <input v-model.trim="email" type="email" required />
      </div>
      <div>
        <label>Senha</label>
        <input v-model.trim="password" type="password" required />
      </div>

      <button :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</button>

      <p v-if="error" style="color:red; margin-top: 8px;">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: 'Login',
  data: () => ({
    email: '',
    password: '',
    loading: false,
    error: null,
  }),
  methods: {
    async submit() {
      try {
        const { data } = await api.post("/login", {
          email: this.email,
          password: this.password,
        });

        this.$store.commit("auth/SET_TOKEN", data.data.access_token);

        this.$router.push({ name: "dashboard" }).catch(() => {});
      } catch (e) {
        console.error("Erro no login:", e);
        this.error =
          e?.response?.data?.message || "Não foi possível fazer login.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
