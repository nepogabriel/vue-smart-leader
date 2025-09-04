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
import axios from '../../services/api';

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
      console.log('=== TESTE DIRETO DE REQUISIÇÃO ===');
      console.log('Iniciando processo de login...');
      this.error = null;
      this.loading = true;
      
      try {
        console.log('Enviando credenciais:', { email: this.email, password: '***' });
        
        const response = await api.post(`/login`, {
          email: this.email,
          password: this.password,
        });
        
        console.log('✅ Resposta da API recebida:', response.data);
        console.log('Status:', response.status);
        
        // Se chegou até aqui, a requisição funcionou
        this.error = '✅ Requisição enviada com sucesso! Verifique o console para detalhes.';
        
      } catch (e) {
        console.error('❌ Erro na requisição:', e);
        console.error('Status do erro:', e.response?.status);
        console.error('Dados do erro:', e.response?.data);
        console.error('Config da requisição:', e.config);
        
        if (e.code === 'ECONNREFUSED') {
          this.error = '❌ Erro: Não foi possível conectar à API. Verifique se ela está rodando em ' + process.env.VUE_APP_API_URL;
        } else if (e.response?.status === 404) {
          this.error = '❌ Erro 404: Endpoint /login não encontrado na API';
        } else if (e.response?.status === 401) {
          this.error = '❌ Erro 401: Credenciais inválidas';
        } else {
          this.error = `❌ Erro: ${e.message || 'Erro desconhecido'}`;
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
