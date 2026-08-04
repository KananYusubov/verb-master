/* ==========================================================================
   LocalStorage User Profile, History & Cumulative Stats Engine
   ========================================================================== */

let cachedHistory = null;
let cachedMistakesMap = null;

function loadUserProfile() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : { nickname: CONFIG.DEFAULT_NICKNAME, createdAt: Date.now() };
  } catch (e) {
    return { nickname: CONFIG.DEFAULT_NICKNAME, createdAt: Date.now() };
  }
}

function saveUserProfile(profile) {
  try {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    updateHeaderNickname(profile.nickname);
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

function updateHeaderNickname(nickname) {
  const headerNicknameEl = document.getElementById('header-user-nickname');
  if (headerNicknameEl) {
    headerNicknameEl.textContent = nickname || CONFIG.DEFAULT_NICKNAME;
  }
}

function loadQuizHistory() {
  if (cachedHistory !== null) return cachedHistory;
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY);
    cachedHistory = raw ? JSON.parse(raw) : [];
    return cachedHistory;
  } catch (e) {
    cachedHistory = [];
    return cachedHistory;
  }
}

function saveQuizHistoryItem(item) {
  try {
    let history = loadQuizHistory();
    history.unshift(item); // Prepend newest result
    if (history.length > CONFIG.MAX_HISTORY_ITEMS) {
      history = history.slice(0, CONFIG.MAX_HISTORY_ITEMS); // Enforce max limit
    }
    cachedHistory = history;
    localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save quiz history:', e);
  }
}

function clearQuizHistory() {
  try {
    cachedHistory = [];
    localStorage.removeItem(CONFIG.STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

function calculateOverallStats(history) {
  if (!history || history.length === 0) {
    return { totalQuizzes: 0, highScore: 0, bestStreak: 0, avgAccuracy: 0 };
  }
  const totalQuizzes = history.length;
  let highScore = 0;
  let bestStreak = 0;
  let sumAccuracy = 0;

  history.forEach(item => {
    if (item.score > highScore) highScore = item.score;
    if (item.maxStreak > bestStreak) bestStreak = item.maxStreak;
    sumAccuracy += (item.accuracy || 0);
  });

  const avgAccuracy = Math.round(sumAccuracy / totalQuizzes);
  return { totalQuizzes, highScore, bestStreak, avgAccuracy };
}

/* ==========================================================================
   Mistakes Storage Engine (Spaced Repetition & Error Tracking)
   ========================================================================== */

function loadMistakesMap() {
  if (cachedMistakesMap !== null) return cachedMistakesMap;
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEYS.MISTAKES);
    cachedMistakesMap = raw ? JSON.parse(raw) : {};
    return cachedMistakesMap;
  } catch (e) {
    cachedMistakesMap = {};
    return cachedMistakesMap;
  }
}

function saveMistakesMap(map) {
  try {
    cachedMistakesMap = map;
    localStorage.setItem(CONFIG.STORAGE_KEYS.MISTAKES, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save mistakes:', e);
  }
}

function recordVerbMistake(verbObj) {
  if (!verbObj || !verbObj.v1 || !verbObj.v1[0]) return;
  const key = verbObj.v1[0].toLowerCase();
  const map = loadMistakesMap();
  if (map[key]) {
    map[key].count += 1;
    map[key].lastDate = Date.now();
  } else {
    map[key] = {
      v1: verbObj.v1,
      v2: verbObj.v2,
      v3: verbObj.v3,
      meaning_az: verbObj.meaning_az,
      type: verbObj.type || 'irregular',
      count: 1,
      lastDate: Date.now()
    };
  }
  saveMistakesMap(map);
}

function resolveVerbMistake(v1Str) {
  if (!v1Str) return;
  const key = String(v1Str).toLowerCase();
  const map = loadMistakesMap();
  if (map[key]) {
    map[key].count -= 1;
    if (map[key].count <= 0) {
      delete map[key];
    }
    saveMistakesMap(map);
  }
}

function getMistakeList() {
  const map = loadMistakesMap();
  return Object.keys(map).map(k => map[k]);
}

function clearMistakes() {
  try {
    cachedMistakesMap = {};
    localStorage.removeItem(CONFIG.STORAGE_KEYS.MISTAKES);
  } catch (e) {
    console.error('Failed to clear mistakes:', e);
  }
}

