/*
Author: Saadat Baig
Date: August 8, 2025
main.js
Commit 20: MDN parity — same behaviors as MDN sample with a11y fixes (hidden + aria-expanded),
           plus safe Alt+1 focus and Back-to-Top init.
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

  // ===== Back to Top button (MDN challenge doesn’t include it, but keep your behavior) =====
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
  // Works if the control is <button class="show-hide"> or <div class="show-hide">
  const showHideBtn = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');

  if (showHideBtn && commentWrapper) {
    // Initialize closed like MDN (wrapper hidden)
    const isButton = showHideBtn.tagName.toLowerCase() === 'button';
    const setState = (open) => {
      commentWrapper.hidden = !open;                          // a11y-friendly state
      showHideBtn.textContent = open ? 'Hide comments' : 'Show comments';
      if (isButton) showHideBtn.setAttribute('aria-expanded', String(open));
    };

    setState(false);

    // MDN uses onclick + text comparison; we keep the same visible logic
    showHideBtn.addEventListener('click', () => {
      const openNow = !commentWrapper.hidden;
      setState(!openNow);

      if (!openNow) {
        // Focus first field when opening (quality-of-life)
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.focus();
      } else if (showHideBtn.focus) {
        showHideBtn.focus();
      }
    });
  }

  // ===== Add new comment — MDN parity (same var names/flow), with trim + early return =====
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
      if (!nameValue || !commentValue) return; // simple validation like MDN would expect

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
});