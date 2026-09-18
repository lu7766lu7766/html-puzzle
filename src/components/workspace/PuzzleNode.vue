<template>
  <div class="relative group my-2 transition-all">
    <!-- 1. 成對容器積木 (Container) -->
    <div 
      v-if="node.type === 'container'" 
      class="rounded-xl border border-indigo-300 dark:border-indigo-700/60 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-colors"
    >
      <!-- 容器起始標籤頂條 (Opening Bar) -->
      <div class="px-3 py-2 bg-indigo-50/80 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900/90 border-b border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-2 puzzle-notch-top">
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <!-- 標籤名稱 -->
          <span class="font-mono text-sm font-extrabold text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700/50">
            &lt;{{ node.tag }}&gt;
          </span>

          <!-- 屬性晶片展示與自訂 -->
          <div v-if="node.attrs && Object.keys(node.attrs).length > 0" class="flex items-center space-x-1.5 flex-wrap gap-1">
            <span 
              v-for="(val, key) in node.attrs" 
              :key="key"
              class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold"
            >
              <span>{{ key }}="<span class="text-amber-600 dark:text-amber-300">{{ val }}</span>"</span>
              <button 
                @click.stop="$emit('remove-attr', { nodeId: node.id, key })"
                class="text-cyan-600 dark:text-cyan-400 hover:text-red-500 ml-1 font-bold"
                title="移除屬性"
              >
                ×
              </button>
            </span>
          </div>

          <!-- 快速增加屬性按鈕 -->
          <button 
            @click="promptAddAttr"
            class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors"
            title="新增屬性 (如 id, class, style)"
          >
            + 屬性
          </button>
        </div>

        <!-- 右側操作：上移、下移、刪除 -->
        <div class="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
          <button 
            v-if="canMoveUp" 
            @click="$emit('move-node', { nodeId: node.id, dir: -1 })"
            class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold"
            title="上移"
          >
            ▲
          </button>
          <button 
            v-if="canMoveDown" 
            @click="$emit('move-node', { nodeId: node.id, dir: 1 })"
            class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold"
            title="下移"
          >
            ▼
          </button>
          <button 
            @click="$emit('remove-node', node.id)"
            class="p-1 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-sm font-bold transition-colors ml-1"
            title="刪除積木"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 容器內部巢狀插槽 (Nested Slot) -->
      <div 
        class="pl-4 pr-3 py-2.5 border-l-2 border-indigo-400 dark:border-indigo-500/30 ml-4 my-1 space-y-2.5 bg-slate-50/50 dark:bg-slate-950/20"
        @dragover.prevent.stop="isContainerDragOver = true"
        @dragleave.stop="onContainerDragLeave"
        @drop.stop="onDropChild"
      >
        <!-- 包含文字內容編輯 -->
        <div v-if="node.text !== undefined" class="flex items-center space-x-2">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">內容:</span>
          <input 
            v-model="node.text" 
            type="text" 
            placeholder="填寫元素內容..."
            class="flex-1 bg-white dark:bg-slate-950/60 border border-slate-300 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <!-- 遞迴子節點清單 -->
        <div v-if="node.children && node.children.length > 0" class="space-y-2">
          <PuzzleNode
            v-for="(child, cIdx) in node.children"
            :key="child.id"
            :node="child"
            :depth="depth + 1"
            :can-move-up="cIdx > 0"
            :can-move-down="cIdx < node.children.length - 1"
            @remove-node="$emit('remove-node', $event)"
            @remove-attr="$emit('remove-attr', $event)"
            @add-attr="$emit('add-attr', $event)"
            @move-node="$emit('move-node', $event)"
            @drop-inside="$emit('drop-inside', $event)"
          />
        </div>

        <!-- 容器內部拖曳即時半透明預覽 (Ghost Preview inside container) -->
        <div 
          v-if="isContainerDragOver && draggingBlock" 
          class="my-1.5 p-2 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 opacity-60 flex items-center justify-between text-xs font-mono font-bold pointer-events-none animate-pulse"
        >
          <span>📥 即將置入 &lt;{{ node.tag }}&gt; 內部：{{ draggingBlock.label || draggingBlock.tag }}</span>
          <span class="text-xs font-sans px-1.5 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-950">半透明預覽</span>
        </div>

        <!-- 嵌套拖曳置放輔助引導槽 -->
        <div 
          class="py-2 px-3 border border-dashed border-indigo-300 dark:border-indigo-800/40 rounded-lg text-center text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20 hover:border-indigo-500 transition-all cursor-pointer"
          @click="promptAddChild"
        >
          <span>📥 點此或拖曳積木成為 &lt;{{ node.tag }}&gt; 的子元素</span>
        </div>
      </div>

      <!-- 容器結束標籤底條 (Closing Bar) -->
      <div class="px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-900/30 flex items-center justify-between text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 puzzle-notch-bottom">
        <span>&lt;/{{ node.tag }}&gt;</span>
        <span class="text-xs text-slate-500 font-sans font-normal">封裝閉合</span>
      </div>
    </div>

    <!-- 2. 自閉合 / 空標籤 (Void Tag) -->
    <div 
      v-else-if="node.type === 'void_tag'"
      class="rounded-xl border border-amber-300 dark:border-amber-600/60 bg-amber-50/60 dark:bg-slate-900/90 shadow-sm p-2.5 sm:p-3 flex items-center justify-between gap-2 transition-colors"
    >
      <div class="flex items-center space-x-2 flex-wrap gap-y-1">
        <span class="font-mono text-sm font-extrabold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60">
          <template v-if="node.tag === '!DOCTYPE html'">&lt;!DOCTYPE html&gt;</template>
          <template v-else>&lt;{{ node.tag }} /&gt;</template>
        </span>
        <span class="text-xs px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-950 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-800/60">
          空標籤 (自閉合)
        </span>

        <!-- 屬性標籤 -->
        <div v-if="node.attrs && Object.keys(node.attrs).length > 0" class="flex items-center space-x-1.5 flex-wrap gap-1">
          <span 
            v-for="(val, key) in node.attrs" 
            :key="key"
            class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold"
          >
            <span>{{ key }}="<span class="text-amber-600 dark:text-amber-300">{{ val }}</span>"</span>
            <button 
              @click.stop="$emit('remove-attr', { nodeId: node.id, key })"
              class="text-cyan-600 dark:text-cyan-400 hover:text-red-500 ml-1 font-bold"
            >
              ×
            </button>
          </span>
        </div>

        <button 
          v-if="node.tag !== '!DOCTYPE html'"
          @click="promptAddAttr"
          class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-cyan-300 px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
        >
          + 屬性
        </button>
      </div>

      <div class="flex items-center space-x-1">
        <button 
          v-if="canMoveUp" 
          @click="$emit('move-node', { nodeId: node.id, dir: -1 })"
          class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold"
        >
          ▲
        </button>
        <button 
          v-if="canMoveDown" 
          @click="$emit('move-node', { nodeId: node.id, dir: 1 })"
          class="p-1 hover:text-slate-900 dark:hover:text-white rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold"
        >
          ▼
        </button>
        <button 
          @click="$emit('remove-node', node.id)"
          class="p-1 text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-sm font-bold ml-1"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- 3. Strict 模式下的起始標籤 (open_tag) -->
    <div 
      v-else-if="node.type === 'open_tag'"
      class="rounded-xl border border-indigo-300 dark:border-indigo-500/70 bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-bottom shadow-sm transition-colors"
    >
      <div class="flex items-center space-x-2">
        <span class="font-mono text-sm font-extrabold text-indigo-700 dark:text-indigo-300">&lt;{{ node.tag }}&gt;</span>
        <span class="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-bold">起始標籤</span>
      </div>
      <div class="flex items-center space-x-1">
        <button v-if="canMoveUp" @click="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▲</button>
        <button v-if="canMoveDown" @click="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▼</button>
        <button @click="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1">✕</button>
      </div>
    </div>

    <!-- 4. Strict 模式下的結束標籤 (close_tag) -->
    <div 
      v-else-if="node.type === 'close_tag'"
      class="rounded-xl border border-purple-300 dark:border-purple-500/70 bg-purple-50/70 dark:bg-purple-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-top shadow-sm transition-colors"
    >
      <div class="flex items-center space-x-2">
        <span class="font-mono text-sm font-extrabold text-purple-700 dark:text-purple-300">&lt;/{{ node.tag }}&gt;</span>
        <span class="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 font-bold">結束閉合標籤</span>
      </div>
      <div class="flex items-center space-x-1">
        <button v-if="canMoveUp" @click="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▲</button>
        <button v-if="canMoveDown" @click="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▼</button>
        <button @click="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1">✕</button>
      </div>
    </div>

    <!-- 5. 純文字積木 (text) -->
    <div 
      v-else-if="node.type === 'text'"
      class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-2.5 sm:p-3 flex items-center justify-between shadow-sm transition-colors"
    >
      <div class="flex items-center space-x-2 flex-1 mr-2">
        <span class="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">文字內容:</span>
        <input 
          v-model="node.text" 
          type="text" 
          class="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono"
        />
      </div>
      <div class="flex items-center space-x-1">
        <button v-if="canMoveUp" @click="$emit('move-node', { nodeId: node.id, dir: -1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▲</button>
        <button v-if="canMoveDown" @click="$emit('move-node', { nodeId: node.id, dir: 1 })" class="p-1 text-xs hover:text-slate-900 dark:hover:text-white font-bold">▼</button>
        <button @click="$emit('remove-node', node.id)" class="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 text-sm font-bold ml-1">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  node: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false }
});

const emit = defineEmits([
  'remove-node',
  'remove-attr',
  'add-attr',
  'move-node',
  'drop-inside'
]);

import { ref } from 'vue';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

const { draggingBlock, clearDraggingBlock } = usePuzzleEngine();
const isContainerDragOver = ref(false);

function onContainerDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  isContainerDragOver.value = false;
}

function promptAddAttr() {
  const key = window.prompt('請輸入屬性名稱（例如 class, id, style, name, placeholder）：');
  if (!key || !key.trim()) return;
  const val = window.prompt(`請輸入屬性 ${key} 的值：`, '');
  emit('add-attr', { nodeId: props.node.id, key: key.trim(), value: val || '' });
}

function promptAddChild() {
  const text = window.prompt('輸入要放入容器內的文字內容：');
  if (text) {
    emit('drop-inside', { 
      targetContainerId: props.node.id, 
      block: { type: 'text', text } 
    });
  }
}

function onDropChild(e) {
  isContainerDragOver.value = false;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      emit('drop-inside', { targetContainerId: props.node.id, block });
    }
  } catch (err) {}
}
</script>
