// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

// 在渲染进程中暴露 ipcRenderer 给 window 对象
contextBridge.exposeInMainWorld("electron", {
  ReadContent: async (filePath) => {
    try {
      const content = await ipcRenderer.invoke("readFile", filePath);
      console.log("read file content:", content);
      return content;
    } catch (error) {
      console.error("Failed to read file in renderer process:", error);
      return "read content error";
    }
  },
  WriteContent: async (filePath, content) => {
    try {
      await ipcRenderer.invoke("writeFile", { filePath: filePath, content: content });
      console.log("File written successfully.");
    } catch (error) {
      console.error("Failed to write file in renderer process:", error);
    }
  },
});
