// src/modules/history.js

// 更新历史列表
async function UpdateHistoryList() {
try {
    const history = await window.electronAPI.getConversationHistory();
    const history_list = document.getElementById('historyList');
    const user_input = document.getElementById('userInput');

    // 过滤掉系统消息
    const user_msgs = history.filter(msg => msg.role === 'user');

    if (user_msgs.length === 0) {
        history_list.innerHTML = '<li class="empty-history">暂无历史记录</li>';
        return;
    }

    history_list.innerHTML = '';

    user_msgs.forEach((msg, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.textContent = msg.content;

        li.addEventListener('click', () => {
            // 高亮选中的历史项
            document.querySelectorAll('.history-item').forEach(item => { item.classList.remove('active'); });
            li.classList.add('active');
            
            // 填充到输入框
            user_input.value = msg.content;
        });

        history_list.appendChild(li);
    });

} catch (error) {
    console.error('获取历史记录失败:', error);
}}
  
// 初始化历史功能
document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
    const confirmed = confirm('确定要清除所有对话历史吗？');
    if (confirmed) {
        await window.electronAPI.clearConversationHistory();
        UpdateHistoryList();
    }
});

// 导出历史相关函数
export { UpdateHistoryList };
