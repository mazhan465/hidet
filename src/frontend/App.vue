<template>
  <div>
    <div class="divx" v-show="showMenu"></div>
    <div v-show="showMenu">
      <a-float-button-group :style="{ right: '24px' }">
        <a-upload :file-list="fileList" :before-upload="handleOpenFile">
          <a-float-button> </a-float-button>
        </a-upload>
      </a-float-button-group>
    </div>
    <a-textarea
      ref="textarea"
      v-model:value="fileContent"
      placeholder="Autosize height based on content lines"
      :bordered="false"
      :rows="computedRows"
      :style="{ height: '100%', width: '100%', margin: '0px' }"
    />
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      filePath: "", // 文件路径
      fileContent: "", // 文件内容
      showMenu: true,
      fileList: [],
      lineSpacing: 62,
      computedRows: 1,
    };
  },
  mounted() {
    this.calculateRows(); // 初始计算行数

    // 监听窗口大小变化，实时更新行数
    window.addEventListener("resize", this.handleResize);
    window.electron.GetFilePath().then((filePath: string) => {
      console.log("filePath:", filePath);
      this.filePath = filePath;
      if (this.filePath != "") {
        this.ReadContent();
      }
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
  methods: {
    async ReadContent() {
      window.electron.ReadContent(this.filePath).then((content) => {
        this.fileContent = content;
      });
    },
    handleOpenFile(file: any) {
      this.filePath = file.path;
      this.ReadContent();
      window.electron.SetFilePath(file.path);
      return false;
    },
    calculateRows() {
      this.computedRows = Math.floor(window.innerHeight / this.lineSpacing);
    },
    handleResize() {
      this.calculateRows();
    },
  },
  beforeUnmount() {
    // 清理监听器
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.a-textarea {
  flex: 1; /* 填充剩余空间 */
}
.divx {
  width: 30px;
  height: 30px;
  position: absolute;
  z-index: 999;
  -webkit-app-region: drag;
}
</style>
