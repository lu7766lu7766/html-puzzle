<template>
  <main 
    class="flex-1 bg-slate-100/70 dark:bg-slate-950/70 flex flex-col h-full overflow-hidden relative transition-colors duration-200"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.stop="onDropOnRoot"
  >
    <!-- 畫布控制頂條 -->
    <div class="p-2.5 sm:p-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 flex items-center justify-between text-xs sm:text-sm">
      <div class="flex items-center space-x-2">
        <span class="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span>🏗️</span>
          <span>工作組裝區</span>
        </span>
        <span class="text-xs text-slate-500 font-mono font-semibold">
          ({{ canvasNodes.length }} 個頂層節點)
        </span>
      </div>

      <div class="flex items-center space-x-2">
        <!-- 清空畫布 -->
        <button 
          @click="$emit('clear-canvas')"
          class="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors shadow-sm"
        >
          🗑️ 清空畫布
        </button>
      </div>
    </div>

    <!-- 畫布主體 -->
    <div class="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 relative">
      <!-- 畫布為空時的引導提示 -->
      <div 
        v-if="canvasNodes.length === 0" 
        :class="[
          'h-full min-h-75 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-all duration-200',
          isDragOver && draggingBlock 
            ? 'border-indigo-500 bg-indigo-500/10 shadow-inner' 
            : 'border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20'
        ]"
      >
        <!-- 拖曳中的半透明預覽積木 (Ghost Preview) -->
        <div 
          v-if="isDragOver && draggingBlock" 
          class="w-full max-w-md p-4 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 opacity-70 flex items-center justify-between shadow-lg pointer-events-none transition-all animate-pulse"
        >
          <div class="flex items-center space-x-2">
            <span class="font-mono text-sm font-extrabold px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700">
              {{ draggingBlock.label || ('<' + draggingBlock.tag + '>') }}
            </span>
            <span class="text-xs font-bold font-sans">
              ✨ 放開滑鼠即可固定為實體積木
            </span>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200">
            半透明預覽
          </span>
        </div>

        <template v-else>
          <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800/40 flex items-center justify-center text-2xl mb-3 shadow-inner">
            🧩
          </div>
          <h3 class="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1">工作區已就緒（請開始組裝）</h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mb-4 leading-relaxed font-medium">
            請從左側「<span class="text-indigo-600 dark:text-indigo-400 font-bold">積木工具箱</span>」點選或拖曳標籤積木進來，親手拼出網頁結構！
          </p>
          <div class="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
            <span>👈</span>
            <span>從左側點擊「加入 ➔」或直接拖曳積木</span>
          </div>
        </template>
      </div>

      <!-- 積木節點渲染 -->
      <div v-else class="space-y-2 pb-12">
        <PuzzleNode
          v-for="(node, index) in canvasNodes"
          :key="node.id"
          :node="node"
          :depth="0"
          :can-move-up="index > 0"
          :can-move-down="index < canvasNodes.length - 1"
          @remove-node="$emit('remove-node', $event)"
          @remove-attr="$emit('remove-attr', $event)"
          @add-attr="$emit('add-attr', $event)"
          @update-attr="$emit('update-attr', $event)"
          @move-node="onMoveNode"
          @drop-inside="$emit('drop-inside', $event)"
          @drop-relative="$emit('drop-relative', $event)"
        />

        <!-- 拖曳中的半透明預覽積木 (Ghost Preview) -->
        <div 
          v-if="isDragOver && draggingBlock" 
          class="my-2 p-3 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 opacity-60 flex items-center justify-between shadow-lg pointer-events-none transition-all animate-pulse"
        >
          <div class="flex items-center space-x-2">
            <span class="font-mono text-sm font-extrabold px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700">
              {{ draggingBlock.label || ('<' + draggingBlock.tag + '>') }}
            </span>
            <span class="text-xs font-bold font-sans">
              ✨ 放開滑鼠即可固定為實體積木
            </span>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200">
            半透明預覽
          </span>
        </div>

        <!-- 底部快速落點 -->
        <div 
          class="py-3 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center text-xs sm:text-sm font-semibold text-slate-500 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer"
          @dragover.prevent.stop="isDragOver = true"
          @drop.stop="onDropOnRoot"
        >
          ⬇ 拖曳或加入更多標籤至最外層
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import PuzzleNode from './PuzzleNode.vue';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

const props = defineProps({
  canvasNodes: { type: Array, required: true }
});

const emit = defineEmits([
  'add-root-block',
  'remove-node',
  'remove-attr',
  'add-attr',
  'update-attr',
  'clear-canvas',
  'drop-inside',
  'drop-relative',
  'move-node',
  'reorder-root-nodes'
]);

const { draggingBlock, clearDraggingBlock, moveNode } = usePuzzleEngine();
const isDragOver = ref(false);

function onDragOver() {
  isDragOver.value = true;
}

function onDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  isDragOver.value = false;
}

function onDropOnRoot(e) {
  isDragOver.value = false;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      emit('add-root-block', block);
    }
  } catch (err) {}
}

function onMoveNode({ nodeId, dir }) {
  moveNode(nodeId, dir);
  emit('move-node', { nodeId, dir });
}
</script>
