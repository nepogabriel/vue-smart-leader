<template>
  <div>
    <div v-if="showForm">
      <TaskForm
        :task="selectedTask"
        :is-edit-mode="!!selectedTask.id"
        @success="handleFormSuccess"
        @error="handleFormError"
        @cancel="closeForm"
      />
    </div>
    <div v-else>
      <div class="mb-4">
        <h2 class="text-center mb-5">Lista de Tarefas</h2>
        <div class="d-flex justify-content-between align-items-center">
          <div class="row">
            <TaskFilter
              filter-id="statusFilter"
              :initial-value="selectedStatus"
              :labels="statusLabels"
              default-label="Todos os Status"
              @update:value="setStatus"
            />
            <TaskFilter
              filter-id="priorityFilter"
              :initial-value="selectedPriority"
              :labels="priorityLabels"
              default-label="Todas as Prioridades"
              @update:value="setPriority"
            />
          </div>
          <button class="btn btn-success" @click="openCreateForm"><i class="fa fa-plus"></i> Nova Tarefa</button>
        </div>
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border text-success" role="status">
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
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id">
            <td>{{ task.title }}</td>
            <td>{{ task.description || '-' }}</td>
            <td>{{ task.status | formatStatus }}</td>
            <td>{{ task.priority | formatPriority }}</td>
            <td>{{ task.due_date | formatDate }}</td>
            <td>
              <button class="btn btn-sm btn-success" @click="openEditForm(task)"><i class="fa fa-pencil-square-o"></i></button>
              <button class="btn btn-sm btn-danger" @click="openDeleteModal(task)"><i class="fa fa-trash-o"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <TaskPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :prev-page-url="prevPageUrl"
        :next-page-url="nextPageUrl"
        @page-change="goToPage"
      />
    </div>

    <DeleteModal
      :show="showDeleteModal"
      :task="taskToDelete"
      @close="closeDeleteModal"
      @confirm="deleteTask"
    />
  </div>
</template>

<script>
import api from '@/services/api';
import TaskFilter from '@/components/TaskFilter.vue';
import TaskPagination from '@/components/TaskPagination.vue';
import TaskForm from '@/components/TaskForm.vue';
import DeleteModal from '@/components/DeleteModal.vue';

export default {
  name: 'TaskList',
  components: {
    TaskFilter,
    TaskPagination,
    TaskForm,
    DeleteModal,
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
      currentPage: 1,
      totalPages: 1,
      perPage: 15,
      total: 0,
      nextPageUrl: null,
      prevPageUrl: null,
      showForm: false,
      selectedTask: {
        id: null,
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      },
      showDeleteModal: false,
      taskToDelete: null,
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
    async fetchTasks(page = 1) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get(`/tasks?page=${page}`);

        if (!Array.isArray(data.data)) {
          throw new Error('Resposta inválida: dados não são uma lista.');
        }

        this.tasks = data.data;
        this.currentPage = data.current_page;
        this.totalPages = data.last_page;
        this.perPage = data.per_page;
        this.total = data.total;
        this.nextPageUrl = data.next_page_url;
        this.prevPageUrl = data.prev_page_url;
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao carregar tarefas.';
        console.error('Erro na requisição:', e);
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
    goToPage(page) {
      this.fetchTasks(page);
    },
    openCreateForm() {
      this.selectedTask = {
        id: null,
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      };
      this.showForm = true;
    },
    openEditForm(task) {
      this.selectedTask = { ...task };
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.selectedTask = {
        id: null,
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      };
    },
    handleFormSuccess() {
      this.closeForm();
      this.fetchTasks(this.currentPage);
    },
    handleFormError(message) {
      this.error = message;
    },
    openDeleteModal(task) {
      this.taskToDelete = task;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.taskToDelete = null;
    },
    async deleteTask() {
      if (!this.taskToDelete?.id) return;

      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/tasks/${this.taskToDelete.id}`);
        this.closeDeleteModal();
        this.fetchTasks(this.currentPage);
      } catch (e) {
        this.error = e?.response?.data?.message || 'Erro ao excluir tarefa.';
        console.error('Erro na exclusão:', e);
      } finally {
        this.loading = false;
      }
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

<style scoped>
.gap-3 {
  gap: 1rem;
}
.me-2 {
  margin-right: 0.5rem;
}
</style>