import { ref, computed } from 'vue';
import { PUZZLE_LEVELS } from '../data/levels';

const STORAGE_KEY = 'html_puzzle_game_progress_v1';

const completedLevels = ref({});
const unlockedLevels = ref(['stage-1']);
const currentLevelId = ref('stage-1');

// 初始化從 LocalStorage 與網址 Hash 讀取
function syncHash(levelId) {
  if (typeof window !== 'undefined' && levelId) {
    const currentHash = window.location.hash.replace('#', '').trim();
    if (currentHash !== levelId) {
      window.location.hash = levelId;
    }
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    let savedLevelId = null;

    if (saved) {
      const data = JSON.parse(saved);
      if (data.completedLevels) completedLevels.value = data.completedLevels;
      if (data.unlockedLevels) unlockedLevels.value = data.unlockedLevels;
      if (data.currentLevelId) savedLevelId = data.currentLevelId;
    }

    // 優先順序：網址 Hash (例 #stage-4) > LocalStorage 儲存關卡 > 預設第一關
    let targetLevelId = 'stage-1';
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && PUZZLE_LEVELS.some(l => l.id === hash)) {
        targetLevelId = hash;
      } else if (savedLevelId && PUZZLE_LEVELS.some(l => l.id === savedLevelId)) {
        targetLevelId = savedLevelId;
      }
    } else if (savedLevelId && PUZZLE_LEVELS.some(l => l.id === savedLevelId)) {
      targetLevelId = savedLevelId;
    }

    currentLevelId.value = targetLevelId;
    syncHash(targetLevelId);
  } catch (e) {
    console.warn('無法載入存檔', e);
  }
}

function saveProgress() {
  try {
    const payload = {
      completedLevels: completedLevels.value,
      unlockedLevels: unlockedLevels.value,
      currentLevelId: currentLevelId.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    syncHash(currentLevelId.value);
  } catch (e) {
    console.warn('無法儲存存檔', e);
  }
}

// 監聽瀏覽器上一頁/下一頁或 Hash 變化
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && PUZZLE_LEVELS.some(l => l.id === hash) && hash !== currentLevelId.value) {
      currentLevelId.value = hash;
      saveProgress();
    }
  });
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
    saveProgress();
  }

  function resetAllProgress() {
    completedLevels.value = {};
    unlockedLevels.value = ['stage-1'];
    currentLevelId.value = 'stage-1';
    localStorage.removeItem(STORAGE_KEY);
    syncHash('stage-1');
  }

  return {
    currentLevelId,
    currentLevel,
    completedLevels,
    unlockedLevels,
    totalStars,
    unlockedBadges,
    setCurrentLevel,
    completeCurrentLevel,
    resetAllProgress
  };
}
