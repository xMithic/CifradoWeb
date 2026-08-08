/**
 * cipher.js — Lógica de cifrado y descifrado Vigenère
 */
(function(window) {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  /**
   * Cifra el texto usando la clave de Vigenère.
   */
  function encrypt(plaintext, key) {
    key = (key || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return '';
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < plaintext.length; i++) {
      const ch = plaintext[i];
      if (/[a-zA-Z]/.test(ch)) {
        const isUpper = ch === ch.toUpperCase();
        const p = ch.toUpperCase().charCodeAt(0) - 65;
        const k = key.charCodeAt(keyIndex % key.length) - 65;
        const c = (p + k) % 26;
        result += isUpper ? String.fromCharCode(c + 65) : String.fromCharCode(c + 97);
        keyIndex++;
      } else {
        result += ch;
      }
    }
    return result;
  }

  /**
   * Descifra el texto cifrado usando la clave de Vigenère.
   */
  function decrypt(ciphertext, key) {
    key = (key || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return '';
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < ciphertext.length; i++) {
      const ch = ciphertext[i];
      if (/[a-zA-Z]/.test(ch)) {
        const isUpper = ch === ch.toUpperCase();
        const c = ch.toUpperCase().charCodeAt(0) - 65;
        const k = key.charCodeAt(keyIndex % key.length) - 65;
        const p = (c - k + 26) % 26;
        result += isUpper ? String.fromCharCode(p + 65) : String.fromCharCode(p + 97);
        keyIndex++;
      } else {
        result += ch;
      }
    }
    return result;
  }

  /**
   * Retorna los pasos paso a paso para la visualización en la tabla.
   */
  function getEncryptionSteps(plaintext, key, isDecrypt) {
    key = (key || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) return [];
    const steps = [];
    let keyIndex = 0;
    for (let i = 0; i < plaintext.length; i++) {
      const ch = plaintext[i];
      if (/[a-zA-Z]/.test(ch)) {
        const p = ch.toUpperCase().charCodeAt(0) - 65;
        const k = key.charCodeAt(keyIndex % key.length) - 65;
        const r = isDecrypt ? (p - k + 26) % 26 : (p + k) % 26;
        steps.push({
          keyChar: ALPHABET[k],
          inputChar: ch.toUpperCase(),
          resultChar: ALPHABET[r],
          index: i
        });
        keyIndex++;
      }
    }
    return steps;
  }

  window.VigenereCipher = {
    ALPHABET,
    encrypt,
    decrypt,
    getEncryptionSteps
  };
})(window);
