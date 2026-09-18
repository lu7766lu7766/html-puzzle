<template>
  <div class="relative group my-1.5 transition-all">
    <!-- 頂部插入導引區 (Drop Before) -->
    <div 
      v-if="draggingBlock"
      class="transition-all duration-150 relative z-30"
      :class="[
        dropPos === 'before' 
          ? 'h-9 my-1.5 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 flex items-center justify-center shadow-md animate-pulse' 
          : 'h-2.5 -my-1 opacity-0 hover:opacity-100'
      ]"
      @dragover.prevent.stop="dropPos = 'before'"
      @dragleave.stop="onDropZoneLeave($event, 'before')"
      @drop.stop="onDropRelative('before', $event)"
    >
      <span v-if="dropPos === 'before'" class="text-xs font-mono font-extrabold text-indigo-700 dark:text-indigo-300 pointer-events-none flex items-center gap-1.5">
        <span>⬆ 插入在 &lt;{{ node.tag || node.label || '此積木' }}&gt; 之前</span>
      </span>
    </div>

    <!-- 1. 成對容器積木 (Container) -->
    <div 
      v-if="node.type === 'container'" 
      class="rounded-xl border border-indigo-300 dark:border-indigo-700/60 bg-white dark:bg-slate-900/90 shadow-sm overflow-hidden transition-colors"
    >
      <!-- 容器起始標籤頂條 (Opening Bar) -->
      <div 
        class="px-3 py-2 bg-indigo-50/80 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-900/90 border-b border-indigo-200 dark:border-indigo-900/40 flex items-center justify-between gap-2 puzzle-notch-top select-none"
        @dragover.prevent.stop="onOpeningBarDragOver"
        @dragleave.stop="onOpeningBarDragLeave"
        @drop.stop="onOpeningBarDrop"
      >
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <!-- 拖曳搬移手把 -->
          <span 
            draggable="true"
            @dragstart.stop="onNodeDragStart"
            @dragend="onNodeDragEnd"
            class="cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-mono px-1 py-0.5 rounded hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
            title="按住拖曳可調整此容器位置"
          >
            ⠿
          </span>

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

      <!-- 開頭即時插入提示 (Opening Bar Hover Preview) -->
      <div 
        v-if="openingBarDropPos === 'inside-start'" 
        class="p-2 mx-3 my-1 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-bold flex items-center justify-between shadow-sm animate-pulse"
      >
        <span>📥 置入 &lt;{{ node.tag }}&gt; 內部最上方：{{ draggingBlock?.label || draggingBlock?.tag }}</span>
        <span class="text-xs font-sans px-1.5 py-0.5 rounded bg-emerald-200/50 dark:bg-emerald-950">插在開頭</span>
      </div>

      <!-- 容器內部巢狀插槽 (Nested Slot) -->
      <div 
        class="pl-4 pr-3 py-2.5 border-l-2 border-indigo-400 dark:border-indigo-500/30 ml-4 my-1 space-y-2 bg-slate-50/50 dark:bg-slate-950/20"
        @dragover.prevent.stop="isContainerDragOver = true"
        @dragleave.stop="onContainerDragLeave"
        @drop.stop="onDropInsideContainer('end', $event)"
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

        <!-- 容器內部最上方快速落點（有子元素時顯示） -->
        <div 
          v-if="draggingBlock && node.children && node.children.length > 0"
          class="transition-all duration-150 relative z-20"
          :class="[
            containerInnerDropPos === 'start'
              ? 'h-8 my-1 rounded-lg border-2 border-dashed border-emerald-500 bg-emerald-500/20 flex items-center justify-center animate-pulse'
              : 'h-2 -my-1 opacity-0 hover:opacity-100'
          ]"
          @dragover.prevent.stop="containerInnerDropPos = 'start'"
          @dragleave.stop="containerInnerDropPos = null"
          @drop.stop="onDropInsideContainer('start', $event)"
        >
          <span v-if="containerInnerDropPos === 'start'" class="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 pointer-events-none">
            📥 插入至 &lt;{{ node.tag }}&gt; 內部最上方
          </span>
        </div>

        <!-- 遞迴子節點清單 -->
        <div v-if="node.children && node.children.length > 0" class="space-y-1">
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
            @drop-relative="$emit('drop-relative', $event)"
          />
        </div>

        <!-- 容器內部拖曳即時半透明預覽 (Ghost Preview inside empty container) -->
        <div 
          v-if="isContainerDragOver && draggingBlock && (!node.children || node.children.length === 0)" 
          class="my-1.5 p-2 rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 opacity-70 flex items-center justify-between text-xs font-mono font-bold pointer-events-none animate-pulse"
        >
          <span>📥 即將置入 &lt;{{ node.tag }}&gt; 內部：{{ draggingBlock.label || draggingBlock.tag }}</span>
          <span class="text-xs font-sans px-1.5 py-0.5 rounded bg-indigo-200/50 dark:bg-indigo-950">半透明預覽</span>
        </div>

        <!-- 嵌套拖曳置放輔助引導槽 (Bottom Slot) -->
        <div 
          class="py-2 px-3 border border-dashed border-indigo-300 dark:border-indigo-800/40 rounded-lg text-center text-xs font-semibold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20 hover:border-indigo-500 transition-all cursor-pointer"
          :class="containerInnerDropPos === 'end' ? 'bg-indigo-500/20 border-indigo-500 ring-2 ring-indigo-400 animate-pulse' : ''"
          @dragover.prevent.stop="containerInnerDropPos = 'end'"
          @dragleave.stop="containerInnerDropPos = null"
          @drop.stop="onDropInsideContainer('end', $event)"
          @click="promptAddChild"
        >
          <span>📥 點此或拖曳積木成為 &lt;{{ node.tag }}&gt; 的子元素</span>
        </div>
      </div>

      <!-- 容器結束標籤底條 (Closing Bar) -->
      <div 
        class="px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border-t border-indigo-200 dark:border-indigo-900/30 flex items-center justify-between text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 puzzle-notch-bottom select-none"
        @dragover.prevent.stop="onClosingBarDragOver"
        @dragleave.stop="onClosingBarDragLeave"
        @drop.stop="onClosingBarDrop"
      >
        <span>&lt;/{{ node.tag }}&gt;</span>
        <span class="text-xs text-slate-500 font-sans font-normal">封裝閉合</span>
      </div>
    </div>

    <!-- 2. 自閉合 / 空標籤 (Void Tag) -->
    <div 
      v-else-if="node.type === 'void_tag'"
      class="rounded-xl border border-amber-300 dark:border-amber-600/60 bg-amber-50/60 dark:bg-slate-900/90 shadow-sm p-2.5 sm:p-3 flex items-center justify-between gap-2 transition-colors select-none"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
    >
      <div class="flex items-center space-x-2 flex-wrap gap-y-1">
        <span 
          draggable="true"
          @dragstart.stop="onNodeDragStart"
          @dragend="onNodeDragEnd"
          class="cursor-grab active:cursor-grabbing text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-mono px-1 py-0.5 rounded hover:bg-white/60 dark:hover:bg-slate-800 transition-colors"
          title="按住拖曳可調整位置"
        >
          ⠿
        </span>
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
              title="移除屬性"
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
      class="rounded-xl border border-indigo-300 dark:border-indigo-500/70 bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-bottom shadow-sm transition-colors select-none"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
    >
      <div class="flex items-center space-x-2">
        <span 
          draggable="true"
          @dragstart.stop="onNodeDragStart"
          @dragend="onNodeDragEnd"
          class="cursor-grab active:cursor-grabbing text-indigo-400 hover:text-indigo-600 text-sm font-mono px-1 py-0.5 rounded hover:bg-white/60 transition-colors"
          title="按住拖曳可調整位置"
        >
          ⠿
        </span>
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
      class="rounded-xl border border-purple-300 dark:border-purple-500/70 bg-purple-50/70 dark:bg-purple-950/40 p-2.5 sm:p-3 flex items-center justify-between puzzle-notch-top shadow-sm transition-colors select-none"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
    >
      <div class="flex items-center space-x-2">
        <span 
          draggable="true"
          @dragstart.stop="onNodeDragStart"
          @dragend="onNodeDragEnd"
          class="cursor-grab active:cursor-grabbing text-purple-400 hover:text-purple-600 text-sm font-mono px-1 py-0.5 rounded hover:bg-white/60 transition-colors"
          title="按住拖曳可調整位置"
        >
          ⠿
        </span>
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
      class="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-2.5 sm:p-3 flex items-center justify-between shadow-sm transition-colors select-none"
      @dragover.prevent.stop="onCardDragOver"
      @dragleave.stop="onCardDragLeave"
      @drop.stop="onCardDrop"
    >
      <div class="flex items-center space-x-2 flex-1 mr-2">
        <span 
          draggable="true"
          @dragstart.stop="onNodeDragStart"
          @dragend="onNodeDragEnd"
          class="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 text-sm font-mono px-1 py-0.5 rounded hover:bg-white/60 transition-colors"
          title="按住拖曳可調整位置"
        >
          ⠿
        </span>
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

    <!-- 底部插入導引區 (Drop After) -->
    <div 
      v-if="draggingBlock"
      class="transition-all duration-150 relative z-30"
      :class="[
        dropPos === 'after' 
          ? 'h-9 my-1.5 rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-500/20 flex items-center justify-center shadow-md animate-pulse' 
          : 'h-2.5 -my-1 opacity-0 hover:opacity-100'
      ]"
      @dragover.prevent.stop="dropPos = 'after'"
      @dragleave.stop="onDropZoneLeave($event, 'after')"
      @drop.stop="onDropRelative('after', $event)"
    >
      <span v-if="dropPos === 'after'" class="text-xs font-mono font-extrabold text-indigo-700 dark:text-indigo-300 pointer-events-none flex items-center gap-1.5">
        <span>⬇ 插入在 &lt;{{ node.tag || node.label || '此積木' }}&gt; 之後</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

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
  'drop-inside',
  'drop-relative'
]);

