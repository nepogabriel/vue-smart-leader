<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title text-center mb-4">Cadastro de Usuário</h3>
            <form @submit.prevent="submitForm" novalidate>
              <div class="mb-3">
                <label for="company_id" class="form-label">Empresa</label>
                <select
                  class="form-select"
                  :class="{ 'is-invalid': errors.company_id }"
                  id="company_id"
                  v-model="form.company_id"
                  required
                >
                  <option value="" disabled>Selecione uma empresa</option>
                  <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.name }} ({{ company.slug }})</option>
                </select>
                <div v-if="errors.company_id" class="invalid-feedback">{{ errors.company_id }}</div>
              </div>

              <div class="mb-3">
                <label for="name" class="form-label">Nome</label>
                <input
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  id="name"
                  v-model="form.name"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="form.email"
                  required
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Senha</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  v-model="form.password"
                  required
                />
                <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
              </div>

              <div class="mb-3">
                <label for="password_confirmation" class="form-label">Confirmação de Senha</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password_confirmation }"
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  required
                />
                <div v-if="errors.password_confirmation" class="invalid-feedback">{{ errors.password_confirmation }}</div>
              </div>

              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-success mb-2" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Cadastrar
                </button>

                <router-link class="btn btn-dark" to="/login">Login</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'UserRegister',
  data() {
    return {
      companies: [],
      form: {
        company_id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      errors: {
        company_id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      loading: false,
      error: null,
    };
  },
  created() {
    this.fetchCompanies();
  },
  methods: {
    async fetchCompanies() {
      this.loading = true;
      try {
        const { data } = await api.get('/companies');
        this.companies = data.data;
      } catch (e) {
        this.error = 'Erro ao carregar empresas. Tente novamente.';
        console.error('Erro ao carregar empresas:', e);
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      this.errors = {
        company_id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      };
      let isValid = true;

      if (!this.form.company_id) {
        this.errors.company_id = 'Selecione uma empresa.';
        isValid = false;
      }

      if (!this.form.name || this.form.name.trim() === '') {
        this.errors.name = 'O nome é obrigatório.';
        isValid = false;
      }

      if (!this.form.email || !/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errors.email = 'Digite um email válido.';
        isValid = false;
      }

      if (!this.form.password || this.form.password.length < 6) {
        this.errors.password = 'A senha deve ter pelo menos 6 caracteres.';
        isValid = false;
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = 'As senhas não coincidem.';
        isValid = false;
      }

      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) return;

      this.loading = true;
      this.error = null;

      try {
        const payload = {
          company_id: this.form.company_id,
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          password_confirmation: this.form.password_confirmation,
        };

        await api.post('/register', payload);
        this.$router.push({ name: 'login' }); // Redireciona para a página de login após sucesso (ajuste conforme necessário)
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao cadastrar usuário. Tente novamente.';
        console.error('Erro ao cadastrar:', e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 600;
}
.invalid-feedback {
  display: block;
}
.d-grid {
  margin-top: 1.5rem;
}
</style>