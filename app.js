/* ==========================================================================
   Irregular Verbs Master - Main Application Entry Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let verbsData = [];
  let selectedMode = '10';
  let totalQuestions = 10;
  let currentQuestionIndex = 0;
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let errorReviewList = [];
  let currentQuestion = null;
  let isAnswerSubmitted = false;

  // New Feature States (Mistakes & Time Attack)
  let quizVerbsPool = [];
  let timerInterval = null;
  let timeRemaining = 60;

  // DOM Elements
  const customLangDropdown = document.getElementById('custom-lang-dropdown');
  const langTriggerBtn = document.getElementById('lang-trigger-btn');
  const langMenu = document.getElementById('lang-menu');
  const currentLangFlag = document.getElementById('current-lang-flag');
  const currentLangCode = document.getElementById('current-lang-code');

  const themeToggleBtn = document.getElementById('theme-toggle');
  const screenHome = document.getElementById('screen-home');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResults = document.getElementById('screen-results');

  const modeCards = document.querySelectorAll('.mode-card');
  const btnStart = document.getElementById('btn-start');
  const btnQuitQuiz = document.getElementById('btn-quit');

  const statQuestion = document.getElementById('quiz-progress-text');
  const statScore = document.getElementById('quiz-score');
  const statStreak = document.getElementById('quiz-streak');
  const progressBarFill = document.getElementById('quiz-progress-bar');
  const quizTimerEl = document.getElementById('quiz-timer');
  const timerTextEl = document.getElementById('timer-text');

  const questionCard = document.getElementById('question-card');
  const qTypeTitle = document.getElementById('q-type-title');
  const qPrompt = document.getElementById('q-prompt');
  const qBody = document.getElementById('q-body');
  const feedbackAlert = document.getElementById('feedback-alert');

  const btnSubmit = document.getElementById('btn-submit');
  const btnNext = document.getElementById('btn-next');
  const btnRestart = document.getElementById('btn-restart');
  const btnHome = document.getElementById('btn-home');

  const resScore = document.getElementById('res-score');
  const resAccuracy = document.getElementById('res-accuracy');
  const resCorrect = document.getElementById('res-correct');
  const resWrong = document.getElementById('res-wrong');
  const resBestStreak = document.getElementById('res-best-streak');
  const errorReviewSection = document.getElementById('error-review-section');
  const errorList = document.getElementById('error-list');

  const lastQuizBanner = document.getElementById('last-quiz-banner');
  const lastQuizInfo = document.getElementById('last-quiz-info');
  const lqDateText = document.getElementById('lq-date-text');

  const AZ_FLAG_SVG = `<svg class="flag-icon" viewBox="0 0 30 20" width="20" height="14"><rect width="30" height="6.67" fill="#0092C7"/><rect y="6.67" width="30" height="6.67" fill="#E00034"/><rect y="13.33" width="30" height="6.67" fill="#009B00"/><circle cx="13.5" cy="10" r="2.2" fill="#fff"/><circle cx="14.2" cy="10" r="1.8" fill="#E00034"/><polygon points="17,10 17.6,9.2 17.2,10 18,10.3 17.3,10.6 17.4,11.4 16.8,10.8 16.2,11.2 16.5,10.4" fill="#fff"/></svg>`;
  const EN_FLAG_SVG = `<svg class="flag-icon" viewBox="0 0 60 30" width="20" height="14"><clipPath id="uk1"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk2"><path d="M30,15 L60,0 h-60 z L30,15 L0,30 h60 z"/></clipPath><g clip-path="url(#uk1)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk2)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;

  // Dynamic Mode Label Resolver
  window.formatHistoryModeLabel = function(item) {
    if (!item) return '';
    const raw = String(item.modeKey || item.mode || '').toLowerCase().trim();
    if (raw.includes('mistakes') || raw.includes('səhv')) return t('mode_mistakes');
    if (raw.includes('timeattack') || raw.includes('time')) return t('mode_timeattack');
    if (raw.includes('all') || raw.includes('baza') || raw.includes('database')) return t('mode_all');
    if (raw.includes('endless') || raw.includes('sonsuz')) return t('mode_endless');
    const numMatch = raw.match(/\d+/);
    if (numMatch) return `${numMatch[0]} ${t('mode_questions')}`;
    return item.modeKey || item.mode || '';
  };

  function switchScreen(targetScreen) {
    [screenHome, screenQuiz, screenResults].forEach(s => {
      if (s) s.classList.remove('active');
    });
    if (targetScreen) targetScreen.classList.add('active');

    if (targetScreen === screenQuiz) {
      document.body.classList.add('quiz-mode-active');
    } else {
      document.body.classList.remove('quiz-mode-active');
    }

    // Show/hide the fixed bottom start footer only on home screen
    const homeFooter = document.getElementById('home-start-footer');
    if (homeFooter) {
      homeFooter.style.display = (targetScreen === screenHome) ? 'flex' : 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateMistakesCountBadge() {
    const countEl = document.getElementById('mode-mistakes-count');
    if (!countEl) return;
    const mistakes = typeof getMistakeList === 'function' ? getMistakeList() : [];
    countEl.textContent = mistakes.length > 0 ? `🎯 ${mistakes.length}` : '🎯';
  }

  // Home Screen Last Quiz Banner Controller
  function renderHomeLastQuizBanner() {
    if (!lastQuizBanner || !lastQuizInfo) return;
    const history = loadQuizHistory();
    if (history && history.length > 0) {
      const last = history[0];
      const accClass = (last.accuracy >= 60) ? 'acc-good' : 'acc-bad';
      const modeText = formatHistoryModeLabel(last);
      const scoreLabel = t('stat_score');
      const accLabel = t('res_lbl_accuracy');

      if (lqDateText) lqDateText.textContent = last.date || '';

      lastQuizBanner.classList.remove('hidden');
      lastQuizInfo.innerHTML = `
        <span class="lq-tag lq-mode-tag">${modeText}</span>
        <span class="lq-tag lq-score-tag">${last.score} ${scoreLabel}</span>
        <span class="lq-tag ${accClass}">${last.accuracy}% ${accLabel}</span>
      `;
    } else {
      lastQuizBanner.classList.add('hidden');
    }
  }

  function updateDropdownUI(lang) {
    if (currentLangFlag) currentLangFlag.innerHTML = lang === 'az' ? AZ_FLAG_SVG : EN_FLAG_SVG;
    if (currentLangCode) currentLangCode.textContent = lang.toUpperCase();

    if (langMenu) {
      langMenu.querySelectorAll('.lang-option').forEach(opt => {
        if (opt.getAttribute('data-lang') === lang) {
          opt.classList.add('active');
        } else {
          opt.classList.remove('active');
        }
      });
    }
  }

  function applyLanguage(lang) {
    if (typeof setLanguage === 'function') setLanguage(lang);
    currentLang = lang;
    updateDropdownUI(lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.placeholder = t(key);
    });

    if (currentQuestion && screenQuiz.classList.contains('active') && !isAnswerSubmitted) {
      if (qTypeTitle) qTypeTitle.textContent = t(`q${currentQuestion.typeNum}_title`);
    }

    renderHomeLastQuizBanner();
    if (typeof renderProfileModal === 'function') renderProfileModal();
    if (typeof renderDictionaryList === 'function') renderDictionaryList();
  }

  // Language Dropdown Event Handlers
  if (langTriggerBtn && langMenu) {
    langTriggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('hidden');
      if (customLangDropdown) customLangDropdown.classList.toggle('open');
    });

    langMenu.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = opt.getAttribute('data-lang');
        applyLanguage(selectedLang);
        langMenu.classList.add('hidden');
        if (customLangDropdown) customLangDropdown.classList.remove('open');
      });
    });

    document.addEventListener('click', () => {
      if (langMenu) langMenu.classList.add('hidden');
      if (customLangDropdown) customLangDropdown.classList.remove('open');
    });
  }

  // Theme Engine Initialization
  let currentTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, currentTheme);
  }

  // Initial Startup Actions
  applyLanguage(currentLang);
  const initialProfile = loadUserProfile();
  updateHeaderNickname(initialProfile.nickname);
  renderHomeLastQuizBanner();
  updateMistakesCountBadge();

  if (typeof initModalListeners === 'function') {
    initModalListeners(
      () => {
        renderHomeLastQuizBanner();
        updateMistakesCountBadge();
      },
      (lang) => applyLanguage(lang),
      (theme) => setTheme(theme)
    );
  }

  // Load Verbs Database
  fetch('verbs.json')
    .then(res => res.json())
    .then(data => {
      verbsData = data;
      if (typeof initDictionary === 'function') initDictionary(verbsData);
      updateMistakesCountBadge();
    })
    .catch(err => console.error('Verbs fetch error:', err));

  // Initialize home footer visibility (home screen is active on load)
  const homeFooterInit = document.getElementById('home-start-footer');
  if (homeFooterInit) homeFooterInit.style.display = 'flex';

  // Mode Selection Handler
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMode = card.getAttribute('data-mode');
    });
  });


  // Countdown Timer Engine for Time Attack
  function startTimer() {
    stopTimer();
    timeRemaining = CONFIG.TIME_ATTACK_DURATION || 60;
    if (quizTimerEl) quizTimerEl.classList.remove('hidden');
    updateTimerUI();
    timerInterval = setInterval(() => {
      timeRemaining--;
      updateTimerUI();
      if (timeRemaining <= 0) {
        stopTimer();
        if (typeof showToast === 'function') showToast(currentLang === 'az' ? '⏱️ Vaxt bitti!' : '⏱️ Time is up!', 'info');
        endQuiz();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (quizTimerEl) {
      quizTimerEl.classList.add('hidden');
      quizTimerEl.classList.remove('low-time');
    }
  }

  function updateTimerUI() {
    if (!timerTextEl) return;
    const mins = String(Math.floor(timeRemaining / 60)).padStart(2, '0');
    const secs = String(timeRemaining % 60).padStart(2, '0');
    timerTextEl.textContent = `${mins}:${secs}`;

    if (quizTimerEl) {
      if (timeRemaining <= 10) {
        quizTimerEl.classList.add('low-time');
      } else {
        quizTimerEl.classList.remove('low-time');
      }
    }
  }

  // Quiz Engine Handlers
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      if (verbsData.length === 0) return;

      if (selectedMode === 'mistakes') {
        const mistakeList = typeof getMistakeList === 'function' ? getMistakeList() : [];
        if (mistakeList.length === 0) {
          if (typeof showToast === 'function') {
            showToast(t('mistakes_empty_title'), 'info');
          }
          return;
        }
        quizVerbsPool = mistakeList;
        totalQuestions = mistakeList.length;
      } else if (selectedMode === 'timeattack') {
        quizVerbsPool = verbsData;
        totalQuestions = Infinity;
        startTimer();
      } else {
        quizVerbsPool = verbsData;
        if (selectedMode === 'all') {
          totalQuestions = verbsData.length;
        } else if (selectedMode === 'endless') {
          totalQuestions = Infinity;
        } else {
          totalQuestions = parseInt(selectedMode, 10) || 10;
        }
      }

      currentQuestionIndex = 0;
      score = 0;
      streak = 0;
      maxStreak = 0;
      correctCount = 0;
      wrongCount = 0;
      errorReviewList = [];

      switchScreen(screenQuiz);
      loadNextQuestion();
    });
  }

  if (btnQuitQuiz) {
    btnQuitQuiz.addEventListener('click', () => {
      showConfirmModal({
        icon: '🛑',
        title: currentLang === 'az' ? 'Testi Dayandır' : 'Quit Quiz',
        message: currentLang === 'az' ? 'Testi yarıda dayandırıb ana menyuya qayıtmaq istədiyinizdən əminsiniz?' : 'Are you sure you want to quit the quiz and return to the main menu?',
        confirmText: currentLang === 'az' ? 'Bəli, Dayandır' : 'Yes, Quit',
        cancelText: currentLang === 'az' ? 'Davam et' : 'Continue',
        onConfirm: () => {
          stopTimer();
          renderHomeLastQuizBanner();
          updateMistakesCountBadge();
          switchScreen(screenHome);
        }
      });
    });
  }

  function updateHeaderStats() {
    if (statQuestion) {
      if (selectedMode === 'endless' || selectedMode === 'timeattack') {
        statQuestion.textContent = `${currentQuestionIndex + 1} / ∞`;
      } else {
        statQuestion.textContent = `${currentQuestionIndex + 1} / ${totalQuestions}`;
      }
    }

    if (progressBarFill) {
      if (selectedMode === 'endless' || selectedMode === 'timeattack') {
        progressBarFill.style.width = '100%';
      } else {
        const progressPct = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        progressBarFill.style.width = `${progressPct}%`;
      }
    }

    if (statScore) statScore.textContent = score;

    if (statStreak) {
      if (streak > 0) {
        statStreak.innerHTML = `<span class="streak-glow">🔥 ${streak}</span>`;
      } else {
        statStreak.textContent = '🔥 0';
      }
    }
  }

  function setSubmitDisabled(isDisabled) {
    if (!btnSubmit) return;
    btnSubmit.disabled = isDisabled;
    if (isDisabled) {
      btnSubmit.classList.add('btn-disabled');
    } else {
      btnSubmit.classList.remove('btn-disabled');
    }
  }

  function loadNextQuestion() {
    if (currentQuestionIndex >= totalQuestions && selectedMode !== 'endless' && selectedMode !== 'timeattack') {
      endQuiz();
      return;
    }

    isAnswerSubmitted = false;
    if (feedbackAlert) feedbackAlert.className = 'feedback-alert hidden';
    if (btnSubmit) btnSubmit.classList.remove('hidden');
    if (btnNext) btnNext.classList.add('hidden');

    setSubmitDisabled(true);

    const activePool = (quizVerbsPool && quizVerbsPool.length > 0) ? quizVerbsPool : verbsData;
    currentQuestion = generateQuestion(activePool, qPrompt, qBody, submitAnswer, setSubmitDisabled);
    updateHeaderStats();

    if (currentQuestion && qTypeTitle) {
      qTypeTitle.textContent = t(`q${currentQuestion.typeNum}_title`);
      currentQuestion.render();
    }
  }

  function disableQuestionInputs() {
    if (!qBody) return;
    const inputs = qBody.querySelectorAll('input, button, .checkbox-card, .drag-chip');
    inputs.forEach(inp => {
      inp.style.pointerEvents = 'none';
      if (inp.tagName === 'INPUT') inp.disabled = true;
    });
  }

  function submitAnswer() {
    if (isAnswerSubmitted || !currentQuestion) return;
    isAnswerSubmitted = true;

    disableQuestionInputs();
    const result = currentQuestion.validate();

    if (result.isCorrect) {
      if (typeof playSound === 'function') playSound('success');
      const earnedPts = 10 + (streak * 2);
      score += earnedPts;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      correctCount++;

      if (selectedMode === 'mistakes' && typeof resolveVerbMistake === 'function') {
        const v1Key = currentQuestion.verb && currentQuestion.verb.v1 ? currentQuestion.verb.v1[0] : '';
        resolveVerbMistake(v1Key);
        updateMistakesCountBadge();
      }

      if (selectedMode === 'timeattack') {
        timeRemaining += 2;
        updateTimerUI();
      }

      if (streak > 0 && streak % 5 === 0) {
        if (typeof showToast === 'function') {
          showToast(currentLang === 'az' ? `🔥 ${streak} Streak! Əla silsilə!` : `🔥 ${streak} Streak! Great combo!`, 'success');
        }
      }

      if (feedbackAlert) {
        feedbackAlert.className = 'feedback-alert feedback-success';
        feedbackAlert.innerHTML = t('fb_correct', earnedPts);
      }
    } else {
      if (typeof playSound === 'function') playSound('error');
      streak = 0;
      wrongCount++;

      if (typeof recordVerbMistake === 'function') {
        recordVerbMistake(currentQuestion.verb);
        updateMistakesCountBadge();
      }

      if (questionCard) {
        questionCard.classList.add('shake');
        setTimeout(() => questionCard.classList.remove('shake'), 400);
      }

      if (feedbackAlert) {
        feedbackAlert.className = 'feedback-alert feedback-error';
        feedbackAlert.innerHTML = t('fb_wrong', result.correctDisplay);
      }

      errorReviewList.push({
        verb: currentQuestion.verb,
        type: currentQuestion.type,
        userAns: result.userDisplay,
        correctAns: result.correctDisplay
      });

      if (selectedMode === 'endless') {
        setTimeout(() => endQuiz(), 1800);
        return;
      }
    }

    updateHeaderStats();
    if (btnSubmit) btnSubmit.classList.add('hidden');
    if (btnNext) {
      btnNext.classList.remove('hidden');
      const isLastQuestion = (currentQuestionIndex === totalQuestions - 1) && selectedMode !== 'endless' && selectedMode !== 'timeattack';
      const btnNextText = btnNext.querySelector('span[data-i18n="btn_next"]') || btnNext.querySelector('span');
      if (btnNextText) {
        btnNextText.textContent = isLastQuestion
          ? (currentLang === 'az' ? '🎯 Nəticələri Gör' : '🎯 View Results')
          : t('btn_next');
      }
      btnNext.focus();
    }
  }

  if (btnSubmit) btnSubmit.addEventListener('click', submitAnswer);

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentQuestionIndex++;
      loadNextQuestion();
    });
  }

  function endQuiz() {
    stopTimer();
    switchScreen(screenResults);

    if (resScore) resScore.textContent = score;
    if (resCorrect) resCorrect.textContent = correctCount;
    if (resWrong) resWrong.textContent = wrongCount;
    if (resBestStreak) resBestStreak.textContent = `🔥 ${maxStreak}`;

    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    if (resAccuracy) resAccuracy.textContent = `${accuracy}%`;

    const prevHistory = loadQuizHistory();
    const prevStats = calculateOverallStats(prevHistory);

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    saveQuizHistoryItem({
      id: Date.now(),
      date: formattedDate,
      modeKey: selectedMode,
      mode: selectedMode,
      score: score,
      correctCount: correctCount,
      totalAnswered: totalAnswered,
      accuracy: accuracy,
      maxStreak: maxStreak
    });

    if (score > prevStats.highScore && prevStats.totalQuizzes > 0) {
      if (typeof showToast === 'function') {
        showToast(currentLang === 'az' ? '🏆 Yeni Rekord vuruldu!' : '🏆 New High Score!', 'success');
      }
    }

    renderHomeLastQuizBanner();
    updateMistakesCountBadge();

    // Export Scorecard Button Handler
    const btnExportScorecard = document.getElementById('btn-export-scorecard');
    if (btnExportScorecard) {
      btnExportScorecard.onclick = () => {
        const profile = loadUserProfile();
        const canvas = typeof generateScoreCardCanvas === 'function' ? generateScoreCardCanvas({
          nickname: profile.nickname,
          date: formattedDate,
          score: score,
          accuracy: accuracy,
          correctCount: correctCount,
          wrongCount: wrongCount,
          maxStreak: maxStreak,
          modeText: formatHistoryModeLabel({ modeKey: selectedMode })
        }) : null;

        const wrapper = document.getElementById('scorecard-canvas-wrapper');
        if (wrapper && canvas) {
          wrapper.innerHTML = '';
          canvas.className = 'scorecard-canvas';
          wrapper.appendChild(canvas);
        }
        if (typeof openModal === 'function') {
          openModal(document.getElementById('modal-scorecard'));
        }
      };
    }

    if (errorReviewSection && errorList) {
      if (errorReviewList.length > 0) {
        errorReviewSection.classList.remove('hidden');
        errorList.innerHTML = errorReviewList.map(err => `
          <div class="error-item">
            <div class="error-item-title">${err.verb.v1[0].toUpperCase()} (${err.verb.meaning_az}) - <em>${err.type}</em></div>
            <div class="error-item-details">
              ${currentLang === 'az' ? 'Sizin cavabınız' : 'Your answer'}: <span style="color: var(--accent-error);">${err.userAns}</span> <br/>
              ${currentLang === 'az' ? 'Düzgün cavab' : 'Correct answer'}: <span style="color: var(--accent-success);">${err.correctAns}</span>
            </div>
          </div>
        `).join('');
      } else {
        errorReviewSection.classList.add('hidden');
      }
    }
  }

  if (btnRestart) btnRestart.addEventListener('click', () => btnStart && btnStart.click());
  if (btnHome) btnHome.addEventListener('click', () => {
    stopTimer();
    renderHomeLastQuizBanner();
    updateMistakesCountBadge();
    switchScreen(screenHome);
  });
});
