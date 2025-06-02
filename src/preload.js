const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 暴露一个函数给渲染进程
  showMessage: (message) => ipcRenderer.send('show-message', message)
});
