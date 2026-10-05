import {
  BOARD_ROWS,
  BOARD_COLS,
  MATRIX_ROWS,
  MATRIX_COLS,
  CELL_BACKGROUND,
} from "./config.js";
import { LEVELS } from "./level-config.js";

export let board = [];
export let boardColors = [];
export let obstacles = [];

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

function createPairs(totalCells) {
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

export function initializeBoard(level = 1) {
  board = createEmptyMatrix();
  boardColors = createColorMatrix();

  obstacles = LEVELS[level]?.obstacles || [];

  const ableCells = BOARD_COLS * BOARD_ROWS - obstacles.length;

  const shuffledPairs = createPairs(ableCells);

  let index = 0;

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (isObstacle(r, c)) {
        board[r][c] = -1;
        continue;
      }

      board[r][c] = shuffledPairs[index++];
      boardColors[r][c] = getRandomColorBackground();
    }
  }
}

// kiểm tra kết thúc
export function isBoardClear() {
  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0) {
        return false;
      }
    }
  }

  return true;
}
export function isObstacle(r, c) {
  return obstacles.some(([row, col]) => row === r && col === c);
}
