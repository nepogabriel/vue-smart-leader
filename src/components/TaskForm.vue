<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.title }"
          id="title"
          v-model="form.title"
        />
        <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Descrição</label>
        <textarea
          class="form-control"
          :class="{ 'is-invalid': errors.description }"
          id="description"
          v-model="form.description"
        ></textarea>
        <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select
          class="form-select"
          :class="{ 'is-invalid': errors.status }"
          id="status"
          v-model="form.status"
        >
          <option value="" disabled>Selecione o status</option>
          <option v-for="(label, value) in statusOptions" :key="value" :value="value">{{ label }}</option>
        </select>
        <div v-if="errors.status" class="invalid-feedback">{{ errors.status }}</div>
      </div>

      <div class="mb-3">
        <label for="priority" class="form-label">Prioridade</label>
        <select
          class="form-select"
          :class="{ 'is-invalid': errors.priority }"
          id="priority"
          v-model="form.priority"
        >
          <option value="" disabled>Selecione a prioridade</option>
          <option v-for="(label, value) in priorityOptions" :key="value" :value="value">{{ label }}</option>
        </select>
        <div v-if="errors.priority" class="invalid-feedback">{{ errors.priority }}</div>
      </div>

      <div class="mb-3">
        <label for="due_date" class="form-label">Data de Vencimento</label>
        <input
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.due_date }"
          id="due_date"
          v-model="form.due_date"
        />
        <div v-if="errors.due_date" class="invalid-feedback">{{ errors.due_date }}</div>
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-success">{{ isEditMode ? 'Atualizar' : 'Criar' }} Tarefa</button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'TaskForm',
  props: {
    task: {
      type: Object,
      default: () => ({
        id: null,
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      }),
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: this.initializeForm(),
      errors: {
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      },
      statusOptions: {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        done: 'Concluída',
      },
      priorityOptions: {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta',
      },
    };
  },
  watch: {
    task(newTask) {
      this.form = this.initializeForm(newTask);
    },
  },
  methods: {
    initializeForm(task = this.task) {
      const form = { ...task };

      if (task.due_date) {
        const date = new Date(task.due_date);
        
        if (!isNaN(date.getTime())) {
          form.due_date = date.toISOString().split('T')[0];
        }
      }
      return form;
    },
    validateForm() {
      this.errors = {
        title: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
      };
      let isValid = true;

      if (!this.form.title || this.form.title.trim() === '') {
        this.errors.title = 'O título é obrigatório.';
        isValid = false;
      }

      if (!this.form.description || this.form.description.trim() === '') {
        this.errors.description = 'A descrição é obrigatória.';
        isValid = false;
      }

      if (this.form.description && typeof this.form.description !== 'string') {
        this.errors.description = 'A descrição deve ser um texto válido.';
        isValid = false;
      }

      if (!this.form.status || !Object.keys(this.statusOptions).includes(this.form.status)) {
        this.errors.status = 'Selecione um status válido.';
        isValid = false;
      }

      if (!this.form.priority || !Object.keys(this.priorityOptions).includes(this.form.priority)) {
        this.errors.priority = 'Selecione uma prioridade válida.';
        isValid = false;
      }

      if (!this.form.due_date || isNaN(new Date(this.form.due_date).getTime())) {
        this.errors.due_date = 'Selecione uma data válida.';
        isValid = false;
      }

      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) return;

      try {
        const payload = {
          title: this.form.title,
          description: this.form.description,
          status: this.form.status,
          priority: this.form.priority,
          due_date: this.form.due_date,
        };

        if (this.isEditMode) {
          await api.put(`/tasks/${this.form.id}`, payload);
        } else {
          await api.post('/tasks', payload);
        }

        this.$emit('success');
      } catch (e) {
        this.$emit('error', e?.response?.data?.message || 'Erro ao salvar tarefa.');
      }
    },
  },
};
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>