import { board, isBoardClear } from "./board.js";
import { checkCell } from "./path-finding.js";
import { renderBoard } from "./renderer.js";
import { drawConnection } from "./path-render.js";
import { addScore } from "./current-score.js";
import { startTime } from "./timers.js";
import { findHint, revealHint } from "./hint.js";
import { updateProgress } from "./progress.js";
import { shuffleBoard } from "./shuffle.js";
import { showOver, showWin } from "./show-result.js";
import { clearReveal, flashBoard, isNightMode, revealAround } from "./night.js";
import { applyGravity, isGravity } from "./gravity.js";

let firstSelectedCell = null;

function selectCell(row, col, cellValue, cellElement) {
  clearReveal();
  firstSelectedCell = {
    row,
    col,
    cellValue,
    cellElement,
  };

  cellElement.classList.add("selected");

  if (isNightMode()) {
    revealAround(row, col);
  }
}

function deselectCell() {
  if (!firstSelectedCell) {
    return;
  }

  firstSelectedCell.cellElement.classList.remove("selected");

  firstSelectedCell = null;
}

function handleCellClick(row, col, cellValue, cellElement) {
  if (!firstSelectedCell) {
    selectCell(row, col, cellValue, cellElement);
    return;
  }

  if (firstSelectedCell.row === row && firstSelectedCell.col === col) {
    deselectCell();
    return;
  }

  if (firstSelectedCell.cellValue !== cellValue) {
    deselectCell();

    selectCell(row, col, cellValue, cellElement);

    return;
  }

  const path = checkCell(
    firstSelectedCell.row,
    firstSelectedCell.col,
    row,
    col,
  );

  if (path) {
    drawConnection(path);

    board[firstSelectedCell.row][firstSelectedCell.col] = 0;
    board[row][col] = 0;

    if (isGravity()) {
      applyGravity();
    }

    deselectCell();
    addScore();
    startTime();
    updateProgress();

    setTimeout(() => {
      renderBoard();

      if (isNightMode()) {
        clearReveal();
        flashBoard();
      }

      if (isBoardClear()) {
        showWin();
      }
    }, 250);
  } else {
    console.log("connect fail");

    deselectCell();

    selectCell(row, col, cellValue, cellElement);
  }
}

export function setupBoardEvent() {
  const boardElement = document.getElementById("board");

  boardElement.addEventListener("click", (event) => {
    const cellElement = event.target.closest(".cell");

    if (
      !cellElement ||
      cellElement.classList.contains("empty") ||
      cellElement.classList.contains("obstacle")
    ) {
      return;
    }

    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);

    const cellValue = board[row][col];

    handleCellClick(row, col, cellValue, cellElement);
  });
}

//btn
// hint
document.getElementById("hint").addEventListener("click", () => {
  if (isNightMode()) {
    clearReveal();
  }

  const hint = findHint();
  if (!hint) {
    alert("Không tìm thấy cặp phù hợp!");
    return;
  }
  revealHint(hint.first, hint.second);
});

document.getElementById("shuffle").addEventListener("click", () => {
  shuffleBoard();
  renderBoard();
});

// GameOver
document.addEventListener("timeUP", () => {
  showOver();
});
