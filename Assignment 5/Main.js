/*
Author: Saadat Baig
Date: August 8, 2025
main.js
*/

// Run once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  // ===== Accessibility: Alt+1 focuses the first image (ensure focusable) =====
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === '1') {
      const firstImg = document.querySelector('img');
      if (firstImg) {
        if (!firstImg.hasAttribute('tabindex')) firstImg.setAttribute('tabindex', '-1');
        firstImg.focus();
      }
    }
  });

  // ===== Back to Top button =====
  const topButton = document.getElementById('backToTop');
  if (topButton) {
    const toggleTopBtn = () => {
      topButton.style.display = window.scrollY > 300 ? 'block' : 'none';
    };
    toggleTopBtn();
    window.addEventListener('scroll', toggleTopBtn);
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Show/Hide comments — MDN parity with a11y =====
  const showHideBtn = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');

  if (showHideBtn && commentWrapper) {
    const isButton = showHideBtn.tagName.toLowerCase() === 'button';
    const setState = (open) => {
      commentWrapper.hidden = !open;
      showHideBtn.textContent = open ? 'Hide comments' : 'Show comments';
      if (isButton) showHideBtn.setAttribute('aria-expanded', String(open));
    };

    setState(false);

    showHideBtn.addEventListener('click', () => {
      const openNow = !commentWrapper.hidden;
      setState(!openNow);

      if (!openNow) {
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
      } else if (showHideBtn.focus) {
        showHideBtn.focus();
      }
    });
  }

  // ===== Add new comment — MDN parity with minor safety =====
  const form = document.querySelector('.comment-form');
  const nameField = document.querySelector('#name');
  const commentField = document.querySelector('#comment');
  const list = document.querySelector('.comment-container');

  if (form && nameField && commentField && list) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitComment();
    });

    function submitComment() {
      const nameValue = (nameField.value || '').trim();
      const commentValue = (commentField.value || '').trim();
      if (!nameValue || !commentValue) return;

      const listItem = document.createElement('li');
      const namePara = document.createElement('p');
      const commentPara = document.createElement('p');

      namePara.textContent = nameValue;
      commentPara.textContent = commentValue;

      list.appendChild(listItem);
      listItem.appendChild(namePara);
      listItem.appendChild(commentPara);

      nameField.value = '';
      commentField.value = '';
      nameField.focus();
    }
  }

  // ========================================================================
  //                      SITE SEARCH (client-side filter)
  // ========================================================================
  const siteSearchForm = document.querySelector('.site-search');
  const siteSearchInput = siteSearchForm ? siteSearchForm.querySelector('input[type="search"]') : null;

  if (siteSearchForm && siteSearchInput) {
    // Prevent full page reload on submit; apply filter instead
    siteSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applySearch(siteSearchInput.value);
    });

    // Live filter while typing (debounced)
    let t;
    siteSearchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => applySearch(siteSearchInput.value), 150);
    });

    // Esc to clear search quickly
    siteSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        siteSearchInput.value = '';
        applySearch('');
      }
    });
  }

  // Gather candidate "items" once, then just show/hide on each search.
  // Designed to work across Home / Our Team / Projects / Blog without HTML changes.
  const searchScope = document.querySelector('main') || document.body;
  const searchItems = collectSearchItems(searchScope);
  const noResultsEl = ensureNoResultsEl(searchScope);

  function applySearch(raw) {
    const q = (raw || '').trim().toLowerCase();

    if (!q) {
      // Show everything when search is cleared
      searchItems.forEach(el => {
        if (el.hidden) el.hidden = false;
      });
      if (noResultsEl) noResultsEl.hidden = true;
      return;
    }

    let matches = 0;
    searchItems.forEach(el => {
      const text = el.textContent ? el.textContent.toLowerCase() : '';
      const hit = text.includes(q);
      el.hidden = !hit;
      if (hit) matches++;
    });

    if (noResultsEl) {
      noResultsEl.hidden = matches > 0;
      if (matches === 0) {
        // show what we searched for
        noResultsEl.querySelector('[data-q]').textContent = raw.trim();
      }
    }
  }

  function collectSearchItems(scope) {
    // Priority 1: author-annotated targets
    const annotated = Array.from(scope.querySelectorAll('[data-search-item]'));

    // Priority 2: common card/list/table-row/figure patterns used across your pages
    const commonSelectors = [
      '.project-card',              // projects.html cards (if present)
      '.post-card',                 // blog posts (if present)
      '.team-card, .card',          // team member cards (if present)
      '.media',                     // figure blocks with images/captions
      'table tbody tr',             // data rows
      '.related-links li',          // sidebar list items
      '.comment-container li',      // comments
      'article.post > section',     // logical content sections
    ];
    const common = Array.from(scope.querySelectorAll(commonSelectors.join(',')));

    // Fallback: if a page is very bare, use top-level paragraphs under the article
    let fallback = [];
    if (common.length === 0) {
      fallback = Array.from(scope.querySelectorAll('article.post > p'));
    }

    // Ensure uniqueness and only elements that are actually visible containers (not the whole <main>)
    const set = new Set();
    [...annotated, ...common, ...fallback].forEach(el => {
      if (el && el.nodeType === 1) set.add(el);
    });

    return Array.from(set);
  }

  function ensureNoResultsEl(scope) {
    // Create a polite "no results" line that we can show/hide
    let info = scope.querySelector('.search-no-results');
    if (info) return info;

    info = document.createElement('p');
    info.className = 'search-no-results';
    info.hidden = true;
    info.setAttribute('role', 'status');      // announce updates politely
    info.setAttribute('aria-live', 'polite'); //
    info.style.margin = '1rem 0';
    info.innerHTML = `No results for “<span data-q></span>”.`;
    // Prefer placing near the article/post content
    const post = scope.querySelector('article.post') || scope;
    post.appendChild(info);
    return info;
  }
});