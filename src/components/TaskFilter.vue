<template>
  <div class="dropdown col-sm-6 mb-2">
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
