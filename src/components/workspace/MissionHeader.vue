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

        <!-- 按鈕區：避坑提示 -->
        <div v-if="level.hint" class="pt-1 flex items-center space-x-3 flex-wrap gap-y-1.5">
          <button
            @click="showHint = !showHint"
            class="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold transition-colors cursor-pointer"
          >
            <span>💡 {{ showHint ? "收起避坑提示" : "查看避坑提示" }}</span>
            <span class="text-xs">{{ showHint ? "▲" : "▼" }}</span>
          </button>
        </div>

        <!-- 避坑提示內容 -->
        <div
          v-show="showHint"
          class="mt-1.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 whitespace-pre-line leading-relaxed font-medium"
        >
          {{ level.hint }}
        </div>
      </div>

      <!-- 右側：即時檢核狀態與提交驗收按鈕 -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- 目標清單進度條 -->
        <div class="bg-slate-100 dark:bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 min-w-44">
          <div class="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            <span>目標達成度</span>
            <span :class="isGoalAchieved ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-slate-800 dark:text-slate-200'">
              {{ passedCount }} / {{ requiredBlocks }}
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
  if (totalCount.value > 0) {
    return allChecklistPassed.value && props.currentBlockCount >= requiredBlocks.value
  }
  return props.currentBlockCount >= requiredBlocks.value
})

// 目標達成度進度百分比 (以實際已放積木數與目標清單通過數為準，全數通過時 100%)
const progressPercent = computed(() => {
  if (allChecklistPassed.value && props.currentBlockCount >= requiredBlocks.value) return 100
  if (requiredBlocks.value === 0) return 0
  if (totalCount.value > 0) {
    const blockRatio = Math.min(1, props.currentBlockCount / requiredBlocks.value)
    const checkRatio = passedCount.value / totalCount.value
    const combined = (blockRatio * 0.5 + checkRatio * 0.5) * 100
    return Math.min(allChecklistPassed.value ? 100 : 85, Math.round(combined))
  }
  const ratio = (props.currentBlockCount / requiredBlocks.value) * 100
  return Math.min(100, Math.round(ratio))
})
</script>
