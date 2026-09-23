<template>
  <div 
    class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-slate-900 border border-amber-300/60 dark:border-amber-700/60 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl flex flex-col relative overflow-hidden transition-colors">
      <!-- 頂部橘黃色氛圍光暈 -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- 右上角關閉按鈕 -->
      <button 
        @click="handleClose"
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg text-lg transition-colors cursor-pointer"
        title="關閉 (Esc)"
      >
        ✕
      </button>

      <!-- 頂部圖示與標題 -->
      <div class="flex flex-col items-center text-center my-2">
        <div class="w-16 h-16 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/20 mb-3 animate-pulse">
          🛠️
        </div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          MISSION INCOMPLETE
        </span>
        <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
          驗收尚未達標，還差一點點！
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 font-medium max-w-sm leading-relaxed">
          目前網頁架構或語法順序尚未完全正確，請再仔細檢查畫布中的積木配置與順序後再次提交！
        </p>

        <!-- 待調整原因清單 -->
        <div 
          v-if="testReport?.errorDetails && testReport.errorDetails.length > 0"
          class="mt-3.5 w-full bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-3.5 text-left max-h-48 overflow-y-auto"
        >
          <div class="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>待調整項目與順序：</span>
          </div>
          <ul class="text-xs text-amber-900 dark:text-amber-200/90 space-y-1 font-medium list-disc list-inside">
            <li v-for="(err, idx) in testReport.errorDetails" :key="idx" class="leading-relaxed">
              {{ err }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部按鈕 -->
      <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full flex justify-center">
        <button 
          @click="handleClose"
          class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>💪</span>
          <span>我知道了，繼續調整組裝</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  level: { type: Object, default: () => ({}) },
  testReport: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close']);

// 防誤觸機制：開啟的前 200ms 不觸發 Esc 或快捷關閉
const canClose = ref(false);

function handleClose() {
  if (!canClose.value) return;
  emit('close');
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    handleClose();
  }
}

onMounted(() => {
  setTimeout(() => {
    canClose.value = true;
  }, 200);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
