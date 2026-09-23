<template>
  <aside class="w-72 sm:w-80 lg:w-96 xl:w-105 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col h-full overflow-hidden transition-colors duration-200">
    <!-- 分頁標籤列 -->
    <div class="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 flex items-center justify-between gap-2">
      <!-- 區塊一：我的預覽與原始碼 -->
      <div class="flex items-center space-x-1 bg-slate-200/70 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm">
        <button
          v-for="tab in mainTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-extrabold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 whitespace-nowrap cursor-pointer"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <!-- 區塊二：成果目標 (獨立於最右邊) -->
      <div class="flex items-center bg-slate-200/70 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-300 dark:border-slate-800 text-xs sm:text-sm">
        <button
          @click="selectTargetTab"
          :class="activeTab === 'target' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white font-extrabold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
          class="px-2.5 sm:px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer relative"
        >
          <!-- 成果目標呼吸燈提示 -->
          <span v-if="!hasSeenTarget" class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>🎯</span>
          <span>成果目標</span>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hidden sm:inline-block">
            依圖施做
          </span>
        </button>
      </div>
    </div>

    <!-- 依圖施做溫馨引導條 (當停留在我的預覽且尚未查看過成果目標時) -->
    <div 
      v-if="activeTab === 'preview' && !hasSeenTarget"
      class="bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border-b border-emerald-200/80 dark:border-emerald-800/50 px-3 py-1.5 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2 transition-all shrink-0"
    >
      <div class="flex items-center gap-1.5 truncate">
        <span class="shrink-0 text-emerald-600 dark:text-emerald-400 font-bold">💡</span>
        <span class="truncate font-medium">解題撇步：可先點成果目標，依樣品排版！</span>
      </div>
      <button 
        @click="selectTargetTab"
        class="shrink-0 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700 transition-colors cursor-pointer"
      >
        查看目標 ➔
      </button>
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
import { ref, watch } from 'vue';
import LiveBrowserPreview from './LiveBrowserPreview.vue';
import CodeHighlighter from './CodeHighlighter.vue';

const props = defineProps({
  htmlCode: { type: String, default: '' },
  targetHtml: { type: String, default: '' },
  canvasNodes: { type: Array, default: () => [] },
  currentLevelId: { type: String, default: '' }
});

const activeTab = ref('preview');
const hasSeenTarget = ref(false);

const mainTabs = [
  { id: 'preview', name: '我的預覽', icon: '🌐' },
  { id: 'code', name: '原始碼', icon: '💻' }
];

// 當切換新關卡時，重設 hasSeenTarget 狀態以提醒新手查看新目標
watch(() => props.currentLevelId, () => {
  hasSeenTarget.value = false;
});

function selectTargetTab() {
  activeTab.value = 'target';
  hasSeenTarget.value = true;
}

function setTab(tabId) {
  activeTab.value = tabId;
  if (tabId === 'target') {
    hasSeenTarget.value = true;
  }
}

defineExpose({ setTab, activeTab });
</script>
