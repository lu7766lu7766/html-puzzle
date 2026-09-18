<template>
  <aside class="w-72 sm:w-80 lg:w-96 xl:w-105 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col h-full overflow-hidden transition-colors duration-200">
    <!-- 分頁標籤列 -->
    <div class="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 flex items-center justify-between">
      <div class="flex items-center space-x-1 bg-slate-200/70 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-extrabold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>
    </div>

    <!-- 分頁內容容器 -->
    <div class="flex-1 p-2.5 sm:p-3 overflow-hidden">
      <!-- 1. 真實網頁即時預覽 (我的進度) -->
      <LiveBrowserPreview 
        v-show="activeTab === 'preview'" 
        :html-snippet="htmlCode" 
      />

      <!-- 2. 最終成果目標預覽 (依圖施做) -->
      <LiveBrowserPreview 
        v-show="activeTab === 'target'" 
        :html-snippet="targetHtml"
        :is-target="true"
      />

      <!-- 3. HTML 原始碼檢視器 -->
      <CodeHighlighter 
        v-show="activeTab === 'code'" 
        :code="htmlCode" 
      />
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import LiveBrowserPreview from './LiveBrowserPreview.vue';
import CodeHighlighter from './CodeHighlighter.vue';

defineProps({
  htmlCode: { type: String, default: '' },
  targetHtml: { type: String, default: '' },
  canvasNodes: { type: Array, default: () => [] }
});

const activeTab = ref('preview');

const tabs = [
  { id: 'preview', name: '我的預覽', icon: '🌐' },
  { id: 'target', name: '成果目標', icon: '🎯' },
  { id: 'code', name: '原始碼', icon: '💻' }
];

function setTab(tabId) {
  activeTab.value = tabId;
}

defineExpose({ setTab, activeTab });
</script>
