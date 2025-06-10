// src/modules/message.js

import { ScrollToBottom } from './utils.js';

// 当前收集的Markdown内容
let current_markdown = '';
// 当前消息ID
let current_message_id = null;

// 添加消息到对话区域
function addMessage(role, content, is_typing = false) {

    const message_id = role === 'assistant' ? current_message_id : 'msg-' + Date.now();

    const msg_element = document.createElement('div');
    msg_element.className = `message ${role}-message`;
    msg_element.id = message_id;

    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    msg_element.innerHTML = `
    <div class="message-header">
        <span class="role">${role === 'user' ? 'DeepSeek' : 'You'}</span>
        <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-content">
        ${is_typing ? '' : marked.parse(content)}
    </div>
    `;

    document.getElementById('responseContent').appendChild(msg_element);
    ScrollToBottom();

    return message_id;
}

// 更新消息内容
function UpdateMsgContent(message_id, content, is_typing = false) {
const msg_element = document.getElementById(message_id);
if (!msg_element) return;

const content_element = msg_element.querySelector('.message-content');
    if (content_element) {
        content_element.innerHTML = is_typing 
        ? marked.parse(content + '▋') 
        : marked.parse(content);
    }

  // 高亮代码块
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });

  ScrollToBottom();
}

// 导出消息相关函数
export { addMessage, UpdateMsgContent, current_markdown, current_message_id };
