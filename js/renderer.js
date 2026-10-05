import { BOARD_ROWS, BOARD_COLS, fruit } from "./config.js";
import { board, boardColors } from "./board.js";

export function renderBoard() {
  const boardElement = document.getElementById("board");

  boardElement.innerHTML = "";

  boardElement.style.setProperty("--board-cols", BOARD_COLS);
  boardElement.style.setProperty("--board-row", BOARD_ROWS);

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      const cellValue = board[r][c];

      const cellElement = document.createElement("div");

      cellElement.className = "cell";

      cellElement.dataset.row = r;
      cellElement.dataset.col = c;

      if (cellValue === 0) {
        cellElement.classList.add("empty");
      } else {
        cellElement.style.backgroundColor = boardColors[r][c];

        const imgElement = document.createElement("img");

        imgElement.src = fruit[cellValue];
        imgElement.alt = `Fruit ${cellValue}`;
        imgElement.className = "fruit-image";

        cellElement.appendChild(imgElement);
      }

      boardElement.appendChild(cellElement);
    }
  }
}