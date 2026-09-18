<template>
  <aside class="w-60 sm:w-64 xl:w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col h-full overflow-hidden select-none transition-colors duration-200">
    <!-- 工具箱標題 -->
    <div class="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/50 dark:bg-slate-950/40">
      <div class="flex items-center space-x-1.5">
        <span class="text-base">🧰</span>
        <h2 class="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-200">積木工具箱</h2>
      </div>
      <span class="text-xs text-slate-500 dark:text-slate-400 font-bold font-mono">
        {{ currentCategoryName }}
      </span>
    </div>

    <!-- 分類切換標籤 (展開模式) -->
    <div v-if="showAllCategories" class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/60 p-1 gap-1 overflow-x-auto text-xs">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="activeCategory = cat.id"
        :class="activeCategory === cat.id ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
        class="px-2 py-1 rounded-md whitespace-nowrap transition-colors font-medium"
      >
        {{ cat.name }}
      </button>
    </div>

    <!-- 積木零件清單 -->
    <div class="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5">
      <!-- 關卡專屬推薦積木 -->
      <div v-if="!showAllCategories">
        <div class="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center justify-between">
          <div class="flex items-center space-x-1.5">
            <span>🎯 本關任務零件</span>
            <button 
              @click="reshuffle" 
              title="重新打亂零件順序" 
              class="text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 transition-colors flex items-center gap-1 font-sans"
            >
              <span>🔀</span>
              <span class="text-[10px]">打亂</span>
            </button>
          </div>
          <span class="text-xs text-slate-500 font-normal">點擊或拖曳</span>
        </div>
        <div class="space-y-2">
          <div 
            v-for="block in levelBlocks" 
            :key="block.id"
            draggable="true"
            @dragstart="onDragStart($event, block)"
            @dragend="onDragEnd"
            @click="$emit('add-block', block)"
            :class="[
              activeDraggingId === (block.id || block.label) ? 'opacity-40 scale-95 border-dashed border-indigo-400' : 'opacity-100',
              'group p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all shadow-sm hover:shadow-md flex flex-col gap-1.5 relative overflow-hidden'
            ]"
          >
            <!-- 卡榫左側視覺裝飾線 -->
            <div class="absolute left-0 top-0 bottom-0 w-1.5" :class="getBlockColorBar(block)"></div>

            <div class="flex items-center justify-between pl-1.5">
              <span class="font-mono text-sm font-extrabold tracking-tight" :class="getBlockTextColor(block)">
                {{ block.label }}
              </span>
              <span class="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono border border-slate-200 dark:border-slate-800">
                {{ getBlockBadge(block) }}
              </span>
            </div>

            <div v-if="block.text" class="text-xs text-slate-600 dark:text-slate-200 pl-1.5 truncate font-medium">
              內文：{{ block.text }}
            </div>

            <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 pl-1.5 font-medium">
              <span>{{ getBlockDesc(block) }}</span>
              <span class="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">加入 ➔</span>
            </div>
          </div>
        </div>

        <!-- 切換顯示完整庫按鈕 -->
        <button 
          @click="showAllCategories = true"
          class="w-full mt-3 py-2 text-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 bg-slate-100 dark:bg-slate-950/40 hover:bg-slate-200 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors"
        >
          ➕ 展開完整 HTML 標籤庫
        </button>
      </div>

      <!-- 完整分類庫 (手動展開) -->
      <div v-else class="space-y-2">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs font-bold text-slate-600 dark:text-slate-400">完整標籤庫</span>
          <button 
            @click="showAllCategories = false" 
            class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            返回關卡推薦
          </button>
        </div>

        <div 
          v-for="(item, idx) in currentCategoryItems" 
          :key="idx"
          draggable="true"
          @dragstart="onDragStart($event, item)"
          @click="$emit('add-block', item)"
          class="group p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 hover:border-indigo-500 cursor-grab active:cursor-grabbing transition-all shadow-sm flex flex-col gap-1 relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-sm font-extrabold text-indigo-700 dark:text-indigo-300">
              {{ item.label }}
            </span>
            <span class="text-xs px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-slate-800">
              {{ item.type || 'attr' }}
            </span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 font-medium">
            {{ item.desc || item.value }}
          </p>
        </div>
      </div>
    </div>

    <!-- 底部操作提示 -->
    <div class="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between font-medium">
      <span>💡 點選或拖曳至右側畫布</span>
      <span class="font-mono text-slate-500">HTML5</span>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { HTML_BLOCK_PALETTE } from '../../data/availableBlocks';
