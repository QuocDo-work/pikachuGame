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

  const board = document.getElementById("board");

  if (board) {
    board.classList.remove("night-mode");
  }
}

export function isNightMode() {
  return nightMode;
}

export function revealAround(row, col) {
  if (!nightMode) return;

  const cells = document.querySelectorAll("#board .cell");

  cells.forEach((cells) => {
    const r = Number(cells.dataset.row);
    const c = Number(cells.dataset.col);

    const distance = Math.abs(r - row) + Math.abs(c - col);

    if (distance <= 2) {
      cells.classList.add("night-reveal");
    }
  });
}

export function clearReveal() {
  const cells = document.querySelectorAll("#board .cell.night-reveal");

  cells.forEach((cells) => {
    cells.classList.remove("night-reveal");
  });
}
