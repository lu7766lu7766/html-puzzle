<template>
  <div class="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-inner border border-slate-700/50">
    <!-- 瀏覽器擬真頂部網址列 -->
    <div 
      :class="isTarget ? 'bg-indigo-50/80 border-b border-indigo-200' : 'bg-slate-100 border-b border-slate-200'"
      class="px-3 py-1.5 flex items-center space-x-2 select-none transition-colors"
    >
      <div class="flex items-center space-x-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
      </div>
      <div 
        :class="isTarget ? 'bg-white border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'"
        class="flex-1 border rounded-md px-2.5 py-0.5 text-[11px] font-mono truncate flex items-center space-x-1.5"
      >
        <span>{{ isTarget ? '🎯' : '🔒' }}</span>
        <span>{{ isTarget ? 'http://localhost:8080/target-goal.html' : 'http://localhost:8080/my-preview.html' }}</span>
      </div>
      <span 
        v-if="isTarget" 
        class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-300 uppercase tracking-wider"
      >
        目標成果
      </span>
      <span 
        v-else 
        class="text-[10px] font-bold text-slate-400 uppercase tracking-wider"
      >
        我的預覽
      </span>
    </div>

    <!-- 目標成果提示橫條 -->
    <div 
      v-if="isTarget"
      class="bg-indigo-50 border-b border-indigo-100 px-3 py-1.5 text-xs text-indigo-800 font-bold flex items-center justify-between"
    >
      <span class="flex items-center gap-1.5">
        <span>💡</span>
        <span>本關目標成品外觀，請依此畫面組裝積木</span>
      </span>
      <span class="text-[11px] font-normal text-indigo-600">可在此操作測試</span>
    </div>

    <!-- 渲染 iframe 容器 -->
    <div class="flex-1 w-full h-full relative bg-white">
      <iframe
        ref="previewFrame"
        :srcdoc="fullDocumentHtml"
        class="w-full h-full border-none"
        sandbox="allow-scripts allow-modals allow-same-origin"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  htmlSnippet: { type: String, default: '' },
  isTarget: { type: Boolean, default: false }
});

// 若代碼未包含完整 <!DOCTYPE html> 與 <html>，自動包裹預設外殼以供標準渲染
const fullDocumentHtml = computed(() => {
  const code = props.htmlSnippet.trim();
  if (code.toLowerCase().includes('<!doctype') || code.toLowerCase().includes('<html')) {
    return code;
  }

  // 預設樣式注入以利美觀展示
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body {
        font-family: system-ui, -apple-system, sans-serif;
        padding: 16px;
        color: #1e293b;
        line-height: 1.5;
        background-color: #ffffff;
      }
      a { color: #2563eb; }
      label { cursor: pointer; }
      input[type="text"], input[type="password"] {
        padding: 4px 8px;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
      }
      button {
        padding: 6px 12px;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        cursor: pointer;
      }
      button:hover {
        background: #e2e8f0;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    </style>
  </head>
  <body>
    ${code}
  </body>
</html>`;
});
</script>
