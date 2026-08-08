/**
 * table.js — Generación y visualización de la Tabula Recta 26x26
 */
(function(window) {
  let highlightedCells = [];

  function getAlphabet() {
    return (window.VigenereCipher && window.VigenereCipher.ALPHABET) || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  /**
   * Genera la tabla de 26x26 en el DOM.
   */
  function buildTable() {
    const table = document.getElementById('vigenereTable');
    if (!table) return;
    table.innerHTML = '';
    const ALPHABET = getAlphabet();

    // Encabezado de columnas (thead)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const emptyTh = document.createElement('th');
    emptyTh.textContent = ' ';
    headerRow.appendChild(emptyTh);

    for (let i = 0; i < ALPHABET.length; i++) {
      const th = document.createElement('th');
      th.textContent = ALPHABET[i];
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Filas (tbody)
    const tbody = document.createElement('tbody');
    for (let row = 0; row < 26; row++) {
      const tr = document.createElement('tr');
      const rowHeader = document.createElement('th');
      rowHeader.textContent = ALPHABET[row];
      tr.appendChild(rowHeader);

      for (let col = 0; col < 26; col++) {
        const td = document.createElement('td');
        td.id = `cell-${row}-${col}`;
        td.textContent = ALPHABET[(row + col) % 26];
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
  }

  /**
   * Resalta la fila, columna e intersección activas.
   */
  function highlightStep(keyChar, inputChar, resultChar) {
    clearHighlights();
    const ALPHABET = getAlphabet();
    const rowIndex = ALPHABET.indexOf(keyChar);
    const colIndex = ALPHABET.indexOf(inputChar);

    if (rowIndex === -1 || colIndex === -1) return;

    for (let col = 0; col < 26; col++) {
      const cell = document.getElementById(`cell-${rowIndex}-${col}`);
      if (cell) {
        cell.classList.add('row-key');
        highlightedCells.push(cell);
      }
    }

    for (let row = 0; row < 26; row++) {
      const cell = document.getElementById(`cell-${row}-${colIndex}`);
      if (cell) {
        cell.classList.add('col-plain');
        highlightedCells.push(cell);
      }
    }

    const intersectionCell = document.getElementById(`cell-${rowIndex}-${colIndex}`);
    if (intersectionCell) {
      intersectionCell.classList.add('highlight');
      highlightedCells.push(intersectionCell);
      try {
        intersectionCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      } catch (e) {}
    }
  }

  /**
   * Limpia los resaltados de la tabla.
   */
  function clearHighlights() {
    if (highlightedCells.length > 0) {
      for (let i = 0; i < highlightedCells.length; i++) {
        highlightedCells[i].classList.remove('highlight', 'row-key', 'col-plain');
      }
      highlightedCells = [];
    } else {
      const active = document.querySelectorAll('#vigenereTable .highlight, #vigenereTable .row-key, #vigenereTable .col-plain');
      active.forEach(cell => cell.classList.remove('highlight', 'row-key', 'col-plain'));
    }
  }

  window.VigenereTable = {
    buildTable,
    highlightStep,
    clearHighlights
  };
})(window);
