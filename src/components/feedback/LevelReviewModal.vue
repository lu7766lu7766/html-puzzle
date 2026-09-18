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
      <div class="flex flex-col items-center text-center mb-4">
        <div class="w-14 h-14 rounded-2xl bg-linear-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/20 mb-2.5">
          🛠️
        </div>
        <span class="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          MISSION INCOMPLETE
        </span>
        <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          驗收尚未達標，還差一點點！
        </h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium max-w-md">
          請對照下方檢核清單與避坑提示，調整畫布中的積木或屬性後再次提交！
        </p>
      </div>

      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        <!-- 未通過項目診斷 -->
        <div v-if="testReport.errorDetails && testReport.errorDetails.length > 0" class="rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3.5 text-left">
          <div class="flex items-center space-x-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 mb-2">
            <span>🚨</span>
            <span>待修正或未達成項目：</span>
          </div>
          <ul class="space-y-1.5 text-xs text-rose-800 dark:text-rose-200 font-mono">
            <li 
              v-for="(err, idx) in testReport.errorDetails" 
              :key="idx"
              class="flex items-start gap-1.5 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-rose-200/60 dark:border-rose-900/40"
            >
              <span class="text-rose-500 shrink-0 mt-0.5 font-sans">❌</span>
              <span class="leading-relaxed font-sans font-semibold">{{ err }}</span>
            </li>
          </ul>
        </div>

        <!-- 已通過項目 -->
        <div v-if="testReport.logs && testReport.logs.length > 0" class="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 p-3 text-left">
          <div class="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">
            <span>✅</span>
            <span>目前已達成項目：</span>
          </div>
          <ul class="space-y-1 text-xs text-emerald-800 dark:text-emerald-200 font-mono">
            <li 
              v-for="(log, idx) in testReport.logs" 
              :key="idx"
              class="flex items-center gap-1.5 font-sans font-medium"
            >
              <span class="text-emerald-500 shrink-0">✔</span>
              <span>{{ log }}</span>
            </li>
          </ul>
        </div>

        <!-- 避坑錦囊指引 -->
        <div v-if="level.hint" class="rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 p-3.5 text-left">
          <div class="flex items-center space-x-1.5 text-xs font-extrabold text-indigo-800 dark:text-indigo-300 mb-1">
            <span>💡</span>
            <span>本關避坑錦囊指引：</span>
          </div>
          <p class="text-xs text-indigo-950 dark:text-indigo-200 whitespace-pre-line leading-relaxed font-sans font-medium">
            {{ level.hint }}
          </p>
        </div>
      </div>

      <!-- 底部按鈕 -->
      <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
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
  level: { type: Object, required: true },
  testReport: { type: Object, required: true }
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
