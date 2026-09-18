<template>
  <div class="h-full bg-slate-950 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 flex flex-col overflow-hidden font-mono text-xs sm:text-sm shadow-sm">
    <!-- 頂部代碼工具列 -->
    <div class="px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between transition-colors">
      <div class="flex items-center space-x-2 text-slate-700 dark:text-slate-400 font-semibold">
        <span class="text-indigo-600 dark:text-indigo-400 font-bold">index.html</span>
        <span class="text-xs text-slate-500 font-sans">HTML5 原始碼</span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- 複製代碼 -->
        <button 
          @click="copyCode"
          class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-sans font-bold flex items-center space-x-1 border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
        >
          <span>{{ copied ? '✓ 已複製！' : '📋 複製 HTML' }}</span>
        </button>

        <!-- 下載檔案 -->
        <button 
          @click="downloadHtml"
          class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-sans font-bold flex items-center space-x-1 transition-colors shadow-sm"
        >
          <span>⬇ 下載檔案</span>
        </button>
      </div>
    </div>

    <!-- 代碼高亮區 -->
    <div class="flex-1 overflow-y-auto p-3 sm:p-4 flex bg-slate-950 text-slate-100">
      <!-- 行號列 -->
      <div class="select-none text-slate-600 pr-3 border-r border-slate-800 text-right space-y-0.5 text-xs sm:text-sm">
        <div v-for="lineNum in lines.length" :key="lineNum">{{ lineNum }}</div>
      </div>

      <!-- 代碼本體 -->
      <pre class="pl-3 sm:pl-4 flex-1 text-slate-200 leading-relaxed overflow-x-auto whitespace-pre font-mono text-xs sm:text-sm"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  code: { type: String, default: '' }
});

const copied = ref(false);

const lines = computed(() => {
  return props.code.split('\n');
});

function copyCode() {
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
}

function downloadHtml() {
  const blob = new Blob([props.code], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>
