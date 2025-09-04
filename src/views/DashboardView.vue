<template>
  <div>
    <TaskList />
  </div>
</template>

<script>
import TaskList from '@/components/TaskList.vue';

export default {
  name: 'Dashboard',
  components: {
    TaskList,
  },
};
</script>
