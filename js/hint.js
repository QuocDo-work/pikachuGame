import { board } from "./board.js";
import { BOARD_COLS, BOARD_ROWS } from "./config.js";
import { checkCell } from "./path-finding.js";

export function findHint() {
  for (let r1 = 1; r1 < BOARD_ROWS; r1++) {
    for (let c1 = 1; c1 < BOARD_COLS; c1++) {
      if (board[r1][c1] == 0) {
        continue;
      }

      for (let r2 = r1; r2 <= BOARD_ROWS; r2++) {
        for (let c2 = 1; c2 <= BOARD_COLS; c2++) {
          if (r1 === r2 && c1 == c2) {
            continue;
          }

          if (board[r2][c2] === 0) {
            continue;
          }

          if (board[r1][c1] !== board[r2][c2]) {
            continue;
          }

          const path = checkCell(r1, c1, r2, c2);

          if (path) {
            return {
              first: { r: r1, c: c1 },
              second: { r: r2, c: c2 },
            };
          }
        }
      }
    }
  }
  return null;
}
