/**
 * sound.js — Gestión de efectos de sonido
 * 
 * Incluye hooks configurables para:
 * - Sonido de tecleo (playKeySound)
 * - Sonido de cambio de campo (playSwitchFieldSound)
 * - Sonido de cifrado completado (playSuccessSound)
 */
(function(window) {
  const POOL_SIZE = 5;
  let audioPool = [];
  let poolIndex = 0;
  let soundEnabled = true;

  // Instancias de audio configurables para eventos
  let switchFieldAudio = null;
  let successAudio = null;

  function initSound() {
    audioPool = [];
    try {
      for (let i = 0; i < POOL_SIZE; i++) {
        const audio = new Audio('sounds/SoundText.wav');
        audio.volume = 0.25;
        audioPool.push(audio);
      }

      // Audio para cambio de campo (se intentará cargar si existe o usará el principal)
      switchFieldAudio = new Audio('sounds/WaterDrop.wav');
      switchFieldAudio.volume = 0.3;

      // Audio para éxito de cifrado
      successAudio = new Audio('sounds/end.wav');
      successAudio.volume = 0.4;
    } catch (e) {
      console.warn('Audio no disponible:', e);
    }
  }

  function playKeySound() {
    if (!soundEnabled || audioPool.length === 0) return;
    try {
      const audio = audioPool[poolIndex % POOL_SIZE];
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(function() {});
      }
      poolIndex++;
    } catch (e) {}
  }

  /**
   * Reproduce el sonido al cambiar de campo (contraseña <-> clave).
   */
  function playSwitchFieldSound() {
    if (!soundEnabled) return;
    try {
      if (switchFieldAudio) {
        switchFieldAudio.currentTime = 0;
        const p = switchFieldAudio.play();
        if (p !== undefined) p.catch(function() {});
      } else {
        playKeySound();
      }
    } catch (e) {}
  }

  /**
   * Reproduce el sonido de éxito al finalizar el cifrado/descifrado.
   */
  function playSuccessSound() {
    if (!soundEnabled) return;
    try {
      if (successAudio) {
        successAudio.currentTime = 0;
        const p = successAudio.play();
        if (p !== undefined) p.catch(function() {});
      } else {
        playKeySound();
      }
    } catch (e) {}
  }

  window.VigenereSound = {
    initSound,
    playKeySound,
    playSwitchFieldSound,
    playSuccessSound
  };
})(window);
