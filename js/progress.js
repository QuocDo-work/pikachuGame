import { board } from "./board.js";
import { BOARD_COLS, BOARD_ROWS } from "./config.js";

export function updateProgress() {
  let remaining = 0;
  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] != 0) {
        remaining++;
      }
    }
  }
  const total = BOARD_COLS * BOARD_ROWS;
  const complete = total - remaining;
  const percent = (complete / total) * 100;

  document.getElementById("progress").value = percent;
  document.getElementById("progressText").textContent = `${complete}/${total}ô`;
}
