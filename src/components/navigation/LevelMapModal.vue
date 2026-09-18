<template>
  <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
    <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
      <!-- 標題欄 -->
      <div class="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-md">
            🗺️
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">關卡探險地圖</h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">累積星星解鎖成就徽章與課堂魔王挑戰</p>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-3">
          <button 
            @click="$emit('close')"
            class="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 地圖關卡卡片清單 -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        <!-- 1. 核心教材模組 (Modules 1 ~ 7) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <span>📚</span>
              <span>核心課程模組 (Modules 01 ~ 07)</span>
            </h3>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">循序建立骨架心智</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              v-for="level in moduleLevels" 
              :key="level.id"
              @click="selectLevel(level.id)"
              :class="[
                isUnlocked(level.id) 
                  ? 'cursor-pointer hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5' 
                  : 'opacity-50 cursor-not-allowed border-dashed',
                currentLevelId === level.id ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40' : 'bg-white dark:bg-slate-950/50'
              ]"
              class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all flex flex-col justify-between group relative overflow-hidden shadow-sm"
            >
              <!-- 通關徽章與星星 -->
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  STAGE {{ level.levelNumber }}
                </span>

                <div class="flex items-center space-x-0.5">
                  <template v-if="getStars(level.id) > 0">
                    <span v-for="s in 3" :key="s" class="text-sm" :class="s <= getStars(level.id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'">★</span>
                  </template>
                  <span v-else-if="!isUnlocked(level.id)" class="text-sm text-slate-400">🔒</span>
                  <span v-else class="text-xs text-slate-400 font-mono">未通關</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  {{ level.title }}
                </h4>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                  {{ level.scenario }}
                </p>
              </div>

              <!-- 關卡專屬徽章稱號 -->
              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span class="text-slate-500 font-medium">稱號: {{ level.badge }}</span>
                <span v-if="currentLevelId === level.id" class="text-emerald-600 dark:text-emerald-400 font-extrabold">當前關卡</span>
                <span v-else-if="isUnlocked(level.id)" class="text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">進入 ➔</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. 課堂實戰魔王挑戰 (Boss 1 ~ 3) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
              <span>🔥</span>
              <span>課堂實戰魔王題 (Practices 01 ~ 03)</span>
            </h3>
            <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">超連結、單選互斥表單、刪除線</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div 
              v-for="boss in bossLevels" 
              :key="boss.id"
              @click="selectLevel(boss.id)"
              :class="[
                isUnlocked(boss.id) 
                  ? 'cursor-pointer hover:border-rose-500 hover:shadow-md hover:-translate-y-0.5' 
                  : 'opacity-50 cursor-not-allowed border-dashed',
                currentLevelId === boss.id ? 'ring-2 ring-rose-500 border-rose-500 bg-rose-50/70 dark:bg-rose-950/20' : 'bg-white dark:bg-slate-950/50'
              ]"
              class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 font-extrabold">
                  BOSS {{ boss.levelNumber - 7 }}
                </span>
                <div class="flex items-center space-x-0.5">
                  <template v-if="getStars(boss.id) > 0">
                    <span v-for="s in 3" :key="s" class="text-sm" :class="s <= getStars(boss.id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'">★</span>
                  </template>
                  <span v-else-if="!isUnlocked(boss.id)" class="text-sm text-slate-400">🔒</span>
                  <span v-else class="text-xs text-slate-400 font-mono">未通關</span>
                </div>
              </div>

              <div>
                <h4 class="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
                  {{ boss.title }}
                </h4>
                <p class="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                  {{ boss.scenario }}
                </p>
              </div>

              <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span class="text-slate-500 font-medium">稱號: {{ boss.badge }}</span>
                <span v-if="isUnlocked(boss.id)" class="text-rose-600 dark:text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">挑戰 ➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { PUZZLE_LEVELS } from '../../data/levels';

const props = defineProps({
  currentLevelId: { type: String, required: true },
  unlockedLevels: { type: Array, default: () => [] },
  completedLevels: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['close', 'select-level']);

const moduleLevels = computed(() => PUZZLE_LEVELS.filter(l => l.category === 'module'));
const bossLevels = computed(() => PUZZLE_LEVELS.filter(l => l.category === 'boss'));

function isUnlocked(id) {
  return props.unlockedLevels.includes(id);
}

function getStars(id) {
  return props.completedLevels[id]?.stars || 0;
}

function selectLevel(id) {
  if (isUnlocked(id)) {
    emit('select-level', id);
    emit('close');
  }
}
</script>
