/**
 * main.js — Punto de entrada principal
 */
(function(window) {
  function generateStars(count) {
    const container = document.getElementById('starsContainer');
    if (!container) return;
    count = count || 20;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top  = (Math.random() * 100) + '%';
      star.style.left = (Math.random() * 100) + '%';
      
      const size = 1 + Math.random() * 2;
      star.style.width  = size + 'px';
      star.style.height = size + 'px';
      star.style.setProperty('--star-speed', (2 + Math.random() * 3) + 's');
      star.style.animationDelay = (Math.random() * 3) + 's';

      container.appendChild(star);
    }
  }

  function initApp() {
    generateStars(20);

    if (window.VigenereTable) {
      window.VigenereTable.buildTable();
    }

    if (window.VigenereSound) {
      window.VigenereSound.initSound();
    }

    if (window.VigenereUI) {
      window.VigenereUI.initUI();
    }

    document.body.classList.add('loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})(window);
