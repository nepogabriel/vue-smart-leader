<template>
  <div class="dropdown">
    <button
      class="btn btn-success dropdown-toggle"
      type="button"
      :id="filterId"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fa fa-filter"></i> {{ selectedValue ? labels[selectedValue] : defaultLabel }}
    </button>
    <ul class="dropdown-menu" :aria-labelledby="filterId">
      <li>
        <a class="dropdown-item" href="#" @click.prevent="setValue('')">Todos</a>
      </li>
      <li v-for="(label, value) in labels" :key="value">
        <a class="dropdown-item" href="#" @click.prevent="setValue(value)">{{ label }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TaskFilters',
  props: {
    filterId: {
      type: String,
      required: true,
    },
    initialValue: {
      type: String,
      default: '',
    },
    labels: {
      type: Object,
      required: true,
    },
    defaultLabel: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedValue: this.initialValue,
    };
  },
  methods: {
    setValue(value) {
      this.selectedValue = value;
      this.$emit('update:value', value);
    },
  },
};
</script>

<!-- <template>
  <div class="d-flex gap-3">
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
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="priorityFilter"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i class="fa fa-filter"></i> {{ selectedPriority ? priorityLabels[selectedPriority] : 'Todas as Prioridades' }}
      </button>
      <ul class="dropdown-menu" aria-labelledby="priorityFilter">
        <li>
          <a class="dropdown-item" href="#" @click.prevent="setPriority('')">Todas</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="setPriority('low')">Baixa</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="setPriority('medium')">Média</a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="setPriority('high')">Alta</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskFilters',
  props: {
    initialStatus: {
      type: String,
      default: '',
    },
    initialPriority: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedStatus: this.initialStatus,
      selectedPriority: this.initialPriority,
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
  methods: {
    setStatus(status) {
      this.selectedStatus = status;
      this.$emit('update:status', status);
    },
    setPriority(priority) {
      this.selectedPriority = priority;
      this.$emit('update:priority', priority);
    },
  },
};
</script>

<style scoped>
.gap-3 {
  gap: 1rem;
}
</style> -->