import { usePuzzleEngine } from '../../composables/usePuzzleEngine';

const props = defineProps({
  level: { type: Object, required: true }
});

const emit = defineEmits(['add-block']);

const { setDraggingBlock, clearDraggingBlock } = usePuzzleEngine();

const showAllCategories = ref(false);
const activeCategory = ref('structure');
const activeDraggingId = ref(null);
const shuffledBlocks = ref([]);

// Fisher-Yates 洗牌演算法，確保不與原始順序完全相同
function shuffleArray(arr) {
  if (!arr || arr.length <= 1) return [...(arr || [])];
  const copy = JSON.parse(JSON.stringify(arr));
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  // 若隨機結果巧合與原始完全一樣，對調前兩項以確保打亂
  const isIdentical = copy.every((b, idx) => b.id === arr[idx]?.id);
  if (isIdentical && copy.length > 1) {
    [copy[0], copy[1]] = [copy[1], copy[0]];
  }
  return copy;
}

function reshuffle() {
  shuffledBlocks.value = shuffleArray(props.level.initialBlocks || []);
}

// 關卡切換或載入時自動打亂推薦零件
watch(
  () => props.level?.id,
  () => {
    reshuffle();
  },
  { immediate: true }
);

const categories = [
  { id: 'structure', name: '結構標籤' },
  { id: 'text', name: '文字排版' },
  { id: 'media_links', name: '多媒體/連結' },
  { id: 'forms', name: '表單控制' },
  { id: 'attributes', name: '屬性晶片' }
];

const currentCategoryName = computed(() => {
  if (!showAllCategories.value) return '本關推薦';
  const found = categories.find(c => c.id === activeCategory.value);
  return found ? found.name : '';
});

const levelBlocks = computed(() => shuffledBlocks.value);

const currentCategoryItems = computed(() => {
  return HTML_BLOCK_PALETTE[activeCategory.value] || [];
});

function onDragStart(e, block) {
  activeDraggingId.value = block.id || block.tag || block.label;
  setDraggingBlock(block);
  e.dataTransfer.setData('text/plain', JSON.stringify(block));
  e.dataTransfer.effectAllowed = 'copyMove';
}

function onDragEnd() {
  activeDraggingId.value = null;
  clearDraggingBlock();
}

function getBlockColorBar(block) {
  if (block.type === 'void_tag') return 'bg-amber-500';
  if (block.type === 'attr') return 'bg-cyan-500';
  if (block.type === 'open_tag' || block.type === 'close_tag') return 'bg-indigo-500';
  return 'bg-emerald-500';
}

function getBlockTextColor(block) {
  if (block.type === 'void_tag') return 'text-amber-700 dark:text-amber-300';
  if (block.type === 'attr') return 'text-cyan-700 dark:text-cyan-300';
  if (block.type === 'close_tag') return 'text-purple-700 dark:text-purple-300';
  return 'text-indigo-700 dark:text-indigo-300';
}

function getBlockBadge(block) {
  if (block.type === 'void_tag') return '自閉合';
  if (block.type === 'open_tag') return '起始';
  if (block.type === 'close_tag') return '結束';
  if (block.type === 'attr') return '屬性';
  return '容器';
}

function getBlockDesc(block) {
  if (block.type === 'void_tag') return '空標籤，無須 </tag>';
  if (block.type === 'open_tag') return '宣告元素性質與開始';
  if (block.type === 'close_tag') return '宣告元素影響範圍結束';
  if (block.type === 'attr') return '元件屬性晶片';
  return '包覆子節點之容器';
}
</script>
