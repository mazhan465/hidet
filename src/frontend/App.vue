<template>
    <h1>Hello World!</h1>
    <a-textarea
      v-model:value="value1"
      placeholder="Autosize height based on content lines"
      auto-size
    />
    <p>Welcome to your Electron application.</p>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  const value1 = ref<string>('');
  </script>