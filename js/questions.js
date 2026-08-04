/* ==========================================================================
   Question Generators & Validation Engine (5 Interactive Question Types)
   ========================================================================== */

function getRandomVerb(verbsData) {
  if (!verbsData || verbsData.length === 0) return null;
  const idx = Math.floor(Math.random() * verbsData.length);
  return verbsData[idx];
}

function getRandomDistractorForm(correctForm) {
  const distractors = ['ed', 'en', 'ing', 'ted', 'ned'];
  const randomSuffix = distractors[Math.floor(Math.random() * distractors.length)];
  return correctForm + randomSuffix;
}

function generateQuestion(verbsData, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled) {
  const verb = getRandomVerb(verbsData);
  if (!verb) return null;
  const typeNum = Math.floor(Math.random() * 5) + 1;

  switch (typeNum) {
    case 1: return generateType1(verb, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled);
    case 2: return generateType2(verb, qPrompt, qBody, setSubmitDisabled);
    case 3: return generateType3(verb, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled);
    case 4: return generateType4(verb, qPrompt, qBody, setSubmitDisabled);
    case 5: return generateType5(verb, qPrompt, qBody, setSubmitDisabled);
    default: return generateType1(verb, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled);
  }
}

// Type 1: Type the Form
function generateType1(verb, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled) {
  const forms = ['v1', 'v2', 'v3'];
  const targetFormKey = forms[Math.floor(Math.random() * forms.length)];
  const formLabels = { v1: 'V1 (Infinitive)', v2: 'V2 (Past Simple)', v3: 'V3 (Past Participle)' };
  const correctAnswers = verb[targetFormKey];

  return {
    typeNum: 1,
    type: 'Formanı Yazın',
    verb: verb,
    render: () => {
      if (qPrompt) qPrompt.innerHTML = t('q1_prompt', verb.v1[0], formLabels[targetFormKey]);
      if (qBody) {
        qBody.innerHTML = `
          <input type="text" id="type1-input" class="input-field" placeholder="${t('q1_placeholder')}" autocomplete="off" autocorrect="off" capitalize="off" />
        `;
      }
      setTimeout(() => {
        const inp = document.getElementById('type1-input');
        if (inp) {
          inp.focus();
          inp.addEventListener('input', () => {
            if (typeof setSubmitDisabled === 'function') {
              setSubmitDisabled(inp.value.trim().length === 0);
            }
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              if (inp.value.trim().length > 0 && typeof onSubmitAnswer === 'function') {
                onSubmitAnswer();
              }
            }
          });
        }
      }, 50);
    },
    validate: () => {
      const inp = document.getElementById('type1-input');
      const userVal = inp ? inp.value.trim().toLowerCase() : '';
      const isCorrect = correctAnswers.some(ans => ans.toLowerCase() === userVal);
      return {
        isCorrect,
        userDisplay: userVal || '(Boş)',
        correctDisplay: correctAnswers.join(' / ')
      };
    }
  };
}

// Type 2: Check Sequence (True/False)
function generateType2(verb, qPrompt, qBody, setSubmitDisabled) {
  const isTrue = Math.random() < 0.5;
  let sequence = [];

  if (isTrue) {
    sequence = [verb.v1[0], verb.v2[0], verb.v3[0]];
  } else {
    const wrongIndex = Math.floor(Math.random() * 3);
    sequence = [verb.v1[0], verb.v2[0], verb.v3[0]];
    sequence[wrongIndex] = getRandomDistractorForm(sequence[wrongIndex]);
  }

  let selectedValue = null;

  return {
    typeNum: 2,
    type: 'Sıranın Doğruluğu',
    verb: verb,
    render: () => {
      if (qPrompt) qPrompt.innerHTML = `<strong>${sequence.join(' — ')}</strong>`;
      if (qBody) {
        qBody.innerHTML = `
          <div class="tf-grid">
            <button type="button" class="tf-btn" data-val="true">${t('q2_true')}</button>
            <button type="button" class="tf-btn" data-val="false">${t('q2_false')}</button>
          </div>
        `;

        const tfBtns = qBody.querySelectorAll('.tf-btn');
        tfBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            tfBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedValue = btn.getAttribute('data-val') === 'true';
            if (typeof setSubmitDisabled === 'function') {
              setSubmitDisabled(false);
            }
          });
        });
      }
    },
    validate: () => {
      const isCorrect = selectedValue === isTrue;
      return {
        isCorrect,
        userDisplay: selectedValue === null ? '(Seçilmədi)' : (selectedValue ? 'True' : 'False'),
        correctDisplay: isTrue ? 'True' : 'False'
      };
    }
  };
}

