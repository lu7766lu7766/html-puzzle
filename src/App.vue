<template>
  <div class="h-screen w-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-200">
    <!-- 頂部導航狀態列 -->
    <TopNavBar
      :current-level="currentLevel"
      :total-stars="totalStars"
      :is-muted="isMuted"
      :is-dark="isDark"
      @open-map="showMapModal = true"
      @open-handbook="showHandbookModal = true"
      @toggle-audio="toggleMute"
      @toggle-theme="toggleTheme"
    />

    <!-- 關卡目標與任務指示條 -->
    <MissionHeader
      :level="currentLevel"
      :checklist-status="checklistStatus"
      :current-block-count="currentBlockCount"
      @run-test="onRunTest"
    />

    <!-- 主體三欄佈局 (左側工具箱 + 中間畫布 + 右側即時預覽) -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左側：標籤積木工具箱 -->
      <BlockPalette
        :level="currentLevel"
        @add-block="onAddBlockToRoot"
      />

      <!-- 中間：拖曳工作組裝畫布 -->
      <PuzzleCanvas
        :canvas-nodes="canvasNodes"
        :current-level="currentLevel"
        @add-root-block="onAddBlockToRoot"
        @remove-node="onRemoveNode"
        @remove-attr="onRemoveAttr"
        @add-attr="onAddAttr"
        @update-attr="onUpdateAttr"
        @clear-canvas="onClearCanvas"
        @drop-inside="onDropInside"
        @drop-relative="onDropRelative"
        @move-node="onMoveNode"
        @reorder-root-nodes="onReorderRootNodes"
      />

      <!-- 右側：即時三合一預覽 (Live Browser / DOM Tree / Code) -->
      <PreviewPanel
        :html-code="currentHtmlCode"
        :target-html="currentLevel.targetHtml"
        :canvas-nodes="canvasNodes"
        :current-level-id="currentLevelId"
      />
    </div>

    <!-- 模態框組件 -->
    <!-- 1. 關卡探險地圖 -->
    <LevelMapModal
      v-if="showMapModal"
      :current-level-id="currentLevelId"
      :unlocked-levels="unlockedLevels"
      :completed-levels="completedLevels"
      @close="showMapModal = false"
      @select-level="onSelectLevel"
    />

    <!-- 2. HTML 核心心智模型與避坑手冊 -->
    <HandbookModal
      v-if="showHandbookModal"
      @close="showHandbookModal = false"
    />

    <!-- 3. 通關慶祝彈窗 -->
    <LevelSuccessModal
      v-if="showSuccessModal"
      :level="currentLevel"
      :test-report="lastTestReport"
      :has-next-level="hasNextLevel"
      @next-level="onNextLevel"
      @close="showSuccessModal = false"
    />

    <!-- 4. 未達標提示彈窗 (不洩漏驗收流程防作弊) -->
    <LevelReviewModal
      v-if="showReviewModal"
      :level="currentLevel"
      :test-report="lastTestReport"
      @close="showReviewModal = false"
      @open-handbook="onOpenHandbookFromReview"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import TopNavBar from './components/navigation/TopNavBar.vue';
import MissionHeader from './components/workspace/MissionHeader.vue';
import BlockPalette from './components/workspace/BlockPalette.vue';
import PuzzleCanvas from './components/workspace/PuzzleCanvas.vue';
import PreviewPanel from './components/preview/PreviewPanel.vue';
import LevelMapModal from './components/navigation/LevelMapModal.vue';
import HandbookModal from './components/handbook/HandbookModal.vue';
import LevelSuccessModal from './components/feedback/LevelSuccessModal.vue';
import LevelReviewModal from './components/feedback/LevelReviewModal.vue';

import { useGameProgress } from './composables/useGameProgress';
import { usePuzzleEngine } from './composables/usePuzzleEngine';
import { useLevelValidator } from './composables/useLevelValidator';
import { useAudioFeedback } from './composables/useAudioFeedback';
import { useTheme } from './composables/useTheme';
import { PUZZLE_LEVELS } from './data/levels';

// 主題切換
const { isDark, toggleTheme } = useTheme();

// 狀態機與 Composables
const {
  currentLevelId,
  currentLevel,
  completedLevels,
  unlockedLevels,
  totalStars,
  setCurrentLevel,
  completeCurrentLevel
} = useGameProgress();

const {
  canvasNodes,
  generateHtmlCode,
  createNewNode,
  addNode,
  insertNodeRelative,
  insertNodeIntoContainer,
  moveNodeRelative,
  moveNodeIntoContainer,
  moveNodeToRoot,
  removeNode,
  attachAttribute,
  removeAttribute,
  updateAttribute,
  clearCanvas,
  loadNodes,
  countBlocks
} = usePuzzleEngine();

// 當前工作區畫布中已放置的積木數量
const currentBlockCount = computed(() => {
  return countBlocks(currentLevel.value?.id);
});

const { evaluateChecklist, runInteractiveTest } = useLevelValidator();
const { isMuted, toggleMute, playSnap, playCheck, playSuccess, playClick } = useAudioFeedback();

