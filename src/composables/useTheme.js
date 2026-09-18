import { ref } from 'vue';

const THEME_KEY = 'html_puzzle_theme_pref';

const isDark = ref(true);

export function useTheme() {
  function initTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved !== null) {
        isDark.value = saved === 'dark';
      } else {
        // 預設採用暗色或根據系統偏好
        isDark.value = true;
      }
    } catch (e) {
      isDark.value = true;
    }
    applyTheme();
  }

  function applyTheme() {
    if (typeof document !== 'undefined') {
      if (isDark.value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  function toggleTheme() {
    isDark.value = !isDark.value;
    try {
      localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light');
    } catch (e) {}
    applyTheme();
  }

  // 立即初始化
  initTheme();

  return {
    isDark,
    toggleTheme
  };
}
