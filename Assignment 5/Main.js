/*
Author: Saadat Baig
Date: August 7, 2025
main.js
Commit 5:  Added keyboard shortcut to focus image and "Back to Top" accessibility feature
*/

window.addEventListener('DOMContentLoaded', () => {
  // Focus first image with keyboard shortcut: Alt+1
  document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key === '1') {
      const firstImg = document.querySelector('img');
      if (firstImg) firstImg.focus();
    }
  });

  // Scroll to top when "Back to Top" button is clicked
  const topButton = document.getElementById('backToTop');
  if (topButton) {
    topButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});