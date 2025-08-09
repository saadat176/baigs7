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

  // ===== Show/Hide comments (keyboard accessible) =====
  const showHideBtn = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');

  if (showHideBtn && commentWrapper) {
    const isButton = showHideBtn.tagName.toLowerCase() === 'button';

    // If it's not a real <button>, make it behave like one
    if (!isButton) {
      showHideBtn.setAttribute('role', 'button');
      showHideBtn.setAttribute('tabindex', '0'); // focusable with Tab
    }

    const setState = (open) => {
      commentWrapper.hidden = !open;
      showHideBtn.textContent = open ? 'Hide comments' : 'Show comments';
      showHideBtn.setAttribute('aria-expanded', String(open));
    };

    setState(false);

    // Click toggles
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

    // Keyboard: Enter or Space toggles
    showHideBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // avoid page scroll on Space
        showHideBtn.click(); // reuse click handler
      }
    });
  }

  // ===== Add new comment =====
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
  //                         ENHANCED SITE SEARCH
  // ========================================================================
  const siteSearchForm = document.querySelector('.site-search');
  const siteSearchInput = siteSearchForm ? siteSearchForm.querySelector('input[type="search"]') : null;

  // Build a lightweight index of content to search
  const searchScope = document.querySelector('main') || document.body;
  const searchableSelectors = [
    'article.post h2',
    'article.post h3',
    'article.post p',
    'figcaption',
    '.related-links li',
    'table th',
    'table td'
  ];
  const searchableNodes = Array.from(searchScope.querySelectorAll(searchableSelectors.join(',')));

  // results panel + live region
  let panel, statusLive;
  if (siteSearchForm && siteSearchInput) {
    panel = document.createElement('div');
    panel.className = 'search-results-panel';
    panel.setAttribute('role', 'listbox');
    panel.setAttribute('aria-label', 'Search results');
    panel.hidden = true;

    // minimal styling; works without extra CSS
    panel.style.position = 'absolute';
    panel.style.zIndex = '999';
    panel.style.maxHeight = '280px';
    panel.style.overflow = 'auto';
    panel.style.background = '#ffffff';
    panel.style.border = '1px solid #cbd3ea';
    panel.style.boxShadow = '0 6px 18px rgba(0,0,0,.12)';
    panel.style.padding = '6px';
    panel.style.marginTop = '4px';
    panel.style.width = 'min(38rem, 90vw)';

    // container for positioning
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    siteSearchForm.appendChild(wrapper);
    wrapper.appendChild(panel);

    statusLive = document.createElement('div');
    statusLive.className = 'sr-only';
    statusLive.setAttribute('role', 'status');
    statusLive.setAttribute('aria-live', 'polite');
    siteSearchForm.appendChild(statusLive);
  }

  // Helpers: highlight management
  function clearHighlights() {
    const marks = searchScope.querySelectorAll('mark.search-hit');
    marks.forEach(m => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize(); // merge text nodes
    });
  }
  function highlightInNode(node, query) {
    if (!query) return;
    const txt = node.textContent;
    const idx = txt.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return;

    const before = document.createTextNode(txt.slice(0, idx));
    const hit = document.createElement('mark');
    hit.className = 'search-hit';
    hit.textContent = txt.slice(idx, idx + query.length);
    const after = document.createTextNode(txt.slice(idx + query.length));
    node.textContent = '';
    node.appendChild(before);
    node.appendChild(hit);
    node.appendChild(after);
  }

  function makeSnippet(text, q, len = 120) {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text.slice(0, len) + (text.length > len ? '…' : '');
    const start = Math.max(0, i - 30);
    const end = Math.min(text.length, i + q.length + 60);
    let snip = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    return snip;
  }

  function layoutPanel() {
    // keep panel aligned with input width
    if (!panel || !siteSearchInput) return;
    const rect = siteSearchInput.getBoundingClientRect();
    panel.style.left = `${siteSearchInput.offsetLeft}px`;
    panel.style.width = `${rect.width}px`;
  }
  window.addEventListener('resize', layoutPanel);

  // Perform search -> populate panel
  function runSearch(q) {
    clearHighlights();
    if (!panel) return;

    const query = (q || '').trim();
    panel.innerHTML = '';
    panel.hidden = true;

    if (!query) {
      statusLive && (statusLive.textContent = 'Search cleared.');
      return;
    }

    // "Smart" nav shortcuts
    const navMap = {
      'home': 'AllAboutBears.html',
      'team': 'our-team.html',
      'projects': 'projects.html',
      'blog': 'blog.html'
    };
    const qLower = query.toLowerCase();
    if (navMap[qLower]) {
      // show intention to navigate
      const item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.style.display = 'block';
      item.style.width = '100%';
      item.style.textAlign = 'left';
      item.style.padding = '8px 10px';
      item.style.border = '0';
      item.style.background = 'transparent';
      item.style.cursor = 'pointer';
      item.innerHTML = `Go to <strong>${navMap[qLower].replace('.html','')}</strong>`;
      item.addEventListener('click', () => { window.location.href = navMap[qLower]; });
      panel.appendChild(item);
      panel.hidden = false;
      statusLive && (statusLive.textContent = 'Navigation shortcut. Press Enter to go.');
      layoutPanel();
      return;
    }

    const results = [];
    for (const node of searchableNodes) {
      const text = (node.textContent || '').trim();
      if (!text) continue;
      if (text.toLowerCase().includes(qLower)) {
        results.push({ node, text });
        if (results.length >= 20) break; // cap results for panel
      }
    }

    if (results.length === 0) {
      const none = document.createElement('div');
      none.style.padding = '8px 10px';
      none.textContent = `No results for “${query}”.`;
      panel.appendChild(none);
      panel.hidden = false;
      statusLive && (statusLive.textContent = 'No results.');
      layoutPanel();
      return;
    }

    results.forEach((res, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'option');
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.textAlign = 'left';
      btn.style.padding = '8px 10px';
      btn.style.border = '0';
      btn.style.background = 'transparent';
      btn.style.cursor = 'pointer';
      btn.style.lineHeight = '1.35';

      // Heading label if available
      const sectionHeading = res.node.closest('article.post')?.querySelector('h2, h3');
      const label = sectionHeading ? sectionHeading.textContent.trim() : document.title;
      const snippet = makeSnippet(res.text, query);

      btn.innerHTML = `<strong>${label}</strong><br><span style="opacity:.85">${snippet}</span>`;
      btn.addEventListener('click', () => jumpToResult(res.node, query));
      panel.appendChild(btn);
    });

    panel.hidden = false;
    statusLive && (statusLive.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found.`);
    layoutPanel();
  }

  function jumpToResult(node, query) {
    clearHighlights();
    // ensure focusability
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
    node.focus({ preventScroll: true });
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightInNode(node, query);

    // quick visual cue
    node.style.transition = 'box-shadow .6s ease';
    const prevShadow = node.style.boxShadow;
    node.style.boxShadow = '0 0 0 4px rgba(255, 215, 0, .8)';
    setTimeout(() => { node.style.boxShadow = prevShadow || 'none'; }, 700);

    // hide panel after jump
    if (panel) panel.hidden = true;
  }

  if (siteSearchForm && siteSearchInput) {
    // Prevent full page reload on submit; center on best match
    siteSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = siteSearchInput.value.trim();
      // If a nav keyword, runSearch will show shortcut; pressing Enter should navigate.
      const navShortcuts = ['home', 'team', 'projects', 'blog'];
      if (navShortcuts.includes(q.toLowerCase())) {
        runSearch(q); // shows the "Go to" button
        // auto navigate on submit
        const map = {home:'AllAboutBears.html', team:'our-team.html', projects:'projects.html', blog:'blog.html'};
        window.location.href = map[q.toLowerCase()];
        return;
      }

      // Otherwise, pick first match and jump
      const qLower = q.toLowerCase();
      const first = searchableNodes.find(n => (n.textContent || '').toLowerCase().includes(qLower));
      if (first) {
        jumpToResult(first, q);
      } else {
        runSearch(q); // show "No results" panel
      }
    });

    // Live suggestions while typing (debounced)
    let t;
    siteSearchInput.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => runSearch(siteSearchInput.value), 200);
    });

    // Esc to clear search quickly
    siteSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        siteSearchInput.value = '';
        clearHighlights();
        if (panel) { panel.hidden = true; panel.innerHTML = ''; }
        statusLive && (statusLive.textContent = 'Search dismissed.');
      }
    });

    // Click off the panel closes it
    document.addEventListener('click', (e) => {
      if (!panel || panel.hidden) return;
      if (!panel.contains(e.target) && !siteSearchForm.contains(e.target)) {
        panel.hidden = true;
      }
    });
  }
});