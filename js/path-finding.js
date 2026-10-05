import { MATRIX_ROWS, MATRIX_COLS } from "./config.js";

import { board } from "./board.js";

export function checkLine(r1, c1, r2, c2) {
  if (r1 !== r2 && c1 !== c2) {
    return false;
  }

  if (r1 === r2) {
    const minCol = Math.min(c1, c2);
    const maxCol = Math.max(c1, c2);

    for (let c = minCol + 1; c < maxCol; c++) {
      if (board[r1][c] !== 0) {
        return false;
      }
    }
  }

  if (c1 === c2) {
    const minRow = Math.min(r1, r2);
    const maxRow = Math.max(r1, r2);

    for (let r = minRow + 1; r < maxRow; r++) {
      if (board[r][c1] !== 0) {
        return false;
      }
    }
  }

  return true;
}

export function checkLineL(r1, c1, r2, c2) {
  if (board[r1][c2] === 0) {
    if (checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
      return {
        isPath: true,
        corners: [{ r: r1, c: c2 }],
      };
    }
  }

  if (board[r2][c1] === 0) {
    if (checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
      return {
        isPath: true,
        corners: [{ r: r2, c: c1 }],
      };
    }
  }

  return null;
}

function checkLineZ(r1, c1, r2, c2) {
  // Tìm đường đi ngang
  for (let c = 0; c < MATRIX_COLS; c++) {
    if (board[r1][c] !== 0 && c !== c1) {
      continue;
    }

    if (board[r2][c] !== 0 && c !== c2) {
      continue;
    }

    if (
      checkLine(r1, c1, r1, c) &&
      checkLine(r1, c, r2, c) &&
      checkLine(r2, c, r2, c2)
    ) {
      return {
        isPath: true,
        corners: [
          { r: r1, c },
          { r: r2, c },
        ],
      };
    }
  }

  // Tìm đường đi dọc
  for (let r = 0; r < MATRIX_ROWS; r++) {
    if (board[r][c1] !== 0 && r !== r1) {
      continue;
    }

    if (board[r][c2] !== 0 && r !== r2) {
      continue;
    }

    if (
      checkLine(r1, c1, r, c1) &&
      checkLine(r, c1, r, c2) &&
      checkLine(r, c2, r2, c2)
    ) {
      return {
        isPath: true,
        corners: [
          { r, c: c1 },
          { r, c: c2 },
        ],
      };
    }
  }

  return null;
}

export function checkCell(r1, c1, r2, c2) {
  if (r1 === r2 && c1 === c2) {
    return null;
  }

  if (checkLine(r1, c1, r2, c2)) {
    return {
      isPath: true,
      start: { r: r1, c: c1 },
      corners: [],
      end: { r: r2, c: c2 },
    };
  }

  const lineL = checkLineL(r1, c1, r2, c2);

  if (lineL) {
    return {
      isPath: true,
      start: { r: r1, c: c1 },
      corners: lineL.corners,
      end: { r: r2, c: c2 },
    };
  }

  const lineZ = checkLineZ(r1, c1, r2, c2);

  if (lineZ) {
    return {
      isPath: true,
      start: { r: r1, c: c1 },
      corners: lineZ.corners,
      end: { r: r2, c: c2 },
    };
  }

  return null;
}
