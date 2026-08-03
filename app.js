/* ==========================================================================
   Irregular Verbs Master - Multi-language Quiz Engine & Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
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

  // Language State
  let currentLang = localStorage.getItem('verb_master_lang') || 'az';

  const translations = {
    az: {
      hero_title: "İngilis Dili Feil Testi",
      hero_subtitle: "145+ Qaydasız və Qaydalı feili 5 fərqli sual növü ilə interaktiv şəkildə öyrənin və test edin.",
      section_title: "Sual Sayını Seçin",
      mode_questions: "Sual",
      mode_all: "Bütün Baza",
      mode_endless: "Sonsuz Rejim",
      badge_fast: "Çox tez",
      badge_std: "Standart",
      badge_med: "Orta",
      badge_deep: "Dərin",
      badge_full: "Tam Siyahı",
      badge_until_wrong: "Səhv edənədək",
      btn_start: "Testə Başla",
      btn_faq_home: "❓ Sual Növləri və İzahlar",
      btn_quit: "Sonlandır ✕",
      btn_submit: "Təsdiqlə",
      btn_next: "Növbəti Sual",
      btn_restart: "Yenidən Başla",
      btn_home: "Ana Menyu",
      stat_q: "Sual",
      stat_score: "Xal",
      stat_streak: "Streak",
      res_title: "Test Yekunlaşdı!",
      res_subtitle: "Əla nəticə göstərdiniz!",
      res_lbl_score: "Ümumi Xal",
      res_lbl_accuracy: "Dəqiqlik",
      res_lbl_correct: "Doğru",
      res_lbl_wrong: "Səhv",
      res_lbl_streak: "Maksimum Streak",
      review_title: "Səhv Edilmiş Feillər və İzahları",
      modal_title: "❓ Sual Növləri haqqında İzah",
      
      q1_title: "Növ 1: Formanı Yazın",
      q1_prompt: (word, label) => `"<strong>${word}</strong>" feilinin <u>${label}</u> formasını daxil edin:`,
      q1_placeholder: "Cavabınızı yazın...",
      
      q2_title: "Növ 2: Sıranın Doğruluğu",
      q2_prompt: "Aşağıdakı feil sırası tamamilə düzgündür?",
      q2_true: "Düzgündür (True)",
      q2_false: "Səhvdir (False)",
      
      q3_title: "Növ 3: Çatışmayan Formanı Yazın",
      q3_prompt: "Boş olan həlqəni doldurun:",
      q3_placeholder: "Çatışmayan formanı yazın...",
      
      q4_title: "Növ 4: Formanı Təyin Etmək",
      q4_prompt: (word) => `"<strong>${word}</strong>" sözü hansı formada ola bilər? <em>(Bir və ya bir neçə seçin)</em>`,
      
      q5_title: "Növ 5: Düzgün Sıraya Salın",
      q5_prompt: "Feilin 3 formasını sırası ilə (V1 → V2 → V3) düzün:",
      
      fb_correct: (pts) => `✨ Tamamilə Düzgündür! (+${pts} Xal)`,
      fb_wrong: (ans) => `❌ Səhvdir! <br/><strong>Düzgün cavab:</strong> ${ans}`,

      // FAQ Modal Keys
      faq_t1: "✏️ Növ 1: Formanı Yazın",
      faq_p1: "Verilmiş feilin tələb olunan V1, V2 və ya V3 formasını klaviaturadan daxil edin.",
      faq_ex1: 'Nümunə: "write" (V2) → <strong>wrote</strong>',
      faq_t2: "⚖️ Növ 2: Sıranın Doğruluğu (True/False)",
      faq_p2: "Feilin 3 forması verilir və sıranın tam doğru olub-olmaması soruşulur.",
      faq_ex2: 'Nümunə: "go - went - gone" → <strong>Düzgündür (True)</strong>',
      faq_t3: "🧩 Növ 3: Çatışmayan Formanı Yazın",
      faq_p3: "3 formadan 2-si verilir, çatışmayan 1 boşluğu daxil edirsiniz.",
      faq_ex3: 'Nümunə: "go - ___ - gone" → <strong>went</strong>',
      faq_t4: "🎯 Növ 4: Formanı Təyin Etmək",
      faq_p4: "Sözün V1, V2 və ya V3 formasını təyin edin. Eyni formaya malik feillər üçün 1 və ya bir neçə variant seçilməlidir.",
      faq_ex4: 'Nümunə: "cut" → <strong>V1, V2, V3 (Hər üçü)</strong>',
      faq_t5: "🔀 Növ 5: Düzgün Sıraya Salın",
      faq_p5: "Qarışıq verilmiş 3 sözü klikləyərək və ya sürükləyib buraxaraq (Drag & Drop) düzgün sıraya salın.",
      faq_ex5: 'Nümunə: "went - gone - go" → <strong>go - went - gone</strong>'
    },
    en: {
      hero_title: "English Verb Master",
      hero_subtitle: "Master 145+ Irregular & Regular English verbs with 5 interactive question types.",
      section_title: "Select Question Count",
      mode_questions: "Questions",
      mode_all: "Full Database",
      mode_endless: "Endless Mode",
      badge_fast: "Quick",
      badge_std: "Standard",
      badge_med: "Medium",
      badge_deep: "Deep",
      badge_full: "Full List",
      badge_until_wrong: "Until wrong",
      btn_start: "Start Quiz",
      btn_faq_home: "❓ Question Types & Guide",
      btn_quit: "Quit ✕",
      btn_submit: "Submit",
      btn_next: "Next Question",
      btn_restart: "Restart",
      btn_home: "Home Menu",
      stat_q: "Question",
      stat_score: "Score",
      stat_streak: "Streak",
      res_title: "Quiz Completed!",
      res_subtitle: "Great job on completing the quiz!",
      res_lbl_score: "Total Score",
      res_lbl_accuracy: "Accuracy",
      res_lbl_correct: "Correct",
      res_lbl_wrong: "Incorrect",
      res_lbl_streak: "Max Streak",
      review_title: "Incorrect Verbs & Review",
      modal_title: "❓ Question Types Guide",
      
      q1_title: "Type 1: Type the Form",
      q1_prompt: (word, label) => `Type the <u>${label}</u> form of "<strong>${word}</strong>":`,
      q1_placeholder: "Type your answer...",
      
      q2_title: "Type 2: Check Sequence",
      q2_prompt: "Is the following verb sequence completely correct?",
      q2_true: "Correct (True)",
      q2_false: "Incorrect (False)",
      
      q3_title: "Type 3: Fill Missing Form",
      q3_prompt: "Fill in the missing form:",
      q3_placeholder: "Type missing form...",
      
      q4_title: "Type 4: Identify Form",
      q4_prompt: (word) => `Which form(s) can "<strong>${word}</strong>" be? <em>(Select one or more)</em>`,
      
      q5_title: "Type 5: Reorder 3 Forms",
      q5_prompt: "Order the 3 verb forms correctly (V1 → V2 → V3):",
      
      fb_correct: (pts) => `✨ Correct! (+${pts} Pts)`,
      fb_wrong: (ans) => `❌ Incorrect! <br/><strong>Correct answer:</strong> ${ans}`,

      // FAQ Modal Keys
      faq_t1: "✏️ Type 1: Type the Form",
      faq_p1: "Type the requested V1, V2, or V3 form of the given verb.",
      faq_ex1: 'Example: "write" (V2) → <strong>wrote</strong>',
      faq_t2: "⚖️ Type 2: Check Sequence (True/False)",
      faq_p2: "Check if the 3 verb forms are listed in the correct order.",
      faq_ex2: 'Example: "go - went - gone" → <strong>Correct (True)</strong>',
      faq_t3: "🧩 Type 3: Fill Missing Form",
      faq_p3: "2 out of 3 forms are given; type the missing 3rd form.",
      faq_ex3: 'Example: "go - ___ - gone" → <strong>went</strong>',
      faq_t4: "🎯 Type 4: Identify Form",
      faq_p4: "Identify whether the word is V1, V2, or V3. Select multiple if applicable.",
      faq_ex4: 'Example: "cut" → <strong>V1, V2, V3 (All three)</strong>',
      faq_t5: "🔀 Type 5: Reorder 3 Forms",
      faq_p5: "Click or drag & drop 3 scrambled forms into correct order.",
      faq_ex5: 'Example: "went - gone - go" → <strong>go - went - gone</strong>'
    }
  };

  function t(key, ...args) {
    const dict = translations[currentLang] || translations.az;
    const val = dict[key] || translations.az[key] || key;
    if (typeof val === 'function') return val(...args);
    return val;
  }

  // Custom Language Dropdown Controller
  const customLangDropdown = document.getElementById('custom-lang-dropdown');
  const langTriggerBtn = document.getElementById('lang-trigger-btn');
  const langMenu = document.getElementById('lang-menu');
  const currentLangFlag = document.getElementById('current-lang-flag');
  const currentLangCode = document.getElementById('current-lang-code');

  const AZ_FLAG_SVG = `<svg class="flag-icon" viewBox="0 0 30 20" width="20" height="14"><rect width="30" height="6.67" fill="#0092C7"/><rect y="6.67" width="30" height="6.67" fill="#E00034"/><rect y="13.33" width="30" height="6.67" fill="#009B00"/><circle cx="13.5" cy="10" r="2.2" fill="#fff"/><circle cx="14.2" cy="10" r="1.8" fill="#E00034"/><polygon points="17,10 17.6,9.2 17.2,10 18,10.3 17.3,10.6 17.4,11.4 16.8,10.8 16.2,11.2 16.5,10.4" fill="#fff"/></svg>`;
  const EN_FLAG_SVG = `<svg class="flag-icon" viewBox="0 0 60 30" width="20" height="14"><clipPath id="uk1"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk2"><path d="M30,15 L60,0 h-60 z L30,15 L0,30 h60 z"/></clipPath><g clip-path="url(#uk1)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk2)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>`;

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
    currentLang = lang;
    localStorage.setItem('verb_master_lang', lang);
    updateDropdownUI(lang);

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.innerHTML = t(key);
    });

    if (currentQuestion && screenQuiz.classList.contains('active') && !isAnswerSubmitted) {
      qTypeTitle.textContent = t(`q${currentQuestion.typeNum}_title`);
    }
  }

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


  // Web Audio Context for Chimes & Sounds
  let audioCtx = null;

  function playSound(type) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        osc.frequency.exponentialRampToValueAtTime(130.81, audioCtx.currentTime + 0.25); // C3
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // DOM Element References
  const themeToggleBtn = document.getElementById('theme-toggle');
  const screenHome = document.getElementById('screen-home');
  const screenQuiz = document.getElementById('screen-quiz');
  const screenResults = document.getElementById('screen-results');

  const modeCards = document.querySelectorAll('.mode-card');
  const btnStart = document.getElementById('btn-start');
  const btnQuit = document.getElementById('btn-quit');

  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizStreakEl = document.getElementById('quiz-streak');

  const qTypeIcon = document.getElementById('q-type-icon');
  const qTypeTitle = document.getElementById('q-type-title');
  const questionBody = document.getElementById('question-body');
  const questionCard = document.getElementById('question-card');
  const feedbackAlert = document.getElementById('feedback-alert');

  const btnSubmit = document.getElementById('btn-submit');
  const btnNext = document.getElementById('btn-next');

  const resScore = document.getElementById('res-score');
  const resAccuracy = document.getElementById('res-accuracy');
  const resCorrect = document.getElementById('res-correct');
  const resWrong = document.getElementById('res-wrong');
  const resBestStreak = document.getElementById('res-best-streak');
  const errorReviewSection = document.getElementById('error-review-section');
  const errorList = document.getElementById('error-list');
  const btnRestart = document.getElementById('btn-restart');
  const btnHome = document.getElementById('btn-home');

  // Load Verbs Database
  fetch('verbs.json')
    .then(res => res.json())
    .then(data => {
      verbsData = data;
    })
    .catch(err => {
      console.error('Baza yüklənərkən xəta baş verdi:', err);
    });

  // Initial Language Setup
  applyLanguage(currentLang);

  // Theme Switcher Logic
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggleBtn.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '🌙' : '☀️';
  });

  // Mode Selection Card Clicks
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedMode = card.getAttribute('data-mode');
    });
  });

  // Navigation Helper
  function switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  // Helper Functions
  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normalizeText(text) {
    return text.trim().toLowerCase();
  }

  // Start Quiz
  btnStart.addEventListener('click', () => {
    if (verbsData.length === 0) {
      alert('Baza hələ yüklənməyib. Zəhmət olmasa bir anlıq gözləyin.');
      return;
    }

    currentQuestionIndex = 0;
    score = 0;
    streak = 0;
    maxStreak = 0;
    correctCount = 0;
    wrongCount = 0;
    errorReviewList = [];

    if (selectedMode === 'endless') {
      totalQuestions = Infinity;
    } else if (selectedMode === 'all') {
      totalQuestions = verbsData.length;
    } else {
      totalQuestions = parseInt(selectedMode, 10);
    }

    updateHeaderStats();
    switchScreen(screenQuiz);
    loadNextQuestion();
  });

  btnQuit.addEventListener('click', () => {
    if (confirm(currentLang === 'az' ? 'Testi vaxtından əvvəl sonlandırmaq istədiyinizdən əminsiniz?' : 'Are you sure you want to quit the quiz early?')) {
      endQuiz();
    }
  });

  function updateHeaderStats() {
    quizScoreEl.textContent = score;
    quizStreakEl.textContent = `🔥 ${streak}`;

    if (totalQuestions === Infinity) {
      quizProgressText.textContent = `${t('stat_q')} ${currentQuestionIndex + 1} (♾️)`;
      quizProgressBar.style.width = '100%';
    } else {
      quizProgressText.textContent = `${currentQuestionIndex + 1} / ${totalQuestions}`;
      const percent = ((currentQuestionIndex) / totalQuestions) * 100;
      quizProgressBar.style.width = `${percent}%`;
    }
  }

  // --------------------------------------------------------------------------
  // QUESTION GENERATOR (5 NÖV)
  // --------------------------------------------------------------------------

  function loadNextQuestion() {
    isAnswerSubmitted = false;
    feedbackAlert.className = 'feedback-alert hidden';
    feedbackAlert.textContent = '';
    btnSubmit.classList.remove('hidden');
    btnSubmit.disabled = true;
    btnNext.classList.add('hidden');
    questionCard.classList.remove('shake');

    if (currentQuestionIndex >= totalQuestions) {
      endQuiz();
      return;
    }

    updateHeaderStats();

    // Random Question Type from 1 to 5
    const typeNum = Math.floor(Math.random() * 5) + 1;
    const randomVerb = getRandomItem(verbsData);

    switch (typeNum) {
      case 1: generateType1(randomVerb); break;
      case 2: generateType2(randomVerb); break;
      case 3: generateType3(randomVerb); break;
      case 4: generateType4(randomVerb); break;
      case 5: generateType5(randomVerb); break;
    }
  }

  // NÖV 1: Formanı Yazmaq
  function generateType1(verb) {
    qTypeIcon.textContent = '✏️';
    qTypeTitle.textContent = t('q1_title');

    const targetFormIndex = Math.floor(Math.random() * 3) + 1;
    const targetLabel = targetFormIndex === 1 ? 'V1 (Base)' : targetFormIndex === 2 ? 'V2 (Past Simple)' : 'V3 (Past Participle)';

    const sourceFormIndex = targetFormIndex === 1 ? 2 : 1;
    const sourceWord = verb[`v${sourceFormIndex}`][0];

    questionBody.innerHTML = `
      <div class="question-title">
        ${t('q1_prompt', sourceWord, targetLabel)}
      </div>
      <input type="text" id="type1-input" class="input-field" placeholder="${t('q1_placeholder')}" autocomplete="off" autofocus />
    `;

    const inputEl = document.getElementById('type1-input');
    inputEl.focus();
    btnSubmit.disabled = inputEl.value.trim() === '';

    inputEl.addEventListener('input', () => {
      btnSubmit.disabled = inputEl.value.trim() === '';
    });

    inputEl.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && !isAnswerSubmitted && !btnSubmit.disabled) submitAnswer();
    });

    currentQuestion = {
      verb,
      typeNum: 1,
      type: t('q1_title'),
      validate: () => {
        const val = normalizeText(inputEl.value);
        const correctAnswers = verb[`v${targetFormIndex}`].map(normalizeText);
        const isCorrect = correctAnswers.includes(val);
        return {
          isCorrect,
          correctDisplay: verb[`v${targetFormIndex}`].join(' / '),
          userDisplay: inputEl.value || '(Boş / Empty)'
        };
      }
    };
  }

  // NÖV 2: Sıranın Doğruluğu (True/False)
  function generateType2(verb) {
    qTypeIcon.textContent = '⚖️';
    qTypeTitle.textContent = t('q2_title');

    const isTrue = Math.random() < 0.5;
    let sequenceText = '';

    if (isTrue) {
      sequenceText = `${verb.v1[0]} - ${verb.v2[0]} - ${verb.v3[0]}`;
    } else {
      const fakeType = Math.random();
      if (verb.type === 'irregular' && fakeType < 0.6) {
        const fakeV2 = verb.v1[0] + 'ed';
        const fakeV3 = verb.v1[0] + 'ed';
        sequenceText = `${verb.v1[0]} - ${fakeV2} - ${fakeV3}`;
      } else {
        const otherVerb = getRandomItem(verbsData);
        sequenceText = `${verb.v1[0]} - ${otherVerb.v2[0]} - ${verb.v3[0]}`;
      }
    }

    questionBody.innerHTML = `
      <div class="question-title">${t('q2_prompt')}</div>
      <div class="question-prompt">${sequenceText}</div>
      <div class="tf-grid">
        <button class="tf-btn" data-val="true">${t('q2_true')}</button>
        <button class="tf-btn" data-val="false">${t('q2_false')}</button>
      </div>
    `;

    let selectedValue = null;
    const tfBtns = questionBody.querySelectorAll('.tf-btn');
    tfBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isAnswerSubmitted) return;
        tfBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedValue = btn.getAttribute('data-val') === 'true';
        btnSubmit.disabled = false;
      });
    });

    currentQuestion = {
      verb,
      typeNum: 2,
      type: t('q2_title'),
      validate: () => {
        if (selectedValue === null) {
          return { isCorrect: false, correctDisplay: isTrue ? t('q2_true') : t('q2_false'), userDisplay: 'None' };
        }
        const isCorrect = selectedValue === isTrue;
        return {
          isCorrect,
          correctDisplay: isTrue ? t('q2_true') : `${t('q2_false')} (${verb.v1[0]} - ${verb.v2[0]} - ${verb.v3[0]})`,
          userDisplay: selectedValue ? t('q2_true') : t('q2_false')
        };
      }
    };
  }

  // NÖV 3: Çatışmayan Formanı Yazın
  function generateType3(verb) {
    qTypeIcon.textContent = '🧩';
    qTypeTitle.textContent = t('q3_title');

    const missingIndex = Math.floor(Math.random() * 3) + 1;

    const v1Str = missingIndex === 1 ? '___' : verb.v1[0];
    const v2Str = missingIndex === 2 ? '___' : verb.v2[0];
    const v3Str = missingIndex === 3 ? '___' : verb.v3[0];

    questionBody.innerHTML = `
      <div class="question-title">${t('q3_prompt')}</div>
      <div class="question-prompt">${v1Str} - ${v2Str} - ${v3Str}</div>
      <input type="text" id="type3-input" class="input-field" placeholder="${t('q3_placeholder')}" autocomplete="off" autofocus />
    `;

    const inputEl = document.getElementById('type3-input');
    inputEl.focus();
    btnSubmit.disabled = inputEl.value.trim() === '';

    inputEl.addEventListener('input', () => {
      btnSubmit.disabled = inputEl.value.trim() === '';
    });

    inputEl.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && !isAnswerSubmitted && !btnSubmit.disabled) submitAnswer();
    });

    currentQuestion = {
      verb,
      typeNum: 3,
      type: t('q3_title'),
      validate: () => {
        const val = normalizeText(inputEl.value);
        const correctAnswers = verb[`v${missingIndex}`].map(normalizeText);
        const isCorrect = correctAnswers.includes(val);
        return {
          isCorrect,
          correctDisplay: verb[`v${missingIndex}`].join(' / '),
          userDisplay: inputEl.value || '(Boş / Empty)'
        };
      }
    };
  }

  // NÖV 4: Formanı Təyin Etmək
  function generateType4(verb) {
    qTypeIcon.textContent = '🎯';
    qTypeTitle.textContent = t('q4_title');

    const availableForms = [1, 2, 3];
    const chosenFormIndex = getRandomItem(availableForms);
    const chosenWord = verb[`v${chosenFormIndex}`][0];

    const correctCategories = [];
    if (verb.v1.map(normalizeText).includes(normalizeText(chosenWord))) correctCategories.push('V1');
    if (verb.v2.map(normalizeText).includes(normalizeText(chosenWord))) correctCategories.push('V2');
    if (verb.v3.map(normalizeText).includes(normalizeText(chosenWord))) correctCategories.push('V3');

    questionBody.innerHTML = `
      <div class="question-title">
        ${t('q4_prompt', chosenWord)}
      </div>
      <div class="checkbox-grid">
        <div class="checkbox-card" data-val="V1">V1 (Base)</div>
        <div class="checkbox-card" data-val="V2">V2 (Past Simple)</div>
        <div class="checkbox-card" data-val="V3">V3 (Past Participle)</div>
      </div>
    `;

    const cbCards = questionBody.querySelectorAll('.checkbox-card');
    cbCards.forEach(card => {
      card.addEventListener('click', () => {
        if (isAnswerSubmitted) return;
        card.classList.toggle('selected');
        const selectedCount = questionBody.querySelectorAll('.checkbox-card.selected').length;
        btnSubmit.disabled = selectedCount === 0;
      });
    });

    currentQuestion = {
      verb,
      typeNum: 4,
      type: t('q4_title'),
      validate: () => {
        const selected = Array.from(questionBody.querySelectorAll('.checkbox-card.selected'))
                              .map(c => c.getAttribute('data-val'));

        const isCorrect = selected.length === correctCategories.length &&
                          selected.every(val => correctCategories.includes(val));

        return {
          isCorrect,
          correctDisplay: correctCategories.join(', '),
          userDisplay: selected.length > 0 ? selected.join(', ') : 'None'
        };
      }
    };
  }

  // NÖV 5: Düzgün Sıraya Salmaq
  function generateType5(verb) {
    qTypeIcon.textContent = '🔀';
    qTypeTitle.textContent = t('q5_title');

    const v1Word = verb.v1[0];
    const v2Word = verb.v2[0];
    const v3Word = verb.v3[0];

    let scrambled = shuffleArray([v1Word, v2Word, v3Word]);
    if (scrambled[0] === v1Word && scrambled[1] === v2Word && scrambled[2] === v3Word) {
      scrambled = [v2Word, v3Word, v1Word];
    }

    questionBody.innerHTML = `
      <div class="question-title">${t('q5_prompt')}</div>
      <div class="reorder-container">
        <div id="reorder-dropzone" class="reorder-dropzone"></div>
        <div id="reorder-pool" class="reorder-pool">
          ${scrambled.map(w => `<div class="reorder-item" draggable="true" data-word="${w}">${w}</div>`).join('')}
        </div>
      </div>
    `;

    const dropzone = document.getElementById('reorder-dropzone');
    const pool = document.getElementById('reorder-pool');
    let draggedItem = null;

    function updateReorderBtnState() {
      const placedCount = dropzone.querySelectorAll('.reorder-item').length;
      btnSubmit.disabled = placedCount < 3;
    }

    questionBody.querySelectorAll('.reorder-item').forEach(item => {
      item.addEventListener('click', () => {
        if (isAnswerSubmitted) return;
        if (item.parentElement === pool) {
          dropzone.appendChild(item);
        } else {
          pool.appendChild(item);
        }
        updateReorderBtnState();
      });

      item.addEventListener('dragstart', (e) => {
        if (isAnswerSubmitted) {
          e.preventDefault();
          return;
        }
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.getAttribute('data-word'));
      });

      item.addEventListener('dragend', () => {
        draggedItem = null;
        item.classList.remove('dragging');
        dropzone.classList.remove('drag-over');
        pool.classList.remove('drag-over');
        updateReorderBtnState();
      });
    });

    [dropzone, pool].forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (draggedItem) {
          zone.appendChild(draggedItem);
          updateReorderBtnState();
        }
      });
    });

    currentQuestion = {
      verb,
      typeNum: 5,
      type: t('q5_title'),
      validate: () => {
        const userItems = Array.from(dropzone.querySelectorAll('.reorder-item')).map(i => i.getAttribute('data-word'));
        const isCorrect = userItems.length === 3 &&
                          normalizeText(userItems[0]) === normalizeText(v1Word) &&
                          normalizeText(userItems[1]) === normalizeText(v2Word) &&
                          normalizeText(userItems[2]) === normalizeText(v3Word);

        return {
          isCorrect,
          correctDisplay: `${v1Word} - ${v2Word} - ${v3Word}`,
          userDisplay: userItems.length > 0 ? userItems.join(' - ') : 'Not ordered'
        };
      }
    };
  }

  // --------------------------------------------------------------------------
  // SUBMIT & VALIDATION ENGINE
  // --------------------------------------------------------------------------

  function disableQuestionInputs() {
    questionBody.querySelectorAll('input').forEach(input => {
      input.disabled = true;
    });
    questionBody.querySelectorAll('.tf-btn').forEach(btn => {
      btn.style.pointerEvents = 'none';
    });
    questionBody.querySelectorAll('.checkbox-card').forEach(card => {
      card.style.pointerEvents = 'none';
    });
    questionBody.querySelectorAll('.reorder-item').forEach(item => {
      item.draggable = false;
      item.style.pointerEvents = 'none';
    });
  }

  btnSubmit.addEventListener('click', submitAnswer);

  function submitAnswer() {
    if (isAnswerSubmitted || !currentQuestion) return;
    isAnswerSubmitted = true;

    disableQuestionInputs();

    const result = currentQuestion.validate();

    if (result.isCorrect) {
      playSound('success');
      const earnedPts = 10 + (streak * 2);
      score += earnedPts;
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      correctCount++;

      feedbackAlert.className = 'feedback-alert feedback-success';
      feedbackAlert.innerHTML = t('fb_correct', earnedPts);
    } else {
      playSound('error');
      streak = 0;
      wrongCount++;

      questionCard.classList.add('shake');

      feedbackAlert.className = 'feedback-alert feedback-error';
      feedbackAlert.innerHTML = t('fb_wrong', result.correctDisplay);

      errorReviewList.push({
        verb: currentQuestion.verb,
        type: currentQuestion.type,
        userAns: result.userDisplay,
        correctAns: result.correctDisplay
      });

      if (selectedMode === 'endless') {
        setTimeout(() => {
          endQuiz();
        }, 1800);
        return;
      }
    }

    updateHeaderStats();
    btnSubmit.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnNext.focus();
  }

  btnNext.addEventListener('click', () => {
    currentQuestionIndex++;
    loadNextQuestion();
  });

  // End Quiz and Show Results
  function endQuiz() {
    switchScreen(screenResults);

    resScore.textContent = score;
    resCorrect.textContent = correctCount;
    resWrong.textContent = wrongCount;
    resBestStreak.textContent = `🔥 ${maxStreak}`;

    const totalAnswered = correctCount + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    resAccuracy.textContent = `${accuracy}%`;

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

  // Result Screen Actions
  btnRestart.addEventListener('click', () => {
    btnStart.click();
  });

  btnHome.addEventListener('click', () => {
    switchScreen(screenHome);
  });

  // FAQ / Help Modal Logic
  const btnFaqHome = document.getElementById('btn-faq-home');
  const btnCloseFaq = document.getElementById('btn-close-faq');
  const modalFaq = document.getElementById('modal-faq');

  if (modalFaq && btnCloseFaq) {
    if (btnFaqHome) {
      btnFaqHome.addEventListener('click', () => modalFaq.classList.remove('hidden'));
    }
    btnCloseFaq.addEventListener('click', () => modalFaq.classList.add('hidden'));
    modalFaq.addEventListener('click', (e) => {
      if (e.target === modalFaq) modalFaq.classList.add('hidden');
    });
  }
});
