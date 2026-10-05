import {
  BOARD_ROWS,
  BOARD_COLS,
  MATRIX_ROWS,
  MATRIX_COLS,
  CELL_BACKGROUND,
} from "./config.js";

export let board = [];
export let boardColors = [];

export function createEmptyMatrix() {
  const matrix = [];

  for (let i = 0; i < MATRIX_ROWS; i++) {
    matrix.push(new Array(MATRIX_COLS).fill(0));
  }

  return matrix;
}

export function createColorMatrix() {
  const matrix = [];

  for (let r = 0; r < MATRIX_ROWS; r++) {
    matrix.push(new Array(MATRIX_COLS).fill(null));
  }

  return matrix;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function createPairs() {
  const totalCells = BOARD_ROWS * BOARD_COLS;
  const totalPairs = totalCells / 2;

  const pairs = [];

  for (let i = 1; i <= totalPairs; i++) {
    const fruitId = ((i - 1) % 10) + 1;

    pairs.push(fruitId, fruitId);
  }

  return shuffleArray(pairs);
}

function getRandomColorBackground() {
  const index = Math.floor(Math.random() * CELL_BACKGROUND.length);

  return CELL_BACKGROUND[index];
}

export function initializeBoard() {
  board = createEmptyMatrix();
  boardColors = createColorMatrix();

  const shuffledPairs = createPairs();

  let index = 0;

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      board[r][c] = shuffledPairs[index++];
      boardColors[r][c] = getRandomColorBackground();
    }
  }
}

// kiểm tra kết thúc
export function isBoardClear() {
  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] !== 0) {
        return false;
      }
    }
  }

  return true;
}
