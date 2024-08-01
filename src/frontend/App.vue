<template>
    <h1>Hello World!</h1>
    <a-textarea
      v-model:value="fileContent"
      placeholder="Autosize height based on content lines"
      auto-size
    />
  </template>
  
  <script lang="ts">

  export default {
    data() {
      return {
        filePath: '/Users/mazhan465/project/hidet/a.txt', // 文件路径
        fileContent: '', // 文件内容
      };
    },
    mounted() {
    window.electron.ReadContent(this.filePath).then((content)=>{this.fileContent=content;});
    },
    methods: {
     
    }
  };
  </script>