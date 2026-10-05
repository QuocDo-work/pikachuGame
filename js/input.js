import { board, isBoardClear } from "./board.js";
import { checkCell } from "./path-finding.js";
import { renderBoard } from "./renderer.js";
import { drawConnection } from "./path-render.js";
import { addScore } from "./current-score.js";
import { startTime } from "./timers.js";
import { findHint } from "./hint.js";
import { updateProgress } from "./progress.js";
import { shuffleBoard } from "./shuffle.js";

let firstSelectedCell = null;

function selectCell(row, col, cellValue, cellElement) {
  firstSelectedCell = {
    row,
    col,
    cellValue,
    cellElement,
  };

  cellElement.classList.add("selected");
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

    deselectCell();
    addScore();
    startTime();
    updateProgress();

    setTimeout(() => {
      renderBoard();

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

    if (!cellElement || cellElement.classList.contains("empty")) {
      return;
    }

    const row = parseInt(cellElement.dataset.row);
    const col = parseInt(cellElement.dataset.col);

    const cellValue = board[row][col];

    handleCellClick(row, col, cellValue, cellElement);
  });
}
// màn hình kết thúc (cần update giao diện)
function showWin() {
  const message = document.createElement("div");

  message.className = "win-message";
  message.textContent = "YOU WIN!";

  document.body.appendChild(message);
}

// hint
function handleHint() {
  const hint = findHint();
  if (!hint) {
    alert("khong ton tai hint");
    return;
  }

  const firstCell = document.querySelector(
    `.cell[data-row= "${hint.first.r}"][data-col="${hint.first.c}"]`,
  );

  const secondCell = document.querySelector(
    `.cell[data-row= "${hint.second.r}"][data-col="${hint.second.c}"]`,
  );

  firstCell.classList.add("hint");
  secondCell.classList.add("hint");

  setTimeout(() => {
    firstCell.classList.remove("hint");
    secondCell.classList.remove("hint");
  }, 1500);
}
//btn
document.getElementById("hint").addEventListener("click", handleHint);
document.getElementById("shuffle").addEventListener("click", () => {
  shuffleBoard();
  renderBoard();
});
