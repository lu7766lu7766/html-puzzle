<template>
  <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
      <!-- 標題欄 -->
      <div class="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <span class="text-2xl">📖</span>
          <div>
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">HTML 核心心智模型與避坑手冊</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">清水高中資訊科技課程教材 精華速查</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-lg"
        >
          ✕
        </button>
      </div>

      <!-- 內容區（左側模組目錄 + 右側詳細手冊） -->
      <div class="flex-1 flex overflow-hidden">
        <!-- 模組側欄 -->
        <div class="w-48 sm:w-60 border-r border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/40 p-2 sm:p-3 overflow-y-auto space-y-1">
          <button 
            v-for="mod in modules"
            :key="mod.id"
            @click="selectedModuleId = mod.id"
            :class="selectedModuleId === mod.id ? 'bg-indigo-600 text-white font-extrabold shadow-sm' : 'text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
            class="w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors flex flex-col gap-0.5"
          >
            <span class="text-xs opacity-75 font-mono">{{ mod.tag }}</span>
            <span class="truncate">{{ mod.title }}</span>
          </button>
        </div>

        <!-- 模組精華內容 -->
        <div class="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          <div v-if="currentMod" class="space-y-4">
            <div>
              <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{{ currentMod.tag }}</span>
              <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">{{ currentMod.title }}</h3>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 font-medium">
                💡 {{ currentMod.summary }}
              </p>
            </div>

            <!-- 觀念要點條列 -->
            <div class="space-y-3">
              <div 
                v-for="(point, idx) in currentMod.points" 
                :key="idx"
                class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
              >
                <h4 class="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                  <span>📌</span>
                  <span>{{ point.title }}</span>
                </h4>
                <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                  {{ point.desc }}
                </p>
              </div>
            </div>

            <!-- 範例代碼 -->
            <div v-if="currentMod.codeSnippet" class="space-y-1">
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">標準範例語法：</span>
              <pre class="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto"><code>{{ currentMod.codeSnippet }}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部關閉按鈕 -->
      <div class="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex justify-end">
        <button 
          @click="$emit('close')"
          class="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition-colors"
        >
          關閉手冊 (Esc)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { HANDBOOK_MODULES } from '../../data/handbook';

defineEmits(['close']);

const modules = HANDBOOK_MODULES;
const selectedModuleId = ref(1);

const currentMod = computed(() => {
  return modules.find(m => m.id === selectedModuleId.value) || modules[0];
});
</script>
