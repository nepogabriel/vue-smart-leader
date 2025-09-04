<template>
  <div>
    <h1>Dashboard</h1>
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
