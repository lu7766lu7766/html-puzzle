<template>
  <div
    class="bg-white/95 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors duration-200"
  >
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <!-- 關卡標題與情境說明 -->
      <div class="space-y-1 max-w-3xl">
        <div class="flex items-center space-x-2 flex-wrap gap-y-1">
          <span
            v-if="level.category === 'boss'"
            class="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 text-xs font-extrabold uppercase tracking-wide animate-pulse"
          >
            🔥 課堂實戰魔王題
          </span>
          <span
            v-else
            class="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800 text-xs font-bold"
          >
            {{ level.moduleTitle }}
          </span>
          <h1 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
            {{ level.title }}
          </h1>
        </div>

        <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          {{ level.scenario }}
        </p>

        <!-- 按鈕區：避坑提示 + 成果預覽圖 (依圖施做) -->
        <div class="pt-1 flex items-center space-x-3 flex-wrap gap-y-1.5">
          <button
            v-if="level.hint"
            @click="showHint = !showHint"
            class="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold transition-colors"
          >
            <span>💡 {{ showHint ? "收起避坑提示" : "查看避坑提示" }}</span>
            <span class="text-xs">{{ showHint ? "▲" : "▼" }}</span>
          </button>

          <!-- 成果預覽圖按鈕 -->
          <button
            v-if="level.targetHtml"
            @click="showTargetPreview = !showTargetPreview"
            class="inline-flex items-center space-x-1.5 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700 px-2.5 py-1 rounded-lg font-extrabold transition-all shadow-2xs cursor-pointer"
          >
            <span>🎯 {{ showTargetPreview ? "收起成果圖" : "成果預覽圖 (依圖施做)" }}</span>
            <span class="text-xs">{{ showTargetPreview ? "▲" : "▼" }}</span>
          </button>
        </div>

        <!-- 避坑提示內容 -->
        <div
          v-show="showHint"
          class="mt-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 whitespace-pre-line leading-relaxed font-medium"
        >
          {{ level.hint }}
        </div>

        <!-- 成果預覽圖展開卡片 (依圖施做) -->
        <div
          v-if="showTargetPreview && level.targetHtml"
          class="mt-2.5 p-3 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800 shadow-md transition-all"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-xs sm:text-sm font-extrabold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <span>🎯</span>
                <span>本關最終成果畫面（依此對照組裝）：</span>
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="level.targetDescription" class="text-xs text-slate-600 dark:text-slate-400 font-medium hidden sm:inline">
                {{ level.targetDescription }}
              </span>
              <button
                @click="showTargetModal = true"
                class="px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 bg-white dark:bg-slate-900 rounded-md border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>🔍 放大檢視</span>
              </button>
            </div>
          </div>

          <!-- 擬真微型瀏覽器視窗 -->
          <div class="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-inner max-w-2xl">
            <div class="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center space-x-1.5 select-none text-[11px] text-slate-500 font-mono">
              <span class="w-2 h-2 rounded-full bg-rose-400"></span>
              <span class="w-2 h-2 rounded-full bg-amber-400"></span>
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span class="ml-2 font-bold text-indigo-600">🎯 http://localhost:8080/target-outcome.html</span>
            </div>
            <div
              class="p-4 bg-white text-slate-800 overflow-x-auto min-h-17.5 flex items-center"
              v-html="level.targetHtml"
            ></div>
          </div>
        </div>
      </div>

      <!-- 右側：即時檢核狀態與提交驗收按鈕 -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- 目標清單進度條 -->
        <div class="bg-slate-100 dark:bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 min-w-44">
          <div class="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            <span>目標達成度</span>
            <span :class="isGoalAchieved ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'">
              {{ currentBlockCount }} / {{ requiredBlocks }}
            </span>
          </div>
          <div class="w-full h-2 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300 rounded-full"
              :class="isGoalAchieved ? 'bg-emerald-500' : 'bg-indigo-500'"
              :style="{ width: `${progressPercent}%` }"
            ></div>
          </div>
        </div>

        <!-- 提交驗收按鈕 -->
        <button
          @click="$emit('run-test')"
          class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
          :class="
            isGoalAchieved
              ? 'bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
          "
        >
          <span>🚀</span>
          <span>提交驗收測試</span>
        </button>
      </div>
    </div>

    <!-- 成果預覽放大 Modal (Lightbox) -->
    <div 
      v-if="showTargetModal" 
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showTargetModal = false"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        <div class="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="text-xl">🎯</span>
            <div>
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">本關最終成果目標畫面</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">降低想像負擔，請依此畫面結構於工作區組裝</p>
            </div>
          </div>
          <button 
            @click="showTargetModal = false"
            class="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
          <div class="w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white shadow-lg">
            <div class="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center space-x-2 text-xs font-mono text-slate-500">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span class="ml-2 font-bold text-indigo-600">🎯 http://localhost:8080/target-outcome.html</span>
            </div>
            <div class="p-6 bg-white text-slate-900 min-h-35 flex items-center justify-center text-base" v-html="level.targetHtml"></div>
          </div>

          <div v-if="level.targetDescription" class="mt-4 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 font-medium text-center shadow-xs">
            💡 特徵指引：{{ level.targetDescription }}
          </div>
        </div>

        <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <button 
            @click="showTargetModal = false"
            class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            知道了，開始依圖組裝 ➔
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  level: { type: Object, required: true },
  checklistStatus: { type: Object, default: () => ({}) },
  currentBlockCount: { type: Number, default: 0 },
})

defineEmits(["run-test"])

const showHint = ref(false)
const showTargetPreview = ref(false)
const showTargetModal = ref(false)

// 該關卡實際需要的積木數量
const requiredBlocks = computed(() => {
  return props.level.requiredBlocksCount ?? props.level.checklist?.length ?? 1
})

const totalCount = computed(() => props.level.checklist?.length || 0)
const passedCount = computed(() => {
  if (!props.level.checklist) return 0
  return props.level.checklist.filter((c) => props.checklistStatus[c.id]).length
})
const allChecklistPassed = computed(() => totalCount.value > 0 && passedCount.value === totalCount.value)

// 判定是否達成目標
const isGoalAchieved = computed(() => {
  return allChecklistPassed.value || (props.currentBlockCount >= requiredBlocks.value && totalCount.value === 0)
})

// 目標達成度進度百分比 (以實際已放積木數 / 需求積木數為準，全部通過時直接 100%)
const progressPercent = computed(() => {
  if (allChecklistPassed.value && props.currentBlockCount >= requiredBlocks.value) return 100
  if (requiredBlocks.value === 0) return 0
  const ratio = (props.currentBlockCount / requiredBlocks.value) * 100
  return Math.min(100, Math.round(ratio))
})
</script>
