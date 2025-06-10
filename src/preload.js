// src/preload.js

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startStreamingRequest: (input) => ipcRenderer.invoke('start-streaming-request', input),
  cancelStreamingRequest: () => ipcRenderer.invoke('cancel-streaming-request'),
  getConversationHistory: () => ipcRenderer.invoke('get-conversation-history'),
  clearConversationHistory: () => ipcRenderer.invoke('clear-conversation-history'),
  
  // 流式响应事件监听
  onStreamingResponse: (callback) => {
    ipcRenderer.on('streaming-response', (event, chunk) => callback(chunk));
  },
  onStreamingComplete: (callback) => {
    ipcRenderer.on('streaming-complete', () => callback());
  },
  onStreamingError: (callback) => {
    ipcRenderer.on('streaming-error', (event, error) => callback(error));
  }
});