// 模態框顯示開關
const showMapModal = ref(false);
const showHandbookModal = ref(false);
const showSuccessModal = ref(false);
const showReviewModal = ref(false);
const lastTestReport = ref({ passed: false, stars: 3, logs: [] });

// 當前生成之 HTML 原始碼
const currentHtmlCode = computed(() => {
  return generateHtmlCode();
});

// 即時目標打勾清單狀態
const checklistStatus = ref({});
let lastPassedIds = new Set();

function updateChecklist() {
  const status = evaluateChecklist(currentLevel.value, currentHtmlCode.value, canvasNodes.value);
  checklistStatus.value = status;

  // 若有新通過之檢查項，播放提示音
  Object.entries(status).forEach(([id, passed]) => {
    if (passed && !lastPassedIds.has(id)) {
      playCheck();
      lastPassedIds.add(id);
    }
  });
}

// 監聽畫布積木變動，即時更新目標檢驗
watch([currentHtmlCode, currentLevel, canvasNodes], () => {
  updateChecklist();
}, { deep: true });

// 關卡切換處理：工作區一開始預設清空
function initLevelWorkspace(level) {
  lastPassedIds.clear();
  clearCanvas();
  updateChecklist();
}

watch(currentLevelId, (newId) => {
  const lvl = PUZZLE_LEVELS.find(l => l.id === newId) || currentLevel.value;
  initLevelWorkspace(lvl);
});

onMounted(() => {
  initLevelWorkspace(currentLevel.value);
});

// 積木互動處理
function onAddBlockToRoot(blockTemplate) {
  playSnap();
  // 若為既有積木，移至最外層（連同其所有子節點與內容）
  if (blockTemplate.isExistingNode) {
    moveNodeToRoot(blockTemplate.nodeId);
    return;
  }
  // 屬性晶片特殊處理 (如第五關)
  if (blockTemplate.type === 'attr') {
    const targetNode = canvasNodes.value[0];
    if (targetNode) {
      attachAttribute(targetNode.id, blockTemplate.key, blockTemplate.value);
      return;
    }
  }
  const node = createNewNode(blockTemplate);
  addNode(node);
}

// 相對指定節點之前或之後放置
function onDropRelative({ targetNodeId, position, block }) {
  playSnap();
  if (block.isExistingNode) {
    moveNodeRelative(block.nodeId, targetNodeId, position);
  } else {
    const node = createNewNode(block);
    insertNodeRelative(node, targetNodeId, position);
  }
}

// 放入容器內部（最前 start 或最後 end）
function onDropInside({ targetContainerId, position = 'end', block }) {
  playSnap();
  if (block.type === 'attr') {
    attachAttribute(targetContainerId, block.key, block.value);
    return;
  }
  if (block.isExistingNode) {
    moveNodeIntoContainer(block.nodeId, targetContainerId, position);
  } else {
    const node = createNewNode(block);
    insertNodeIntoContainer(node, targetContainerId, position);
  }
}

function onMoveNode() {
  playClick();
}

function onRemoveNode(nodeId) {
  playClick();
  removeNode(nodeId);
}

function onAddAttr({ nodeId, key, value }) {
  playClick();
  attachAttribute(nodeId, key, value);
}

function onRemoveAttr({ nodeId, key }) {
  playClick();
  removeAttribute(nodeId, key);
}

function onUpdateAttr({ nodeId, oldKey, newKey, value }) {
  playClick();
  updateAttribute(nodeId, oldKey, newKey, value);
}

function onClearCanvas() {
  playClick();
  clearCanvas();
}

function onReorderRootNodes(newNodes) {
  loadNodes(newNodes);
}

function onSelectLevel(lvlId) {
  playClick();
  showReviewModal.value = false;
  setCurrentLevel(lvlId);
}

function onOpenHandbookFromReview() {
  playClick();
  showReviewModal.value = false;
  showHandbookModal.value = true;
}


// 提交驗收測試
async function onRunTest() {
  playClick();
  const report = await runInteractiveTest(currentLevel.value, currentHtmlCode.value, canvasNodes.value);
  lastTestReport.value = report;

  if (report.passed) {
    playSuccess();
    completeCurrentLevel(report.stars);
    showSuccessModal.value = true;
  } else {
    // 驗收未通過：開啟自訂診斷分析彈窗（不再使用閃退的原生 alert）
    showReviewModal.value = true;
  }
}

const hasNextLevel = computed(() => {
  const idx = PUZZLE_LEVELS.findIndex(l => l.id === currentLevelId.value);
  return idx !== -1 && idx + 1 < PUZZLE_LEVELS.length;
});

function onNextLevel() {
  playClick();
  showSuccessModal.value = false;
  const idx = PUZZLE_LEVELS.findIndex(l => l.id === currentLevelId.value);
  if (idx !== -1 && idx + 1 < PUZZLE_LEVELS.length) {
    setCurrentLevel(PUZZLE_LEVELS[idx + 1].id);
  }
}
</script>
