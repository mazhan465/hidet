<template>
  <div :style="{ height: '100%', width: '100%' }">
    <div v-show="showMenu">
      <a-float-button-group :style="{ right: '24px' }">
        <a-float-button>Hello World!</a-float-button>
      </a-float-button-group>
    </div>
    <a-textarea
      v-model:value="fileContent"
      placeholder="Autosize height based on content lines"
      :style="{ height: '100%', width: '100%' }"
      auto-size
    />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      filePath: "/Users/mazhan465/project/hidet/a.txt", // 文件路径
      fileContent: "", // 文件内容
      showMenu: true,
    };
  },
  mounted() {
    window.electron.ReadContent(this.filePath).then((content) => {
      this.fileContent = content;
    });

    window.electron.Listen("shortcut", (event: string, arg) => {
      if (event == "showMenu") {
        this.showMenu = !this.showMenu;
      }
      if (event == "save") {
        window.electron.WriteContent(this.filePath, this.fileContent);
      }
    });

    setInterval(() => {
      window.electron.WriteContent(this.filePath, this.fileContent);
    }, 5000);
  },
  methods: {},
};
</script>