const { draggingBlock, setDraggingBlock, clearDraggingBlock } = usePuzzleEngine();

// 拖曳落點狀態
const dropPos = ref(null); // 'before' | 'after'
const openingBarDropPos = ref(null); // 'inside-start'
const containerInnerDropPos = ref(null); // 'start' | 'end'
const isContainerDragOver = ref(false);

// 拖曳現有節點
function onNodeDragStart(e) {
  setDraggingBlock(props.node);
  const data = {
    isExistingNode: true,
    nodeId: props.node.id,
    type: props.node.type,
    tag: props.node.tag,
    label: props.node.label || (props.node.tag ? `<${props.node.tag}>` : props.node.text)
  };
  e.dataTransfer.setData('text/plain', JSON.stringify(data));
  e.dataTransfer.effectAllowed = 'move';
}

function onNodeDragEnd() {
  clearDraggingBlock();
}

// 頂部/底部落點離開事件
function onDropZoneLeave(e, pos) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  if (dropPos.value === pos) {
    dropPos.value = null;
  }
}

// 容器頂條懸停判定
function onOpeningBarDragOver(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  if (e.clientY < midY) {
    dropPos.value = 'before';
    openingBarDropPos.value = null;
  } else {
    dropPos.value = null;
    openingBarDropPos.value = 'inside-start';
  }
}

function onOpeningBarDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  dropPos.value = null;
  openingBarDropPos.value = null;
}

function onOpeningBarDrop(e) {
  if (openingBarDropPos.value === 'inside-start') {
    onDropInsideContainer('start', e);
  } else if (dropPos.value === 'before') {
    onDropRelative('before', e);
  }
}

// 容器底條懸停判定
function onClosingBarDragOver(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  if (e.clientY < midY) {
    containerInnerDropPos.value = 'end';
    dropPos.value = null;
  } else {
    containerInnerDropPos.value = null;
    dropPos.value = 'after';
  }
}

function onClosingBarDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  containerInnerDropPos.value = null;
  dropPos.value = null;
}

function onClosingBarDrop(e) {
  if (containerInnerDropPos.value === 'end') {
    onDropInsideContainer('end', e);
  } else if (dropPos.value === 'after') {
    onDropRelative('after', e);
  }
}

// 非容器卡片本體懸停判定
function onCardDragOver(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  dropPos.value = e.clientY < midY ? 'before' : 'after';
}

function onCardDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  dropPos.value = null;
}

function onCardDrop(e) {
  const pos = dropPos.value || 'after';
  onDropRelative(pos, e);
}

function onContainerDragLeave(e) {
  if (e.currentTarget && e.currentTarget.contains(e.relatedTarget)) return;
  isContainerDragOver.value = false;
  containerInnerDropPos.value = null;
}

// 相對位置釋放 (before / after)
function onDropRelative(position, e) {
  dropPos.value = null;
  openingBarDropPos.value = null;
  containerInnerDropPos.value = null;
  isContainerDragOver.value = false;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      emit('drop-relative', {
        targetNodeId: props.node.id,
        position,
        block
      });
    }
  } catch (err) {}
}

// 容器內釋放 (start / end)
function onDropInsideContainer(position = 'end', e) {
  isContainerDragOver.value = false;
  containerInnerDropPos.value = null;
  openingBarDropPos.value = null;
  clearDraggingBlock();
  try {
    const raw = e.dataTransfer.getData('text/plain');
    if (raw) {
      const block = JSON.parse(raw);
      emit('drop-inside', {
        targetContainerId: props.node.id,
        position,
        block
      });
    }
  } catch (err) {}
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
      position: 'end',
      block: { type: 'text', text } 
    });
  }
}
</script>
