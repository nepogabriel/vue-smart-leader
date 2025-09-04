<template>
  <nav aria-label="Navegação de páginas" class="mt-4">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !prevPageUrl }">
        <a class="page-link text-dark" href="#" @click.prevent="goToPage(currentPage - 1)">Anterior</a>
      </li>
      <li
        v-for="page in paginationRange"
        :key="page"
        class="page-item"
        :class="{ active: page === currentPage }"
      >
        <a
            class="page-link"
            :class="{ 'bg-success border-success text-white': page === currentPage, 'text-success': page !== currentPage }"
            href="#"
            @click.prevent="goToPage(page)"
        >
            {{ page }}
        </a>
      </li>
      <li class="page-item" :class="{ disabled: !nextPageUrl }">
        <a class="page-link text-dark" href="#" @click.prevent="goToPage(currentPage + 1)">Próximo</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TaskPagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    prevPageUrl: {
      type: String,
      default: null,
    },
    nextPageUrl: {
      type: String,
      default: null,
    },
  },
  computed: {
    paginationRange() {
      const range = [];
      const maxPagesToShow = 5;
      let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let end = Math.min(this.totalPages, start + maxPagesToShow - 1);

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1);
      }

      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    },
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit('page-change', page);
      }
    },
  },
};
</script>