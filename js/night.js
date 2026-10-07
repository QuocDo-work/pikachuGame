let nightMode = false;

export function enableNightMode() {
  nightMode = true;

  const board = document.getElementById("board");

  if (board) {
    board.classList.add("night-mode");
  }
}

export function disableNightMode() {
  nightMode = false;
  clearReveal();

  const board = document.getElementById("board");

  if (board) {
    board.classList.remove("night-mode", "bright");
  }
}

export function isNightMode() {
  return nightMode;
}

export function revealAround(row, col) {
  if (!nightMode) return;

  const cells = document.querySelectorAll("#board .cell");

  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    const distance = Math.abs(r - row) + Math.abs(c - col);

    if (distance <= 2) {
      cell.classList.add("night-reveal");
    }
  });
}

export function clearReveal() {
  const cells = document.querySelectorAll("#board .cell.night-reveal");

  cells.forEach((cell) => {
    cell.classList.remove("night-reveal");
  });
}

export function flashBoard() {
  if (!isNightMode()) return;

  const board = document.getElementById("board");
  board.classList.add("bright");

  setTimeout(() => {
    board.classList.remove("bright");
  }, 1500);
}
