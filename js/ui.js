/**
 * ui.js — Manejo de interfaz, eventos y animaciones
 */
(function(window) {
  let currentMode = 'encrypt';
  let isAnimating = false;
  let successTimer = null;

  let elPassword, elKeyword, elBtnAction, elResultado, elResultLabel;
  let elModeEncrypt, elModeDecrypt;

  function initUI() {
    elPassword    = document.getElementById('password');
    elKeyword     = document.getElementById('keyword');
    elBtnAction   = document.getElementById('btnAction');
    elResultado   = document.getElementById('resultado');
    elResultLabel = document.getElementById('resultLabel');
    elModeEncrypt = document.getElementById('modeEncrypt');
    elModeDecrypt = document.getElementById('modeDecrypt');

    if (!elPassword || !elKeyword || !elBtnAction) return;

    // --- Navegación con tecla Enter ---
    elPassword.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        elKeyword.focus();
        if (window.VigenereSound) window.VigenereSound.playSwitchFieldSound();
        try {
          elKeyword.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) {}
      }
    });

    elKeyword.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeCipher();
      }
    });

    // --- Cambio manual de foco entre campos ---
    let lastFocused = elPassword;
    [elPassword, elKeyword].forEach(function(input) {
      input.addEventListener('focus', function() {
        if (lastFocused !== input) {
          if (window.VigenereSound) window.VigenereSound.playSwitchFieldSound();
          lastFocused = input;
        }
      });
    });

    // --- Botón principal ---
    elBtnAction.addEventListener('click', function() {
      executeCipher();
    });

    // --- Toggle Cifrar / Descifrar ---
    if (elModeEncrypt) elModeEncrypt.addEventListener('click', function() { setMode('encrypt'); });
    if (elModeDecrypt) elModeDecrypt.addEventListener('click', function() { setMode('decrypt'); });

    // --- Botón Copiar ---
    const copyBtn = document.getElementById('btnCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', copyResult);
    }

    // --- Efecto de sonido al teclear ---
    [elPassword, elKeyword].forEach(function(input) {
      if (!input) return;
      input.addEventListener('input', function() {
        if (window.VigenereSound) window.VigenereSound.playKeySound();
        input.classList.remove('error');
      });
    });

    setTimeout(function() {
      if (elPassword) elPassword.focus();
    }, 200);
  }

  function setMode(mode) {
    currentMode = mode;

    if (elModeEncrypt) elModeEncrypt.classList.toggle('active', mode === 'encrypt');
    if (elModeDecrypt) elModeDecrypt.classList.toggle('active', mode === 'decrypt');

    const passwordLabel = document.getElementById('passwordLabel');

    if (mode === 'encrypt') {
      if (passwordLabel) passwordLabel.textContent = 'Texto a cifrar';
      if (elBtnAction) elBtnAction.textContent = '⟐ Cifrar';
      if (elPassword) elPassword.placeholder = 'Ej: MiClaveSecreta';
      if (elResultLabel) elResultLabel.textContent = 'Resultado cifrado';
    } else {
      if (passwordLabel) passwordLabel.textContent = 'Texto a descifrar';
      if (elBtnAction) elBtnAction.textContent = '⟐ Descifrar';
      if (elPassword) elPassword.placeholder = 'Ej: RIJVSUYVJN';
      if (elResultLabel) elResultLabel.textContent = 'Resultado descifrado';
    }

    if (elResultado) {
      elResultado.textContent = '—';
      elResultado.classList.add('empty');
      elResultado.classList.remove('success-glow');
    }

    if (successTimer) clearTimeout(successTimer);
    if (window.VigenereTable) window.VigenereTable.clearHighlights();
  }

  async function executeCipher() {
    if (isAnimating) return;

    const text = elPassword ? elPassword.value.trim() : '';
    const key  = elKeyword ? elKeyword.value.trim() : '';

    let hasError = false;
    if (!text) {
      if (elPassword) {
        elPassword.classList.add('error');
        shakeElement(elPassword);
      }
      hasError = true;
    }
    if (!key) {
      if (elKeyword) {
        elKeyword.classList.add('error');
        shakeElement(elKeyword);
      }
      hasError = true;
    } else if (!/[a-zA-Z]/.test(key)) {
      if (elKeyword) {
        elKeyword.classList.add('error');
        shakeElement(elKeyword);
      }
      hasError = true;
    }

    if (hasError) return;

    isAnimating = true;
    if (elBtnAction) elBtnAction.disabled = true;

    const isDecrypt = currentMode === 'decrypt';
    const cipherModule = window.VigenereCipher;
    const result = isDecrypt ? cipherModule.decrypt(text, key) : cipherModule.encrypt(text, key);
    const steps  = cipherModule.getEncryptionSteps(text, key, isDecrypt);

    if (elResultado) {
      elResultado.textContent = '';
      elResultado.classList.remove('empty');
      elResultado.classList.remove('success-glow');
    }

    if (successTimer) clearTimeout(successTimer);
    if (window.VigenereTable) window.VigenereTable.clearHighlights();

    try {
      await animateWithTyping(result, steps, text);
    } catch (err) {
      if (elResultado) {
        elResultado.textContent = result;
        triggerSuccessState();
      }
    }

    isAnimating = false;
    if (elBtnAction) elBtnAction.disabled = false;
  }

  function triggerSuccessState() {
    if (!elResultado) return;
    if (successTimer) clearTimeout(successTimer);

    elResultado.classList.add('success-glow');
    if (window.VigenereSound) {
      window.VigenereSound.playSuccessSound();
    }

    // El resplandor Verde Neón dura exactamente 2 segundos
    successTimer = setTimeout(function() {
      if (elResultado) {
        elResultado.classList.remove('success-glow');
      }
    }, 2000);
  }

  async function animateWithTyping(result, steps, originalText) {
    let stepIndex = 0;
    const delay = Math.max(80, Math.min(300, 2500 / (result.length || 1)));

    for (let i = 0; i < result.length; i++) {
      const ch = originalText[i];

      if (/[a-zA-Z]/.test(ch) && stepIndex < steps.length) {
        const step = steps[stepIndex];
        if (window.VigenereTable) {
          window.VigenereTable.highlightStep(step.keyChar, step.inputChar, step.resultChar);
        }
        stepIndex++;
        await wait(delay);
      } else {
        await wait(delay / 2);
      }

      const span = document.createElement('span');
      span.textContent = result[i];
      span.style.animation = 'fadeInUp 0.2s ease forwards';
      if (elResultado) elResultado.appendChild(span);
      if (window.VigenereSound) window.VigenereSound.playKeySound();
    }

    // Al terminar, dispara el resplandor Verde Neón durante exactamente 2 segundos
    triggerSuccessState();

    await wait(600);
    if (window.VigenereTable) window.VigenereTable.clearHighlights();
  }

  async function copyResult() {
    if (!elResultado) return;
    const text = elResultado.textContent;
    if (!text || text === '—') return;

    const copyBtn = document.getElementById('btnCopy');
    if (!copyBtn || copyBtn.disabled) return;

    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (err) {}

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        success = true;
      } catch (e) {}
    }

    if (success) {
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '✓ Copiado';
      copyBtn.disabled = true;

      setTimeout(function() {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '❐ Copiar';
        copyBtn.disabled = false;
      }, 2000);
    }
  }

  function shakeElement(el) {
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
    setTimeout(function() { el.style.animation = ''; }, 400);
  }

  function wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }

  window.VigenereUI = {
    initUI,
    executeCipher
  };
})(window);
