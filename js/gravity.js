import { board } from "./board.js";
import { BOARD_COLS, BOARD_ROWS } from "./config.js";
import { currentLevel } from "./game.js";

let count = 0;
export let waveGravity = 0;

export function resetGravity() {
  count = 0;
  waveGravity = 0;
}

function downGravity() {
  for (let c = 1; c <= BOARD_COLS; c++) {
    const activeCell = [];
    for (let r = 1; r <= BOARD_ROWS; r++) {
      if (board[r][c] !== 0) {
        activeCell.push(board[r][c]);
      }
    }

    const emplySlots = BOARD_ROWS - activeCell.length;

    for (let r = 1; r <= emplySlots; r++) {
      board[r][c] = 0;
    }

    for (let r = emplySlots + 1; r <= BOARD_ROWS; r++) {
      board[r][c] = activeCell[r - emplySlots - 1];
    }
  }
}

function upGravity() {
  for (let c = 1; c <= BOARD_COLS; c++) {
    const activeCell = [];
    for (let r = 1; r <= BOARD_ROWS; r++) {
      if (board[r][c] !== 0) {
        activeCell.push(board[r][c]);
      }
    }
    for (let r = 1; r <= BOARD_ROWS; r++) {
      if (r <= activeCell.length) {
        board[r][c] = activeCell[r - 1];
      } else {
        board[r][c] = 0;
      }
    }
  }
}
function rightGravity() {
  for (let r = 1; r <= BOARD_ROWS; r++) {
    const activeCell = [];
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] !== 0) {
        activeCell.push(board[r][c]);
      }
    }
    const emplySlots = BOARD_COLS - activeCell.length;

    for (let c = 1; c <= emplySlots; c++) {
      board[r][c] = 0;
    }
    for (let c = emplySlots + 1; c <= BOARD_COLS; c++) {
      board[r][c] = activeCell[c - emplySlots - 1];
    }
  }
}
export function leftGravity() {
  for (let r = 1; r <= BOARD_ROWS; r++) {
    const activeCell = [];
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] !== 0) {
        activeCell.push(board[r][c]);
      }
    }
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (c <= activeCell.length) {
        board[r][c] = activeCell[c - 1];
      } else {
        board[r][c] = 0;
      }
    }
  }
}

export function applyGravity() {
  if (waveGravity === 0) {
    downGravity();
  } else if (waveGravity === 1) {
    leftGravity();
  } else if (waveGravity === 2) {
    upGravity();
  } else {
    rightGravity();
  }
  count++;
  if (count >= 3) {
    count = 0;
    waveGravity = (waveGravity + 1) % 4;
  }
}

export function isGravity() {
  return currentLevel === 4;
}
