import { ref, computed } from 'vue';
import { PUZZLE_LEVELS } from '../data/levels';

const STORAGE_KEY = 'html_puzzle_game_progress_v1';

const completedLevels = ref({});
const unlockedLevels = ref(['stage-1']);
const currentLevelId = ref('stage-1');
const activeMode = ref('progressive'); // 'progressive' | 'strict' | 'container'

// 初始化從 LocalStorage 讀取
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.completedLevels) completedLevels.value = data.completedLevels;
      if (data.unlockedLevels) unlockedLevels.value = data.unlockedLevels;
      if (data.activeMode) activeMode.value = data.activeMode;
    }
  } catch (e) {
    console.warn('無法載入存檔', e);
  }
}

function saveProgress() {
  try {
    const payload = {
      completedLevels: completedLevels.value,
      unlockedLevels: unlockedLevels.value,
      activeMode: activeMode.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('無法儲存存檔', e);
  }
}

// 首次加載
loadProgress();

export function useGameProgress() {
  const currentLevel = computed(() => {
    return PUZZLE_LEVELS.find(l => l.id === currentLevelId.value) || PUZZLE_LEVELS[0];
  });

  const totalStars = computed(() => {
    return Object.values(completedLevels.value).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  });

  const unlockedBadges = computed(() => {
    const badges = [];
    PUZZLE_LEVELS.forEach(level => {
      if (completedLevels.value[level.id]) {
        badges.push({
          levelId: level.id,
          title: level.badge,
          module: level.moduleTitle,
          stars: completedLevels.value[level.id].stars
        });
      }
    });
    return badges;
  });

  function completeCurrentLevel(stars = 3) {
    const lvlId = currentLevelId.value;
    if (lvlId === 'sandbox') return;

    completedLevels.value[lvlId] = {
      stars: Math.max(stars, completedLevels.value[lvlId]?.stars || 0),
      completedAt: new Date().toISOString()
    };

    // 解鎖下一關
    const currentIndex = PUZZLE_LEVELS.findIndex(l => l.id === lvlId);
    if (currentIndex !== -1 && currentIndex + 1 < PUZZLE_LEVELS.length) {
      const nextLevel = PUZZLE_LEVELS[currentIndex + 1];
      if (!unlockedLevels.value.includes(nextLevel.id)) {
        unlockedLevels.value.push(nextLevel.id);
      }
    }

    saveProgress();
  }

  function setCurrentLevel(levelId) {
    currentLevelId.value = levelId;
  }

  function resetAllProgress() {
    completedLevels.value = {};
    unlockedLevels.value = ['stage-1'];
    currentLevelId.value = 'stage-1';
    localStorage.removeItem(STORAGE_KEY);
  }

  function setMode(mode) {
    activeMode.value = mode;
    saveProgress();
  }

  return {
    currentLevelId,
    currentLevel,
    completedLevels,
    unlockedLevels,
    totalStars,
    unlockedBadges,
    activeMode,
    setMode,
    setCurrentLevel,
    completeCurrentLevel,
    resetAllProgress
  };
}
