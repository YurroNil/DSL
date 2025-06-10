// src/modules/utils.js

// 初始化Markdown解析器
marked.setOptions({
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-'
});

// 工具函数
function ScrollToBottom() {
    const response_content = document.getElementById('responseContent');
    requestAnimationFrame(() => {
        response_content.scrollTop = response_content.scrollHeight;
    });
}
// 导出工具函数
export { ScrollToBottom };
