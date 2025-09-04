<template>
  <div>
    <div v-if="show" class="modal fade show" style="display: block;" tabindex="-1" :aria-labelledby="modalId" aria-modal="true" role="dialog">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" :id="modalId">Confirmar Exclusão</h5>
            <button type="button" class="btn-close" @click="close" aria-label="Fechar"></button>
            </div>
            <div class="modal-body">
            Tem certeza que deseja excluir a tarefa "{{ task?.title }}"?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">Cancelar</button>
            <button type="button" class="btn btn-danger" @click="confirm">Excluir</button>
            </div>
        </div>
        </div>
    </div>
    <div v-if="show" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  name: 'TaskDeleteModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object,
      default: null,
    },
    modalId: {
      type: String,
      default: 'deleteModal',
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
    },
  },
};
</script>