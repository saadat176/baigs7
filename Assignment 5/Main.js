/*
Author: Saadat Baig
Date: August 7, 2025
main.js
Commit 7: Final MDN bear example functionality + accessibility (keyboard shortcut + Back to Top)
*/

window.addEventListener('DOMContentLoaded', () => {

  // ===== Accessibility: Focus first image with Alt+1 =====
  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === '1') {
      const firstImg = document.querySelector('img');
      if (firstImg) firstImg.focus();
    }
  });

  // ===== Back to Top button =====
  const topButton = document.getElementById('backToTop');
  if (topButton) {
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== Show/Hide Comments =====
  const showHideBtn = document.querySelector('.show-hide');
  const commentWrapper = document.querySelector('.comment-wrapper');

  if (showHideBtn && commentWrapper) {
    commentWrapper.style.display = 'none';
    showHideBtn.addEventListener('click', () => {
      const isHidden = commentWrapper.style.display === 'none';
      commentWrapper.style.display = isHidden ? 'block' : 'none';
      showHideBtn.textContent = isHidden ? 'Hide comments' : 'Show comments';
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

      if (nameValue && commentValue) {
        const listItem = document.createElement('li');

        const namePara = document.createElement('p');
        namePara.textContent = nameValue;

        const commentPara = document.createElement('p');
        commentPara.textContent = commentValue;

        listItem.appendChild(namePara);
        listItem.appendChild(commentPara);
        list.appendChild(listItem);

        nameField.value = '';
        commentField.value = '';
      }
    });
  }

});