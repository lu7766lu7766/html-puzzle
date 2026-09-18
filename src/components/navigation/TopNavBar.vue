<template>
  <header class="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0 transition-colors duration-200">
    <!-- 左側：LOGO 與當前關卡資訊 -->
    <div class="flex items-center space-x-2 sm:space-x-3">
      <div class="flex items-center space-x-2 cursor-pointer group" @click="$emit('open-map')">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </div>
        <div>
          <div class="flex items-center space-x-1.5">
            <span class="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white">
              HTML 拼圖冒險
            </span>
            <span class="text-xs font-bold px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
              v1.0
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">網頁架構拼裝學習</p>
        </div>
      </div>

      <!-- 當前關卡快速標籤 -->
      <button 
        @click="$emit('open-map')"
        class="flex items-center space-x-2 ml-2 sm:ml-3 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 transition-colors"
        title="點擊切換關卡"
      >
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="font-bold truncate max-w-28 sm:max-w-40">{{ currentLevel.title }}</span>
        <span class="text-slate-400 text-xs">▾ 切換</span>
      </button>
    </div>

    <!-- 中間：積木模式切換選單 (適應低解析度文字與對比) -->
    <div class="hidden xl:flex items-center bg-slate-100 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
      <button 
        @click="$emit('change-mode', 'progressive')"
        :class="activeMode === 'progressive' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        class="px-2.5 py-1 text-xs rounded-lg transition-all"
        title="依關卡難度自動切換三大件與容器夾"
      >
        ✨ 漸進模式
      </button>
      <button 
        @click="$emit('change-mode', 'strict')"
        :class="activeMode === 'strict' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        class="px-2.5 py-1 text-xs rounded-lg transition-all"
        title="起始、內容、結束標籤分開拼"
      >
        🧩 獨立三大件
      </button>
      <button 
        @click="$emit('change-mode', 'container')"
        :class="activeMode === 'container' ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        class="px-2.5 py-1 text-xs rounded-lg transition-all"
        title="成對凹字形容器防呆"
      >
        📦 容器插槽
      </button>
    </div>

    <!-- 右側功能捷徑 -->
    <div class="flex items-center space-x-1.5 sm:space-x-2">
      <!-- 亮暗色主題切換按鈕 -->
      <button 
        @click="$emit('toggle-theme')"
        class="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-bold transition-all shadow-sm"
        :title="isDark ? '切換為亮色模式' : '切換為暗色模式'"
      >
        <span>{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="hidden md:inline">{{ isDark ? '亮色' : '暗色' }}</span>
      </button>

      <!-- 知識手冊按鈕 -->
      <button 
        @click="$emit('open-handbook')"
        class="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold transition-colors"
        title="打開 HTML 核心知識手冊"
      >
        <span>📖</span>
        <span class="hidden sm:inline">核心手冊</span>
      </button>

      <!-- 靜音開關 -->
      <button 
        @click="$emit('toggle-audio')"
        class="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs border border-slate-300 dark:border-slate-700 transition-colors"
        :title="isMuted ? '取消靜音' : '開啟靜音'"
      >
        <span>{{ isMuted ? '🔇' : '🔊' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  currentLevel: { type: Object, required: true },
  totalStars: { type: Number, default: 0 },
  activeMode: { type: String, default: 'progressive' },
  isMuted: { type: Boolean, default: false },
  isDark: { type: Boolean, default: true }
});

defineEmits([
  'open-map',
  'open-handbook',
  'change-mode',
  'toggle-audio',
  'toggle-theme'
]);
</script>
