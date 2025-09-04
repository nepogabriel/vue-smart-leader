<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Lista de Tarefas</h2>
      <div class="d-flex gap-3">
        <TaskFilters
          filter-id="statusFilter"
          :initial-value="selectedStatus"
          :labels="statusLabels"
          default-label="Todos os Status"
          @update:value="setStatus"
        />
        <TaskFilters
          filter-id="priorityFilter"
          :initial-value="selectedPriority"
          :labels="priorityLabels"
          default-label="Todas as Prioridades"
          @update:value="setPriority"
        />
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
          <td>{{ task.description || '-' }}</td>
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
import TaskFilters from '@/components/TaskFilter.vue';

export default {
  name: 'TaskList',
  components: {
    TaskFilters,
  },
  data() {
    return {
      tasks: [],
      loading: false,
      error: null,
      selectedStatus: '',
      selectedPriority: '',
      validStatuses: [
        'pending',
        'in_progress',
        'done'
      ],
      validPriorities: [
        'low',
        'medium',
        'high'
      ],
      statusLabels: {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        done: 'Concluída',
      },
      priorityLabels: {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
      },
    };
  },
  computed: {
    filteredTasks() {
      let tasks = this.tasks;
      if (this.selectedStatus) {
        tasks = tasks.filter(task => task.status === this.selectedStatus);
      }
      if (this.selectedPriority) {
        tasks = tasks.filter(task => task.priority === this.selectedPriority);
      }
      return tasks;
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
        const { data } = await api.get('/tasks');

        if (!Array.isArray(data.data)) {
          throw new Error('Resposta inválida: dados não são uma lista.');
        }

        this.tasks = data.data;
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao carregar tarefas.';
      } finally {
        this.loading = false;
      }
    },
    setStatus(status) {
      this.selectedStatus = status;
    },
    setPriority(priority) {
      this.selectedPriority = priority;
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
      if (!date)
        return '-';

      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleDateString('pt-BR');
    },
  },
};
</script>