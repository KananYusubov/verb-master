/* ==========================================================================
   Verb Dictionary & Live Search Module
   ========================================================================== */

let dictVerbsData = [];
let dictCurrentFilter = 'all'; // 'all', 'irregular', 'regular'

function debounce(func, wait = 150) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function initDictionary(verbs) {
  dictVerbsData = verbs || [];
}

function renderDictionaryList(resetScroll = false) {
  const container = document.getElementById('dict-list-container');
  const viewport = document.getElementById('dict-virtual-viewport');
  const searchInput = document.getElementById('dict-search-input');
  const metaCountEl = document.getElementById('dict-meta-count');

  if (!container || !viewport) return;

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const mistakesMap = typeof loadMistakesMap === 'function' ? loadMistakesMap() : {};

  const filtered = dictVerbsData.filter(verb => {
    // Category Filter
    if (dictCurrentFilter === 'irregular' && verb.type !== 'irregular') return false;
    if (dictCurrentFilter === 'regular' && verb.type !== 'regular') return false;

    // Query Filter
    if (!query) return true;
    const v1Str = (verb.v1 || []).join(', ').toLowerCase();
    const v2Str = (verb.v2 || []).join(', ').toLowerCase();
    const v3Str = (verb.v3 || []).join(', ').toLowerCase();
    const azStr = (verb.meaning_az || '').toLowerCase();
    return v1Str.includes(query) || v2Str.includes(query) || v3Str.includes(query) || azStr.includes(query);
  });

  if (metaCountEl && typeof t === 'function') {
    metaCountEl.innerHTML = t('dict_count_info', filtered.length);
  }

  if (resetScroll && container) {
    container.scrollTop = 0;
  }

  if (filtered.length === 0) {
    viewport.innerHTML = `
      <div class="dict-empty-state">
        <div class="dict-empty-icon">🔍</div>
        <p>${typeof t === 'function' ? t('dict_no_results') : 'Axtarışa uyğun feil tapılmadı.'}</p>
      </div>
    `;
    return;
  }

  viewport.innerHTML = filtered.map(verb => {
    const v1Key = (verb.v1 && verb.v1[0]) ? verb.v1[0].toLowerCase() : '';
    const mistakeEntry = mistakesMap[v1Key];
    const typeTagClass = verb.type === 'regular' ? 'tag-regular' : 'tag-irregular';
    const typeTagText = verb.type === 'regular' ? 'Regular' : 'Irregular';

    const v1Val = (verb.v1 || []).join(' / ');
    const v2Val = (verb.v2 || []).join(' / ');
    const v3Val = (verb.v3 || []).join(' / ');

    return `
      <div class="dict-verb-card">
        <div class="dict-verb-main">
          <span class="dict-verb-az">${verb.meaning_az}</span>
          <div class="dict-verb-badges">
            ${mistakeEntry ? `<span class="dict-tag tag-mistake">⚠️ Səhv (${mistakeEntry.count})</span>` : ''}
            <span class="dict-tag ${typeTagClass}">${typeTagText}</span>
          </div>
        </div>
        <div class="dict-forms-grid">
          <div class="dict-form-box">
            <span class="dict-form-lbl">V1 (Base)</span>
            <span class="dict-form-val">${v1Val}</span>
          </div>
          <div class="dict-form-box">
            <span class="dict-form-lbl">V2 (Past)</span>
            <span class="dict-form-val">${v2Val}</span>
          </div>
          <div class="dict-form-box">
            <span class="dict-form-lbl">V3 (Participle)</span>
            <span class="dict-form-val">${v3Val}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupDictionaryEvents() {
  const searchInput = document.getElementById('dict-search-input');

  if (searchInput) {
    const debouncedRender = debounce(() => renderDictionaryList(true), 150);
    searchInput.addEventListener('input', debouncedRender);
  }

  const pills = document.querySelectorAll('.dict-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      dictCurrentFilter = pill.getAttribute('data-filter') || 'all';
      renderDictionaryList(true);
    });
  });
}