// Type 3: Fill Missing Form
function generateType3(verb, qPrompt, qBody, onSubmitAnswer, setSubmitDisabled) {
  const forms = ['v1', 'v2', 'v3'];
  const missingIndex = Math.floor(Math.random() * 3);
  const correctAnswers = verb[forms[missingIndex]];

  const sequenceDisplay = [
    missingIndex === 0 ? '___' : verb.v1[0],
    missingIndex === 1 ? '___' : verb.v2[0],
    missingIndex === 2 ? '___' : verb.v3[0]
  ];

  return {
    typeNum: 3,
    type: 'Çatışmayan Formanı Yazın',
    verb: verb,
    render: () => {
      if (qPrompt) qPrompt.innerHTML = `<strong>${sequenceDisplay.join(' — ')}</strong>`;
      if (qBody) {
        qBody.innerHTML = `
          <input type="text" id="type3-input" class="input-field" placeholder="${t('q3_placeholder')}" autocomplete="off" autocorrect="off" capitalize="off" />
        `;
      }
      setTimeout(() => {
        const inp = document.getElementById('type3-input');
        if (inp) {
          inp.focus();
          inp.addEventListener('input', () => {
            if (typeof setSubmitDisabled === 'function') {
              setSubmitDisabled(inp.value.trim().length === 0);
            }
          });
          inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              if (inp.value.trim().length > 0 && typeof onSubmitAnswer === 'function') {
                onSubmitAnswer();
              }
            }
          });
        }
      }, 50);
    },
    validate: () => {
      const inp = document.getElementById('type3-input');
      const userVal = inp ? inp.value.trim().toLowerCase() : '';
      const isCorrect = correctAnswers.some(ans => ans.toLowerCase() === userVal);
      return {
        isCorrect,
        userDisplay: userVal || '(Boş)',
        correctDisplay: correctAnswers.join(' / ')
      };
    }
  };
}

// Type 4: Identify Form (Multi-Select)
function generateType4(verb, qPrompt, qBody, setSubmitDisabled) {
  const targetWord = verb.v1[0];
  const correctForms = new Set();
  if (verb.v1.includes(targetWord)) correctForms.add('V1');
  if (verb.v2.includes(targetWord)) correctForms.add('V2');
  if (verb.v3.includes(targetWord)) correctForms.add('V3');

  const selectedForms = new Set();

  return {
    typeNum: 4,
    type: 'Formanı Təyin Etmək',
    verb: verb,
    render: () => {
      if (qPrompt) qPrompt.innerHTML = t('q4_prompt', targetWord);
      if (qBody) {
        qBody.innerHTML = `
          <div class="checkbox-grid">
            <div class="checkbox-card" data-form="V1">V1</div>
            <div class="checkbox-card" data-form="V2">V2</div>
            <div class="checkbox-card" data-form="V3">V3</div>
          </div>
        `;

        const cards = qBody.querySelectorAll('.checkbox-card');
        cards.forEach(card => {
          card.addEventListener('click', () => {
            const formVal = card.getAttribute('data-form');
            if (selectedForms.has(formVal)) {
              selectedForms.delete(formVal);
              card.classList.remove('selected');
            } else {
              selectedForms.add(formVal);
              card.classList.add('selected');
            }

            if (typeof setSubmitDisabled === 'function') {
              setSubmitDisabled(selectedForms.size === 0);
            }
          });
        });
      }
    },
    validate: () => {
      const isCorrect = correctForms.size === selectedForms.size &&
        [...correctForms].every(f => selectedForms.has(f));

      return {
        isCorrect,
        userDisplay: selectedForms.size > 0 ? [...selectedForms].join(', ') : '(Seçilmədi)',
        correctDisplay: [...correctForms].join(', ')
      };
    }
  };
}

