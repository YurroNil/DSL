// src/modules/request.js

import { addMessage, UpdateMsgContent, current_markdown, current_message_id } from './message.js';
import { UpdateHistoryList } from './history.js';

// 获取DOM元素
const sendBtn = document.getElementById('sendBtn');
const cancelBtn = document.getElementById('cancelBtn');
const user_input = document.getElementById('userInput');
const loader = document.getElementById('loader');
 
// 当前是否正在请求中
let is_requesting = false;

// 更新按钮状态
function UpdateBtnStates() {
    sendBtn.disabled = is_requesting;
    cancelBtn.disabled = !is_requesting;
}

// 设置事件监听器
window.electronAPI.onStreamingResponse((chunk) => {
    current_markdown += chunk;
    UpdateMsgContent(current_message_id, current_markdown, true);
});

window.electronAPI.onStreamingComplete(() => {
    is_requesting = false;
    UpdateBtnStates();
    loader.style.display = 'none';

    current_markdown = current_markdown.replace('▋', '');
    UpdateMsgContent(current_message_id, current_markdown, false);
    UpdateHistoryList();
});

window.electronAPI.onStreamingError((error) => {
    const error_msg = `\n\n> **错误**：${error}`;
    current_markdown += error_msg;
    UpdateMsgContent(current_message_id, current_markdown, false);

    is_requesting = false;
    UpdateBtnStates();
    loader.style.display = 'none';
});

// 发送请求
sendBtn.addEventListener('click', async () => {

    console.log('按钮已被点击');

    const inputText = user_input.value.trim();
    if (!inputText || is_requesting) return;

    is_requesting = true;
    UpdateBtnStates();
    loader.style.display = 'block';

    current_message_id = 'msg-' + Date.now();
    current_markdown = '';

    addMessage('user', inputText);
  
try {
    await window.electronAPI.startStreamingRequest(inputText);
    user_input.value = '';
} catch (err) {
    console.error('启动流式请求失败:', err);
    addMessage('assistant', `**通信错误**：${err.message}`);
    is_requesting = false;
    UpdateBtnStates();
    loader.style.display = 'none';
}
});

// 取消请求
cancelBtn.addEventListener('click', async () => {
    if (!is_requesting) return;

try {
    const canceled = await window.electronAPI.cancelStreamingRequest();
    if (canceled) {
        current_markdown += '\n\n> **请求已取消**';
        UpdateMsgContent(current_message_id, current_markdown, false);
        is_requesting = false;
        UpdateBtnStates();
        loader.style.display = 'none';
    }

} catch (err) { console.error('取消请求失败:', err); }
});

UpdateBtnStates();

export { UpdateBtnStates };
