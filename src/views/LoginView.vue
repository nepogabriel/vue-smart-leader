<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4" style="width: 100%; max-width: 400px;">
      <h1 class="text-center mb-4">Login</h1>
      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label"><i class="fa fa-envelope"></i> Email</label>
          <input
            v-model.trim="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors.email }"
            required
          />
          <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
        </div>
        <div class="mb-3">
          <label class="form-label"><i class="fa fa-lock"></i> Senha</label>
          <input
            v-model.trim="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            required
          />
          <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
        </div>
        <button
          type="submit"
          class="btn btn-success w-100"
          :disabled="loading || !isFormValid"
        >
          <i class="fa fa-sign-in"></i> {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      </form>
    </div>
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
    errors: {
      email: null,
      password: null,
    }
  }),
  computed: {
    isFormValid() {
      return this.email.trim() !== '' && this.password.trim() !== '';
    },
  },
  watch: {
    email() {
      this.errors.email = this.email.trim() ? null : 'O email é obrigatório.';
    },
    password() {
      this.errors.password = this.password.trim() ? null : 'A senha é obrigatória.';
    },
  },
  methods: {
    async submit() {
      try {
        const { data } = await api.post("/login", {
          email: this.email,
          password: this.password,
        });

        this.$store.commit("auth/SET_TOKEN", data.data.access_token);
        await this.$store.dispatch("auth/fetchUser");

        this.$router.push({ name: "dashboard" }).catch(() => {});
      } catch (e) {
        console.error("Erro no login:", e);

        if (e.response?.status === 401) {
          this.error = "Usuário ou senha incorretos.";
        } else {
          this.error = e?.response?.data?.message || "Não foi possível fazer login.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
