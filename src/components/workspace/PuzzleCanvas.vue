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
          class="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors shadow-sm cursor-pointer"
        >
          🗑️ 清空畫布
        </button>
      </div>
    </div>

    <!-- 新手引導橫幅：首次進入容器巢狀關卡提示 -->
    <div 
      v-if="isNestingTutorialLevel && showNestingTip"
      class="mx-3 sm:mx-4 mt-2.5 p-3 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-amber-500/10 border border-indigo-400/50 dark:border-indigo-600/50 shadow-sm flex items-start justify-between gap-3 text-xs leading-relaxed shrink-0 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <div class="flex items-start gap-2.5">
        <span class="text-xl sm:text-2xl shrink-0 mt-0.5">🧩</span>
        <div class="space-y-1">
          <div class="font-extrabold text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm flex items-center gap-1.5 flex-wrap">
            <span>新手教學：本關解鎖「容器巢狀模式（Container）」！</span>
            <span class="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold border border-indigo-300 dark:border-indigo-700">
              重要心智模型
            </span>
          </div>
          <p class="text-slate-700 dark:text-slate-300 text-xs sm:text-[13px]">
            網頁結構如同俄羅斯娃娃：請先放入外層根元素（如 <code class="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400">&lt;html&gt;</code>），再將子標籤（如 <code class="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400">&lt;head&gt;</code>、<code class="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400">&lt;body&gt;</code>）<strong>直接拖曳放入容器內部的虛線槽位</strong>進行多層包覆！
          </p>
        </div>
      </div>
      <button 
        @click="showNestingTip = false" 
        class="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs px-2 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 font-bold"
        title="收起教學引導"
      >
        ✕
      </button>
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
          class="w-full max-w-md p-4 rounded-xl border-2 border-dashed flex items-center justify-between shadow-lg pointer-events-none transition-all animate-pulse"
          :class="draggingBlock.type === 'attr' ? 'border-amber-500 bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'border-indigo-500 bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 opacity-70'"
        >
          <div class="flex items-center space-x-2">
            <span class="font-mono text-sm font-extrabold px-2.5 py-0.5 rounded border" :class="draggingBlock.type === 'attr' ? 'bg-amber-100 dark:bg-amber-900/60 border-amber-300 dark:border-amber-700' : 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-300 dark:border-indigo-700'">
              {{ draggingBlock.label || ('<' + draggingBlock.tag + '>') }}
            </span>
            <span class="text-xs font-bold font-sans">
              {{ draggingBlock.type === 'attr' ? '⚠️ 目前組裝區沒有可以加入屬性的標籤' : '✨ 放開滑鼠即可固定為實體積木' }}
            </span>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded" :class="draggingBlock.type === 'attr' ? 'bg-amber-200/50 dark:bg-amber-950 text-amber-800 dark:text-amber-200' : 'bg-indigo-200/50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200'">
            {{ draggingBlock.type === 'attr' ? '無法單獨放置' : '半透明預覽' }}
          </span>
        </div>

        <template v-else>
          <div class="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800/40 flex items-center justify-center text-2xl mb-3 shadow-inner">
            {{ isNestingTutorialLevel ? '🏛️' : '🧩' }}
          </div>
          <h3 class="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1">
            {{ isNestingTutorialLevel ? '骨架起手式：先建立 DOCTYPE 與 html 根容器' : '工作區已就緒（請開始組裝）' }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mb-4 leading-relaxed font-medium">
            <template v-if="isNestingTutorialLevel">
              第 1 步先加入 <span class="font-mono font-bold text-amber-600 dark:text-amber-400">&lt;!DOCTYPE html&gt;</span>，第 2 步加入 <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">&lt;html&gt;</span> 容器，再把 head 與 body 放進 html 容器內部！
            </template>
            <template v-else>
              請從左側「<span class="text-indigo-600 dark:text-indigo-400 font-bold">積木工具箱</span>」點選或拖曳標籤積木進來，親手拼出網頁結構！
            </template>
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
import { ref, computed, watch } from 'vue';
import PuzzleNode from './PuzzleNode.vue';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

const props = defineProps({
  canvasNodes: { type: Array, required: true },
  currentLevel: { type: Object, default: () => ({}) }
});

const isNestingTutorialLevel = computed(() => props.currentLevel?.id === 'stage-3');
const showNestingTip = ref(true);

watch(() => props.currentLevel?.id, () => {
  showNestingTip.value = true;
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
