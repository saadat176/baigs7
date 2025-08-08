/*
Author: Saadat Baig
Date: August 8, 2025
main.js
Commit 8: MDN-style comments toggle (hidden + aria-expanded), back-to-top reveal, Alt+1 focus.
*/

window.addEventListener('DOMContentLoaded', () => {
  // ===== Accessibility: Alt+1 focuses the first image =====
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === '1') {
      const firstImg = document.querySelector('img');
      if (firstImg) firstImg.focus();
    }
  });

  // ===== Back to Top button (reveal on scroll) =====
  const topButton = document.getElementById('backToTop');
  if (topButton) {
    const toggleTopBtn = () => {
      if (window.scrollY > 300) {
        topButton.style.display = 'block';
      } else {
        topButton.style.display = 'none';
      }
    };
    toggleTopBtn();
    window.addEventListener('scroll', toggleTopBtn);

    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Show/Hide Comments (MDN-style) =====
  const showHideBtn = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');

  if (showHideBtn && commentWrapper) {
    // Ensure initial state matches HTML (wrapper hidden)
    const setState = (open) => {
      showHideBtn.setAttribute('aria-expanded', String(open));
      showHideBtn.textContent = open ? 'Hide comments' : 'Show comments';
      commentWrapper.hidden = !open;
    };

    // If author left hidden off in markup, normalize it here
    setState(!commentWrapper.hasAttribute('hidden') ? true : false);

    showHideBtn.addEventListener('click', () => {
      const isOpen = showHideBtn.getAttribute('aria-expanded') === 'true';
      setState(!isOpen);
      if (!isOpen) {
        // Move focus to the name field when opening for quicker input
        const nameInput = document.getElementById('name');
        nameInput && nameInput.focus();
      } else {
        // Return focus to the toggle when closing
        showHideBtn.focus();
      }
    });
  }

  // ===== Add Comment Form =====
  const form = document.querySelector('.comment-form');
  const nameField = document.querySelector('#name');
  const commentField = document.querySelector('#comment');
  const list = document.querySelector('.comment-container');

  if (form && nameField && commentField && list) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameValue = nameField.value.trim();
      const commentValue = commentField.value.trim();
      if (!nameValue || !commentValue) return;

      const li = document.createElement('li');
      const nameP = document.createElement('p');
      const commentP = document.createElement('p');

      nameP.textContent = nameValue;
      commentP.textContent = commentValue;

      li.append(nameP, commentP);
      list.appendChild(li);

      form.reset();
      nameField.focus();
    });
  }
});