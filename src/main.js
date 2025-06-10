// src/main.js

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

let main_window;

// 禁用electron框架的菜单栏
Menu.setApplicationMenu(null);

function CreateWindow() {

  main_window = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
      contextIsolation: true
    }
  });

  main_window.loadFile('index.html');
  // 开发时打开开发者工具方便调试
  // main_window.webContents.openDevTools();
}

app.whenReady().then(() => {
  CreateWindow();
  
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-da6b05667094417d8328bd29d0c55b2f'
  });

  // 存储当前请求的响应流
  let current_stream = null;
  
  // 对话历史管理
  // cvst: conversation
  let cvst_history = [
    { role: "system", content: "你是一个DeepSeek助手" }
  ];
  
  // 获取当前对话历史
  ipcMain.handle('get-conversation-history', () => {
    return cvst_history;
  });
  
  // 清除对话历史
  ipcMain.handle('clear-conversation-history', () => {
    cvst_history = [
      { role: "system", content: "你是一个DeepSeek助手" }
    ];
    return true;
  });

  // 处理开始流式请求
  ipcMain.handle('start-streaming-request', async (event, user_input) => {
    try {
      // 如果有进行中的请求，取消它
      if (current_stream) {
        current_stream.controller.abort();
        current_stream = null;
      }
      
      // 添加用户消息到历史
      cvst_history.push({ role: "user", content: user_input });
      
      // 创建新的流式请求
      const controller = new AbortController();
      const signal = controller.signal;
      
      const stream = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: cvst_history,
        max_tokens: 8192,
        stream: true, // 启用流式传输
        signal // 传递中止信号
      }, { responseType: 'stream' });
      
      // 存储当前流
      current_stream = { stream, controller };
      
      // 逐块读取流
      let full_response = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          full_response += content;
          // 发送当前内容块到渲染进程
          event.sender.send('streaming-response', content);
        }
      }
      
      // 添加AI响应到历史
      cvst_history.push({ role: "assistant", content: full_response });
      
      // 发送完成信号
      event.sender.send('streaming-complete');
      
      return { success: true };
    } catch (error) {
      // 如果是用户主动取消，不视为错误
      if (error.name !== 'AbortError') {
        console.error('流式请求失败:', error);
        event.sender.send('streaming-error', error.message);
        return { success: false, error: error.message };
      }
      return { success: false, error: '请求已取消' };
    }
  });

  // 处理取消请求
  ipcMain.handle('cancel-streaming-request', () => {
    if (current_stream) {
      current_stream.controller.abort();
      current_stream = null;
      return true;
    }
    return false;
  });
});
