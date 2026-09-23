<template>
  <div class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden transition-colors">
      <!-- 頂部慶祝光芒裝飾 -->
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- 成功大圖示 -->
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 mb-3 animate-bounce">
        🎉
      </div>

      <span class="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">MISSION COMPLETED!</span>
      <h3 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">恭喜特工通關！</h3>
      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
        你成功完成了「{{ level.title }}」的網頁架構拼裝！
      </p>

      <!-- 獲得星星評定 -->
      <div class="flex items-center space-x-2 my-3 sm:my-4">
        <span 
          v-for="s in 3" 
          :key="s" 
          class="text-3xl sm:text-4xl transition-transform transform duration-300"
          :class="s <= testReport.stars ? 'text-amber-400 scale-110 drop-shadow-md animate-pulse' : 'text-slate-300 dark:text-slate-700'"
        >
          ★
        </span>
      </div>

      <!-- 獲得徽章卡片 -->
      <div class="w-full bg-amber-50/80 dark:bg-slate-950/70 border border-amber-200 dark:border-slate-800 rounded-2xl p-3.5 mb-4 flex items-center space-x-3 text-left">
        <div class="w-11 h-11 rounded-xl bg-amber-200/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center text-2xl shrink-0">
          🏆
        </div>
        <div>
          <div class="flex items-center space-x-1.5">
            <span class="text-xs text-amber-700 dark:text-amber-400 font-extrabold uppercase">解鎖專屬成就</span>
            <span class="text-xs text-slate-400 font-mono">Stage Reward</span>
          </div>
          <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">{{ level.badge }}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{{ level.learningGoal }}</p>
        </div>
      </div>

      <!-- 下一步操作按鈕 -->
      <div class="w-full flex flex-col sm:flex-row items-center gap-2.5">
        <button 
          v-if="hasNextLevel"
          @click="$emit('next-level')"
          class="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          前往下一關 ➔
        </button>

        <button 
          @click="$emit('close')"
          class="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs sm:text-sm transition-colors"
        >
          留在本關把玩
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
  level: { type: Object, required: true },
  testReport: { type: Object, required: true },
  hasNextLevel: { type: Boolean, default: false }
});

defineEmits(['next-level', 'close']);

onMounted(() => {
  // 觸發彩色紙片特效
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });
});
</script>
