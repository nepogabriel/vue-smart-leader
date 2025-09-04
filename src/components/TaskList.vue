<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Lista de Tarefas</h2>
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          id="statusFilter"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i class="fa fa-filter"></i> {{ selectedStatus ? statusLabels[selectedStatus] : 'Todos os Status' }}
        </button>
        <ul class="dropdown-menu" aria-labelledby="statusFilter">
          <li>
            <a class="dropdown-item" href="#" @click.prevent="setStatus('')">Todos</a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="setStatus('pending')">Pendente</a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="setStatus('in_progress')">Em Andamento</a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click.prevent="setStatus('done')">Concluída</a>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-else-if="filteredTasks.length === 0" class="alert alert-info" role="alert">
      Nenhuma tarefa encontrada.
    </div>
    <table v-else class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Prioridade</th>
          <th>Data de Vencimento</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in filteredTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.status | formatStatus }}</td>
          <td>{{ task.priority | formatPriority }}</td>
          <td>{{ task.due_date | formatDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'TaskList',
  data() {
    return {
      tasks: [],
      loading: false,
      error: null,
      selectedStatus: '',
      statusLabels: {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        completed: 'Concluída',
      },
    };
  },
  computed: {
    filteredTasks() {
      if (!this.selectedStatus) return this.tasks;
      return this.tasks.filter(task => task.status === this.selectedStatus);
    },
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get('/tasks', {
          params: { status: this.selectedStatus || undefined },
        });
        this.tasks = data.data;
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao carregar tarefas.';
      } finally {
        this.loading = false;
      }
    },
    setStatus(status) {
      this.selectedStatus = status;
      this.fetchTasks();
    },
  },
  filters: {
    formatStatus(status) {
      return {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        done: 'Concluída',
      }[status] || status;
    },
    formatPriority(priority) {
      return {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
      }[priority] || priority;
    },
    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('pt-BR');
    },
  },
};
</script>
