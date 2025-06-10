// src/modules/window.js

import { UpdateBtnStates } from './request.js'
import { UpdateHistoryList } from './history.js'

function CheckMinResol() {
    const detector = document.getElementById('minSizeDetector');
    const min_width = 480;
    const min_height = 272;
    
    function UpdateDetector() {
      const meets_min = window.innerWidth >= min_width && window.innerHeight >= min_height;
      detector.style.display = meets_min ? 'none' : 'block';
    }
   
    // 初始检测
    UpdateDetector();
    
    // 窗口变化时检测
    window.addEventListener('resize', () => {
      UpdateDetector();
      
      // 强制容器尺寸更新
      document.documentElement.style.setProperty(
        '--container-width',
        `${Math.max(min_width, window.innerWidth * 0.95)}px`
      );
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化检测
  CheckMinResol();

  // 初始化按钮状态
  UpdateBtnStates();
  // 初始化历史列表
  UpdateHistoryList();
});
