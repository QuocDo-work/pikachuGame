import { board } from "./board.js";
import { BOARD_COLS, BOARD_ROWS } from "./config.js";

export function shuffleBoard() {
  const tmp = [];

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] !== 0) {
        tmp.push(board[r][c]);
      }
    }
  }

  for (let i = tmp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = tmp[i];
    tmp[i] = tmp[j];
    tmp[j] = temp;
  }

  let index = 0;
  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] !== 0) {
        board[r][c] = tmp[index];
        index++;
      }
    }
  }
}
