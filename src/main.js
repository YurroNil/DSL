const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: "false", // 安全设置
      contextIsolation: "true"  // 安全设置
    }
  });

  // 加载应用界面
  mainWindow.loadFile('public/index.html');

  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // macOS 特殊处理
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭时退出应用 (Windows & Linux)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