// Type 5: Reorder 3 Forms (Click / Drag & Drop)
function generateType5(verb, qPrompt, qBody, setSubmitDisabled) {
  const correctOrder = [verb.v1[0], verb.v2[0], verb.v3[0]];
  let scrambled = [...correctOrder];

  while (scrambled.length > 1 && scrambled.every((val, idx) => val === correctOrder[idx])) {
    scrambled.sort(() => Math.random() - 0.5);
  }

  const currentSlots = [null, null, null];

  return {
    typeNum: 5,
    type: 'Düzgün Sıraya Salın',
    verb: verb,
    render: () => {
      if (qPrompt) qPrompt.innerHTML = t('q5_prompt');
      if (qBody) {
        qBody.innerHTML = `
          <div class="drag-slots-container">
            <div class="drag-slot" data-slot="0">
              <span class="slot-tag">V1</span>
              <span class="slot-text" id="slot-text-0">--</span>
            </div>
            <div class="drag-slot" data-slot="1">
              <span class="slot-tag">V2</span>
              <span class="slot-text" id="slot-text-1">--</span>
            </div>
            <div class="drag-slot" data-slot="2">
              <span class="slot-tag">V3</span>
              <span class="slot-text" id="slot-text-2">--</span>
            </div>
          </div>

          <div class="drag-items-header">
            <span class="chips-hint">${currentLang === 'az' ? 'Aşağıdakı sözləri sırası ilə klikləyin:' : 'Click the words in order:'}</span>
            <button type="button" id="btn-reset-slots" class="reset-slots-btn">↺ ${currentLang === 'az' ? 'Təmizlə' : 'Reset'}</button>
          </div>

          <div class="drag-items-container" id="drag-items">
            ${scrambled.map((word, idx) => `<button type="button" class="drag-chip" data-idx="${idx}">${word}</button>`).join('')}
          </div>
        `;

        const chips = qBody.querySelectorAll('.drag-chip');
        const slots = qBody.querySelectorAll('.drag-slot');
        const btnReset = document.getElementById('btn-reset-slots');

        function updateSlotsUI() {
          slots.forEach((slot, idx) => {
            const textEl = document.getElementById(`slot-text-${idx}`);
            if (currentSlots[idx] !== null) {
              if (textEl) {
                textEl.textContent = currentSlots[idx];
                textEl.classList.add('filled');
              }
              slot.classList.add('slot-active');
            } else {
              if (textEl) {
                textEl.textContent = '--';
                textEl.classList.remove('filled');
              }
              slot.classList.remove('slot-active');
            }
          });

          // Sync chips visibility
          const usedWords = [...currentSlots].filter(w => w !== null);
          chips.forEach(chip => {
            const word = chip.textContent;
            const timesInSlots = usedWords.filter(w => w === word).length;
            const matchingChips = Array.from(chips).filter(c => c.textContent === word);
            matchingChips.forEach((c, cIdx) => {
              if (cIdx < timesInSlots) {
                c.classList.add('chip-used');
              } else {
                c.classList.remove('chip-used');
              }
            });
          });

          // Enable submit button only if all 3 slots are filled
          const allFilled = currentSlots.every(s => s !== null);
          if (typeof setSubmitDisabled === 'function') {
            setSubmitDisabled(!allFilled);
          }
        }

        chips.forEach(chip => {
          chip.addEventListener('click', () => {
            if (chip.classList.contains('chip-used')) return;
            const word = chip.textContent;
            const freeSlotIdx = currentSlots.findIndex(s => s === null);
            if (freeSlotIdx !== -1) {
              currentSlots[freeSlotIdx] = word;
              updateSlotsUI();
            }
          });
        });

        slots.forEach((slot, sIdx) => {
          slot.addEventListener('click', () => {
            if (currentSlots[sIdx] !== null) {
              currentSlots[sIdx] = null;
              updateSlotsUI();
            }
          });
        });

        if (btnReset) {
          btnReset.addEventListener('click', () => {
            currentSlots[0] = null;
            currentSlots[1] = null;
            currentSlots[2] = null;
            updateSlotsUI();
          });
        }
      }
    },
    validate: () => {
      const isCorrect = currentSlots.every((val, idx) => val === correctOrder[idx]);
      return {
        isCorrect,
        userDisplay: currentSlots.some(s => s === null) ? '(Tamamlanmadı)' : currentSlots.join(' - '),
        correctDisplay: correctOrder.join(' - ')
      };
    }
  };
}
