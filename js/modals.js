/* ==========================================================================
   Modals & Scroll Lock Controller (Profile, FAQ & Stats)
   ========================================================================== */

function openModal(modalEl) {
  if (modalEl) {
    modalEl.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }
}

function closeModal(modalEl) {
  if (modalEl) {
    modalEl.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icon = type === 'success' ? '✨' : (type === 'error' ? '❌' : 'ℹ️');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function showConfirmModal({ icon = '⚠️', title, message, confirmText, cancelText, onConfirm }) {
  const modalDialog = document.getElementById('modal-dialog');
  const dialogIcon = document.getElementById('dialog-icon');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogMessage = document.getElementById('dialog-message');
  const btnCancel = document.getElementById('btn-dialog-cancel');
  const btnConfirm = document.getElementById('btn-dialog-confirm');

  if (!modalDialog) return;

  if (dialogIcon) dialogIcon.textContent = icon;
  if (dialogTitle) dialogTitle.textContent = title || (currentLang === 'az' ? 'Təsdiq edin' : 'Confirm Action');
  if (dialogMessage) dialogMessage.textContent = message || '';
  if (btnCancel) btnCancel.textContent = cancelText || (currentLang === 'az' ? 'Ləğv et' : 'Cancel');
  if (btnConfirm) btnConfirm.textContent = confirmText || (currentLang === 'az' ? 'Təsdiqlə' : 'Confirm');

  openModal(modalDialog);

  function cleanup() {
    closeModal(modalDialog);
  }

  btnConfirm.onclick = () => {
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  };

  btnCancel.onclick = () => {
    cleanup();
  };
}

function renderProfileModal() {
  const inputNickname = document.getElementById('input-nickname');
  const profile = loadUserProfile();
  if (inputNickname) {
    inputNickname.value = profile.nickname || '';
  }
}

function renderAnalyticsModal() {
  const statTotalQuizzes = document.getElementById('stat-total-quizzes');
  const statHighScore = document.getElementById('stat-high-score');
  const statBestStreak = document.getElementById('stat-best-streak');
  const statAvgAccuracy = document.getElementById('stat-avg-accuracy');
  const historyListEl = document.getElementById('history-list');

  const history = loadQuizHistory();
  const stats = calculateOverallStats(history);

  if (statTotalQuizzes) statTotalQuizzes.textContent = stats.totalQuizzes;
  if (statHighScore) statHighScore.textContent = stats.highScore;
  if (statBestStreak) statBestStreak.textContent = `${stats.bestStreak} 🔥`;
  if (statAvgAccuracy) statAvgAccuracy.textContent = `${stats.avgAccuracy}%`;

  if (historyListEl) {
    if (history.length === 0) {
      historyListEl.innerHTML = `<div class="history-empty">${t('history_empty')}</div>`;
    } else {
      historyListEl.innerHTML = history.map(item => {
        const accClass = (item.accuracy >= 60) ? 'acc-good' : 'acc-bad';
        const modeText = typeof formatHistoryModeLabel === 'function' ? formatHistoryModeLabel(item) : item.mode;
        const scoreLabel = t('stat_score');
        return `
          <div class="history-item">
            <div class="history-item-left">
              <span class="history-mode">${modeText}</span>
              <span class="history-date">${item.date}</span>
            </div>
            <div class="history-item-right">
              <span class="history-score">${item.score} ${scoreLabel}</span>
              <span class="history-acc ${accClass}">${item.correctCount}/${item.totalAnswered} (${item.accuracy}%)</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Render Mistakes Tab List
  const mistakesSummaryEl = document.getElementById('mistakes-summary-text');
  const mistakesListEl = document.getElementById('mistakes-tab-list');
  const mistakeList = typeof getMistakeList === 'function' ? getMistakeList() : [];

  if (mistakesSummaryEl) {
    mistakesSummaryEl.innerHTML = `${t('dict_filter_mistakes')}: <strong>${mistakeList.length}</strong> ${currentLang === 'az' ? 'feil' : 'verbs'}`;
  }

  if (mistakesListEl) {
    if (mistakeList.length === 0) {
      mistakesListEl.innerHTML = `<div class="dict-empty-state"><div class="dict-empty-icon">🎉</div><p>${t('mistakes_empty_title')}</p></div>`;
    } else {
      mistakesListEl.innerHTML = mistakeList.map(item => {
        const typeTagClass = item.type === 'regular' ? 'tag-regular' : 'tag-irregular';
        const typeTagText = item.type === 'regular' ? 'Regular' : 'Irregular';
        const v1Val = (item.v1 || []).join(' / ');
        const v2Val = (item.v2 || []).join(' / ');
        const v3Val = (item.v3 || []).join(' / ');

        return `
          <div class="dict-verb-card">
            <div class="dict-verb-main">
              <span class="dict-verb-az">${item.meaning_az}</span>
              <div class="dict-verb-badges">
                <span class="dict-tag tag-mistake">⚠️ SƏHV (${item.count})</span>
                <span class="dict-tag ${typeTagClass}">${typeTagText}</span>
              </div>
            </div>
            <div class="dict-forms-grid">
              <div class="dict-form-box">
                <span class="dict-form-lbl">V1 (BASE)</span>
                <span class="dict-form-val">${v1Val}</span>
              </div>
              <div class="dict-form-box">
                <span class="dict-form-lbl">V2 (PAST)</span>
                <span class="dict-form-val">${v2Val}</span>
              </div>
              <div class="dict-form-box">
                <span class="dict-form-lbl">V3 (PARTICIPLE)</span>
                <span class="dict-form-val">${v3Val}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function initModalListeners(onHistoryCleared, onApplyLanguage, onToggleTheme) {
  // FAQ Modal
  const btnFaqSettings = document.getElementById('btn-faq-settings');
  const btnCloseFaq = document.getElementById('btn-close-faq');
  const modalFaq = document.getElementById('modal-faq');

  if (modalFaq && btnCloseFaq) {
    // Accordion toggle logic for FAQ question types (bound once on init)
    const triggers = modalFaq.querySelectorAll('.faq-acc-trigger');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.faq-acc-item');
        const isOpen = item ? item.classList.contains('open') : false;
        // Close all
        modalFaq.querySelectorAll('.faq-acc-item').forEach(i => i.classList.remove('open'));
        // Toggle clicked
        if (!isOpen && item) item.classList.add('open');
      });
    });

    const btnFaqToolbar = document.getElementById('btn-faq-toolbar');

    if (btnFaqToolbar) {
      btnFaqToolbar.addEventListener('click', () => {
        openModal(modalFaq);
      });
    }
    if (btnFaqSettings) {
      btnFaqSettings.addEventListener('click', () => {
        closeModal(document.getElementById('modal-settings'));
        openModal(modalFaq);
      });
    }
    btnCloseFaq.addEventListener('click', () => closeModal(modalFaq));
    modalFaq.addEventListener('click', (e) => {
      if (e.target === modalFaq) closeModal(modalFaq);
    });
  }

  // Profile Modal
  const btnProfile = document.getElementById('btn-profile');
  const modalProfile = document.getElementById('modal-profile');
  const btnCloseProfile = document.getElementById('btn-close-profile');
  const inputNickname = document.getElementById('input-nickname');
  const btnSaveNickname = document.getElementById('btn-save-nickname');

  if (btnProfile && modalProfile && btnCloseProfile) {
    btnProfile.addEventListener('click', () => {
      renderProfileModal();
      openModal(modalProfile);
    });

    btnCloseProfile.addEventListener('click', () => closeModal(modalProfile));
    modalProfile.addEventListener('click', (e) => {
      if (e.target === modalProfile) closeModal(modalProfile);
    });
  }

  if (btnSaveNickname && inputNickname) {
    btnSaveNickname.addEventListener('click', () => {
      const newNick = inputNickname.value.trim();
      if (newNick) {
        const profile = loadUserProfile();
        profile.nickname = newNick;
        saveUserProfile(profile);
        showToast(t('toast_nickname_saved'), 'success');
        closeModal(modalProfile);
      }
    });
  }

  // Settings Gear Modal
  const btnSettings = document.getElementById('btn-settings');
  const modalSettings = document.getElementById('modal-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');

  if (btnSettings && modalSettings && btnCloseSettings) {
    btnSettings.addEventListener('click', () => {
      // Sync active lang button in settings
      const curLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANG) || 'az';
      document.querySelectorAll('.lang-select-btn').forEach(b => {
        if (b.getAttribute('data-lang') === curLang) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      // Sync active timer duration button in settings
      const curTimer = typeof getTimeAttackDuration === 'function' ? getTimeAttackDuration() : 60;
      document.querySelectorAll('.timer-select-btn').forEach(b => {
        if (parseInt(b.getAttribute('data-timer'), 10) === curTimer) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      openModal(modalSettings);
    });
    btnCloseSettings.addEventListener('click', () => closeModal(modalSettings));
    modalSettings.addEventListener('click', (e) => {
      if (e.target === modalSettings) closeModal(modalSettings);
    });
  }

  // Settings Controls (Theme & Lang)
  const themeBtnDark = document.getElementById('theme-btn-dark');
  const themeBtnLight = document.getElementById('theme-btn-light');
  if (themeBtnDark && themeBtnLight) {
    const curTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';
    if (curTheme === 'light') {
      themeBtnLight.classList.add('active');
      themeBtnDark.classList.remove('active');
    }

    themeBtnDark.addEventListener('click', () => {
      themeBtnDark.classList.add('active');
      themeBtnLight.classList.remove('active');
      if (typeof onToggleTheme === 'function') onToggleTheme('dark');
    });

    themeBtnLight.addEventListener('click', () => {
      themeBtnLight.classList.add('active');
      themeBtnDark.classList.remove('active');
      if (typeof onToggleTheme === 'function') onToggleTheme('light');
    });
  }

  const langSelectBtns = document.querySelectorAll('.lang-select-btn');
  langSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      langSelectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      if (typeof onApplyLanguage === 'function') onApplyLanguage(lang);
    });
  });

  // Settings Timer Controls
  const timerSelectBtns = document.querySelectorAll('.timer-select-btn');
  timerSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timerSelectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sec = parseInt(btn.getAttribute('data-timer'), 10);
      if (typeof setTimeAttackDuration === 'function') setTimeAttackDuration(sec);
      if (typeof window.updateTimeAttackBadge === 'function') window.updateTimeAttackBadge();
    });
  });

  // JSON Data Backup & Import Controls
  const btnExportBackup = document.getElementById('btn-export-backup');
  const btnImportBackup = document.getElementById('btn-import-backup');
  const inputImportBackup = document.getElementById('input-import-backup');

  if (btnExportBackup) {
    btnExportBackup.addEventListener('click', () => {
      if (typeof exportAppDataAsJSON === 'function' && exportAppDataAsJSON()) {
        showToast(t('toast_backup_exported'), 'success');
      } else {
        showToast(t('toast_backup_invalid'), 'error');
      }
    });
  }

  if (btnImportBackup && inputImportBackup) {
    btnImportBackup.addEventListener('click', () => {
      inputImportBackup.click();
    });

    inputImportBackup.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        if (typeof importAppDataFromJSON === 'function' && importAppDataFromJSON(content)) {
          showToast(t('toast_backup_imported'), 'success');

          // Refresh UI state
          const importedLang = localStorage.getItem(CONFIG.STORAGE_KEYS.LANG) || 'az';
          const importedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'dark';

          if (typeof onApplyLanguage === 'function') onApplyLanguage(importedLang);
          if (typeof onToggleTheme === 'function') onToggleTheme(importedTheme);
          if (typeof renderProfileModal === 'function') renderProfileModal();
          if (typeof window.updateTimeAttackBadge === 'function') window.updateTimeAttackBadge();
          if (typeof onHistoryCleared === 'function') onHistoryCleared();

          const nickname = document.getElementById('header-user-nickname');
          if (nickname && typeof loadUserProfile === 'function') {
            nickname.textContent = loadUserProfile().nickname;
          }

          closeModal(document.getElementById('modal-profile'));
          closeModal(modalSettings);
        } else {
          showToast(t('toast_backup_invalid'), 'error');
        }
        inputImportBackup.value = '';
      };
      reader.onerror = () => {
        showToast(t('toast_backup_invalid'), 'error');
        inputImportBackup.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Analytics & Mistakes Modal
  const btnAnalytics = document.getElementById('btn-analytics');
  const modalAnalytics = document.getElementById('modal-analytics');
  const btnCloseAnalytics = document.getElementById('btn-close-analytics');

  if (btnAnalytics && modalAnalytics && btnCloseAnalytics) {
    btnAnalytics.addEventListener('click', () => {
      renderAnalyticsModal();
      openModal(modalAnalytics);
    });

    btnCloseAnalytics.addEventListener('click', () => closeModal(modalAnalytics));
    modalAnalytics.addEventListener('click', (e) => {
      if (e.target === modalAnalytics) closeModal(modalAnalytics);
    });
  }

  // Analytics Sub-Tabs
  const analyticsTabBtns = document.querySelectorAll('.analytics-tab-btn');
  analyticsTabBtns.forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      analyticsTabBtns.forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetTab = tabBtn.getAttribute('data-tab');

      document.querySelectorAll('.analytics-tab-panel').forEach(panel => {
        panel.classList.add('hidden');
      });
      const targetPanel = document.getElementById(`analytics-tab-${targetTab}`);
      if (targetPanel) targetPanel.classList.remove('hidden');
    });
  });

  const btnStartMistakesModal = document.getElementById('btn-start-mistakes-from-modal');
  if (btnStartMistakesModal) {
    btnStartMistakesModal.addEventListener('click', () => {
      closeModal(modalAnalytics);
      const mistakesModeCard = document.querySelector('.mode-card[data-mode="mistakes"]');
      if (mistakesModeCard) mistakesModeCard.click();
      const btnStart = document.getElementById('btn-start');
      if (btnStart) btnStart.click();
    });
  }

  const btnClearHistory = document.getElementById('btn-clear-history');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      showConfirmModal({
        icon: '🗑️',
        title: currentLang === 'az' ? 'Tarixçəni Təmizlə' : 'Clear History',
        message: currentLang === 'az' ? 'Kviz tarixçəsini təmizləməyə əminsiniz? Bu əməliyyat geri qaytarılmır.' : 'Are you sure you want to clear your quiz history? This action cannot be undone.',
        confirmText: currentLang === 'az' ? 'Bəli, Təmizlə' : 'Yes, Clear',
        cancelText: currentLang === 'az' ? 'Ləğv et' : 'Cancel',
        onConfirm: () => {
          clearQuizHistory();
          renderAnalyticsModal();
          showToast(currentLang === 'az' ? 'Tarixçə təmizləndi!' : 'History cleared!', 'info');
          if (typeof onHistoryCleared === 'function') onHistoryCleared();
        }
      });
    });
  }

  // Dictionary Modal Handlers
  const btnDictionary = document.getElementById('btn-dictionary');
  const modalDictionary = document.getElementById('modal-dictionary');
  const btnCloseDictionary = document.getElementById('btn-close-dictionary');

  if (btnDictionary && modalDictionary && btnCloseDictionary) {
    btnDictionary.addEventListener('click', () => {
      if (typeof setupDictionaryEvents === 'function') setupDictionaryEvents();
      if (typeof renderDictionaryList === 'function') renderDictionaryList();
      openModal(modalDictionary);
    });

    btnCloseDictionary.addEventListener('click', () => closeModal(modalDictionary));
    modalDictionary.addEventListener('click', (e) => {
      if (e.target === modalDictionary) closeModal(modalDictionary);
    });
  }

  // Scorecard Modal Handlers
  const modalScorecard = document.getElementById('modal-scorecard');
  const btnCloseScorecard = document.getElementById('btn-close-scorecard');
  const btnDownloadScorecard = document.getElementById('btn-download-scorecard');
  const btnShareScorecard = document.getElementById('btn-share-scorecard');

  if (modalScorecard && btnCloseScorecard) {
    btnCloseScorecard.addEventListener('click', () => closeModal(modalScorecard));
    modalScorecard.addEventListener('click', (e) => {
      if (e.target === modalScorecard) closeModal(modalScorecard);
    });
  }

  if (btnDownloadScorecard) {
    btnDownloadScorecard.addEventListener('click', () => {
      if (typeof downloadScoreCardPNG === 'function') downloadScoreCardPNG();
    });
  }

  if (btnShareScorecard) {
    btnShareScorecard.addEventListener('click', () => {
      if (typeof shareScoreCardNative === 'function') shareScoreCardNative();
    });
  }
}
