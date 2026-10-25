const BOARD_ROWS = 8;
const BOARD_COLS = 16;

const MATRIX_ROWS = BOARD_ROWS + 2;
const MATRIX_COLS = BOARD_COLS + 2;

const fruit = {
  1: "./assets/0.png",
  2: "./assets/1.png",
  3: "./assets/2.png",
  4: "./assets/3.png",
  5: "./assets/4.png",
  6: "./assets/5.png",
  7: "./assets/6.png",
  8: "./assets/7.png",
  9: "./assets/8.png",
  10: "./assets/9.png",
  11: "./assets/10.png",
  12: "./assets/11.png",
  13: "./assets/12.png",
  14: "./assets/13.png",
  15: "./assets/14.png",
  16: "./assets/15.png",
  17: "./assets/16.png",
  18: "./assets/17.png",
  19: "./assets/18.png",
  20: "./assets/19.png",
  21: "./assets/20.png",
  22: "./assets/21.png",
  23: "./assets/22.png",
  24: "./assets/23.png",
  25: "./assets/24.png",
  26: "./assets/25.png",
  27: "./assets/26.png",
  28: "./assets/27.png",
  29: "./assets/28.png",
  30: "./assets/29.png",
  31: "./assets/30.png",
  32: "./assets/31.png",
  33: "./assets/32.png",
  34: "./assets/33.png",
  35: "./assets/34.png",
  36: "./assets/35.png",
};

const LEVELS = {
  1: {
    name: "Classic",
    obstacles: [],
  },

  2: {
    name: "Obstacle",

    obstacles: [
      // Hàng 2
      [2, 5],
      [2, 6],
      [2, 11],
      [2, 12],

      // Hàng 3
      [3, 5],
      [3, 6],
      [3, 11],
      [3, 12],

      // Hàng 4
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 11],
      [4, 12],
      [4, 13],
      [4, 14],

      // Hàng 5
      [5, 2],
      [5, 15],

      // Hàng 6
      [6, 2],
      [6, 6],
      [6, 7],
      [6, 10],
      [6, 11],
      [6, 15],

      // Hàng 7
      [7, 6],
      [7, 7],
      [7, 8],
      [7, 9],

      [7, 10],
      [7, 11],
    ],
  },

  3: {
    name: "Night",
    obstacles: [],
  },
  4: {
    name: "Gravity",
    obstacles: [],
  },
  5: {
    name: "Paradox",
    obstacles: [],
  },

  6: {
    name: "Frozen",
    obstacles: [],
  },
  7: {
    name: "Boss",
    obstacles: [],
  },
};

//Boards
let board = [];
let obstacles = [];

function createEmptyMatrix() {
  const matrix = [];

  for (let i = 0; i < MATRIX_ROWS; i++) {
    matrix.push(new Array(MATRIX_COLS).fill(0));
  }

  return matrix;
}

function createColorMatrix() {
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

  const totalFruits = Object.keys(fruit).length;

  const pairs = [];

  for (let i = 1; i <= totalPairs; i++) {
    const fruitId = ((i - 1) % totalFruits) + 1;

    pairs.push(fruitId, fruitId);
  }

  return shuffleArray(pairs);
}

//Khởi tạo bàn cờ
function initializeBoard(level = 1) {
  board = createEmptyMatrix();

  obstacles = LEVELS[level]?.obstacles || [];

  bossHP = BOSS_MAX_HP;
  createBossUI();

  paradoxStep = 0;

  matchCount = 0;

  resetGravity();

  updateProgress();

  resetScore();
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
    }
  }

  applyFrozen();
}

// kiểm tra kết thúc
function isBoardClear() {
  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0) {
        return false;
      }
    }
  }

  return true;
}

function isObstacle(r, c) {
  return obstacles.some(([row, col]) => row === r && col === c);
}

//renderer

function renderBoard() {
  const boardElement = document.getElementById("board");

  boardElement.innerHTML = "";

  boardElement.style.setProperty("--board-cols", BOARD_COLS);
  boardElement.style.setProperty("--board-row", BOARD_ROWS);

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      const cellValue = board[r][c];

      const cellElement = document.createElement("div");

      cellElement.dataset.row = r;
      cellElement.dataset.col = c;

      if (cellValue === 0) {
        cellElement.classList = "cell empty";
      } else if (cellValue === -1) {
        cellElement.classList = "cell obstacle";
      } else {
        cellElement.className = "cell";

        const imgElement = document.createElement("img");

        imgElement.src = fruit[cellValue];
        imgElement.alt = `Fruit ${cellValue}`;
        imgElement.className = "fruit-image";

        cellElement.appendChild(imgElement);

        if (checkFrozen(r, c)) {
          cellElement.classList.add("frozen");
          const ice = document.createElement("img");
          ice.className = "ice-overlay";
          ice.src = "./assets/frozen.png";
          ice.alt = "Băng";
          ice.draggable = false;

          cellElement.appendChild(ice);
        }
      }

      boardElement.appendChild(cellElement);
    }
  }
}

//check-path
function checkLine(r1, c1, r2, c2) {
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
      if (board[r][c1] !== 0 || checkFrozen(r, c1)) {
        return false;
      }
    }
  }

  return true;
}

function checkLineL(r1, c1, r2, c2) {
  if (board[r1][c2] === 0 && !checkFrozen(r1, c2)) {
    if (checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
      return {
        isPath: true,
        corners: [{ r: r1, c: c2 }],
      };
    }
  }

  if (board[r2][c1] === 0 && !checkFrozen(r2, c1)) {
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
    if (
      (board[r1][c] !== 0 && c !== c1) ||
      (board[r2][c] !== 0 && c !== c2) ||
      (checkFrozen(r1, c) && c !== c1) ||
      (checkFrozen(r2, c) && c !== c2)
    ) {
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
    if (
      (board[r][c1] !== 0 && r !== r1) ||
      (board[r][c2] !== 0 && r !== r2) ||
      (checkFrozen(r, c1) && r !== r1) ||
      (checkFrozen(r, c2) && r !== r2)
    ) {
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

function checkCell(r1, c1, r2, c2) {
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

// path-render

function drawConnection(path) {
  const boardElement = document.getElementById("board");

  const oldLayer = boardElement.querySelector(".path-layer");

  if (oldLayer) {
    oldLayer.remove();
  }

  const layer = document.createElement("div");
  layer.className = "path-layer";

  boardElement.appendChild(layer);

  const points = [path.start, ...(path.corners || []), path.end];

  for (let i = 0; i < points.length - 1; i++) {
    drawLine(layer, points[i], points[i + 1]);
  }
}

// Lấy tâm ô
function getCellCenter(row, col) {
  const boardElement = document.getElementById("board");
  const boardRect = boardElement.getBoundingClientRect();

  const cell = boardElement.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`,
  );

  if (cell) {
    const cellRect = cell.getBoundingClientRect();

    return {
      x: cellRect.left - boardRect.left + cellRect.width / 2,
      y: cellRect.top - boardRect.top + cellRect.height / 2,
    };
  }

  // vị trí ô chuẩn
  const fCell = boardElement.querySelector(`.cell[data-row="1"][data-col="1"]`);

  const scColCell = boardElement.querySelector(
    `.cell[data-row="1"][data-col="2"]`,
  );

  const scRowCell = boardElement.querySelector(
    `.cell[data-row="2"][data-col="1"]`,
  );

  if (!fCell || !scColCell || !scRowCell) {
    return null;
  }

  const fRect = fCell.getBoundingClientRect();
  const scRowRect = scRowCell.getBoundingClientRect();
  const scColRect = scColCell.getBoundingClientRect();

  const fX = fRect.left - boardRect.left + fRect.width / 2;
  const fY = fRect.top - boardRect.top + fRect.height / 2;

  const colStep = scColRect.left - fRect.left;
  const rowStep = scRowRect.top - fRect.top;

  let x;

  if (col < 1) {
    x = fX + (col - 1) * colStep;
  } else if (col > BOARD_COLS) {
    x = fX + (col - 1) * colStep;
  } else {
    x = fX + (col - 1) * colStep;
  }

  let y;

  if (row < 1) {
    y = fY + (row - 1) * rowStep;
  } else if (row > BOARD_ROWS) {
    y = fY + (row - 1) * rowStep;
  } else {
    y = fY + (row - 1) * rowStep;
  }
  return { x, y };
}

function drawLine(layer, p1, p2) {
  const start = getCellCenter(p1.r, p1.c);
  const end = getCellCenter(p2.r, p2.c);

  if (!start || !end) {
    return;
  }

  const line = document.createElement("div");
  line.className = "connection-line";

  // Đường ngang
  if (p1.r === p2.r) {
    line.style.left = `${Math.min(start.x, end.x)}px`;
    line.style.top = `${start.y - 2.5}px`;
    line.style.width = `${Math.abs(end.x - start.x)}px`;
    line.style.height = "5px";
  }

  // Đường dọc
  else if (p1.c === p2.c) {
    line.style.left = `${start.x - 2.5}px`;
    line.style.top = `${Math.min(start.y, end.y)}px`;
    line.style.width = "5px";
    line.style.height = `${Math.abs(end.y - start.y)}px`;
  }

  layer.appendChild(line);
}
// xử lý nhấp vào ô
function handleCellClick(row, col, cellValue, cellElement) {
  if (checkFrozen(row, col)) {
    return;
  }
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

    if (isParadox()) {
      applyParadox(path);
    }

    if (isBoss()) {
      damageBoss();

      if (bossHP > 0) {
        bossAttack();
        bossHeal();
      }
    }

    if (isFrozen()) {
      breakIce(firstSelectedCell.row, firstSelectedCell.col, row, col);
    }

    deselectCell();
    addScore();
    updateProgress();

    setTimeout(() => {
      renderBoard();

      if (isNightMode()) {
        clearReveal();
        flashBoard();
      }

      if (isBoss()) {
        if (bossHP <= 0) {
          showWin();
        } else if (isBoardClear()) {
          showOver();
        } else {
          autoShuffle();
        }
      } else if (isBoardClear()) {
        showWin();
      } else {
        autoShuffle();
      }
    }, 250);
  } else {
    console.log("connect fail");

    deselectCell();

    selectCell(row, col, cellValue, cellElement);
  }
}

function setupBoardEvent() {
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
// ghi lại lượt sử dụng
function updateActionCount() {
  document.getElementById("shuffle-count").textContent = shuffleCount;
  document.getElementById("hint-count").textContent = hintCount;
}

//Điểm số
let shuffleCount = 0;
let hintCount = 0;
let score = 0;

function addScore() {
  score += 10;

  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

function getScore() {
  return score;
}

function resetScore() {
  score = 0;

  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

//Thời gian màn chơi
const TOTAL_TIME = 300;
let timeLeft = TOTAL_TIME;
let timeR = TOTAL_TIME;
let timeID = null;

function startTime() {
  stopTimer();

  timeLeft = TOTAL_TIME;
  timeR = TOTAL_TIME;

  updateTimeDisplay();

  timeID = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      document.dispatchEvent(new CustomEvent("timeUP"));
    }
  }, 1000);
}

function stopTimer() {
  if (timeID != null) {
    clearInterval(timeID);
    timeID = null;
  }
}

function updateTimeDisplay() {
  const timeElement = document.getElementById("timer");

  if (timeElement) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timeElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

function getTimeResult() {
  const elapsed = timeR - timeLeft;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Tiến trình chơi
function updateProgress() {
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

// gợi ý trò chơi
function findHint() {
  for (let r1 = 1; r1 <= BOARD_ROWS; r1++) {
    for (let c1 = 1; c1 <= BOARD_COLS; c1++) {
      if (board[r1][c1] <= 0 || checkFrozen(r1, c1)) {
        continue;
      }
      for (let r2 = r1; r2 <= BOARD_ROWS; r2++) {
        for (let c2 = 1; c2 <= BOARD_COLS; c2++) {
          if (r1 === r2 && c1 == c2) {
            continue;
          }

          if (board[r2][c2] <= 0 || checkFrozen(r2, c2)) {
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

function revealHint(first, second) {
  const cells = document.querySelectorAll("#board .cell");

  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    const isFirst = r === first.r && c === first.c;

    const isSecond = r === second.r && c === second.c;

    if (isFirst || isSecond) {
      cell.classList.add("hint");
      if (isNightMode()) {
        cell.classList.add("night-reveal");
      }
    }
  });
}

function clearHint() {
  const cells = document.querySelectorAll("#board .cell.hint");

  cells.forEach((cell) => {
    cell.classList.remove("hint");
  });
}

// xáo trộn ô
function shuffleBoard() {
  const positions = [];
  const tmp = [];

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0 && !checkFrozen(r, c)) {
        positions.push({ r, c });
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

  for (let i = 0; i < positions.length; i++) {
    const { r, c } = positions[i];
    board[r][c] = tmp[i];
  }

  renderBoard();
}

function autoShuffle() {
  if (findHint()) return;

  for (let i = 0; i < 500; i++) {
    shuffleBoard();

    if (findHint()) {
      renderBoard();
      console.log("Auto Shuffle thành công!");
      return;
    }
  }

  console.log("Không tìm được nước đi sau 50 lần xáo trộn.");
  createHintCell();
  renderBoard();
}

function createHintCell() {
  const fruits = [];

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0) {
        fruits.push({ r, c });
      }
    }
  }

  for (let i = 0; i < fruits.length; i++) {
    for (let j = i + 1; j < fruits.length; j++) {
      const a = fruits[i];
      const b = fruits[j];

      const oldA = board[a.r][a.c];
      const oldB = board[b.r][b.c];

      board[b.r][b.c] = oldA;

      if (checkCell(a.r, a.c, b.r, b.c)) {
        return;
      }

      board[a.r][a.c] = oldA;
      board[b.r][b.c] = oldB;
    }
  }
}

// level game

// 3-Màn đêm

let nightMode = false;

// bật tắt chế độ
function enableNightMode() {
  nightMode = true;

  const board = document.getElementById("board");

  if (board) {
    board.classList.add("night-mode");
  }
}

function disableNightMode() {
  nightMode = false;
  clearReveal();

  const board = document.getElementById("board");

  if (board) {
    board.classList.remove("night-mode", "bright");
  }
}

function isNightMode() {
  return nightMode;
}
// Tính năng màn đêm

function revealAround(row, col) {
  if (!nightMode) return;

  const cells = document.querySelectorAll("#board .cell");

  cells.forEach((cell) => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);

    const distance = Math.abs(r - row) + Math.abs(c - col);

    if (distance <= 2) {
      cell.classList.add("night-reveal");
    }
  });
}

function clearReveal() {
  const cells = document.querySelectorAll("#board .cell.night-reveal");

  cells.forEach((cell) => {
    cell.classList.remove("night-reveal");
  });
}

function flashBoard() {
  if (!isNightMode()) return;

  const board = document.getElementById("board");
  board.classList.add("bright");

  setTimeout(() => {
    board.classList.remove("bright");
  }, 1500);
}

// 4-gravity

let count = 0;
let waveGravity = 0;

function downGravity() {
  for (let c = 1; c <= BOARD_COLS; c++) {
    const activeCell = [];
    for (let r = 1; r <= BOARD_ROWS; r++) {
      if (board[r][c] !== 0) {
        activeCell.push(board[r][c]);
      }
    }

    const emptySlots = BOARD_ROWS - activeCell.length;

    for (let r = 1; r <= emptySlots; r++) {
      board[r][c] = 0;
    }

    for (let r = emptySlots + 1; r <= BOARD_ROWS; r++) {
      board[r][c] = activeCell[r - emptySlots - 1];
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
    const emptySlots = BOARD_COLS - activeCell.length;

    for (let c = 1; c <= emptySlots; c++) {
      board[r][c] = 0;
    }
    for (let c = emptySlots + 1; c <= BOARD_COLS; c++) {
      board[r][c] = activeCell[c - emptySlots - 1];
    }
  }
}
function leftGravity() {
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

function resetGravity() {
  count = 0;
  waveGravity = 0;
}

function applyGravity() {
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

function isGravity() {
  return currentLevel === 4;
}

// 5-Paradox

let paradoxStep = 0;

const PARADOX_CYCLE = Object.keys(fruit).map(Number);

function isParadox() {
  return currentLevel === 5;
}

function applyParadox(path) {
  if (!isParadox()) return;

  const points = [path.start, path.end];
  const distance =
    Math.abs(path.start.r - path.end.r) + Math.abs(path.start.c - path.end.c);

  let radius;
  if (distance >= 5) {
    radius = 2;
  } else {
    radius = 1;
  }

  for (const point of points) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const r = point.r + dr;
        const c = point.c + dc;

        if (r < 1 || r > BOARD_ROWS || c < 1 || c > BOARD_COLS) {
          continue;
        }

        if (board[r][c] > 0) {
          board[r][c] = (board[r][c] % PARADOX_CYCLE.length) + 1;
        }
      }
    }
  }
}

// 6- Frozen
const FROZEN_COUNT = 14;

let fBoard = [];

function isFrozen() {
  return currentLevel === 6;
}

function applyFrozen() {
  fBoard = createEmptyMatrix();

  if (currentLevel !== 6) return;

  const avaiCell = [];

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0) {
        avaiCell.push({ r, c });
      }
    }
  }

  for (let i = avaiCell.length - 1; i > 0; i--) {
    const rd = Math.floor(Math.random() * (i + 1));

    let temp = avaiCell[i];
    avaiCell[i] = avaiCell[rd];
    avaiCell[rd] = temp;
  }

  for (let i = 0; i < FROZEN_COUNT; i++) {
    const r = avaiCell[i].r;
    const c = avaiCell[i].c;
    fBoard[r][c] = 1;
  }
}

function checkFrozen(r, c) {
  return currentLevel === 6 && fBoard[r]?.[c] === 1;
}

function breakIce(r1, c1, r2, c2) {
  const rows = [r1, r2];
  const cols = [c1, c2];

  for (let i = 0; i < 2; i++) {
    let r = rows[i];
    let c = cols[i];

    let nearR = [r - 1, r + 1, r, r];
    let nearC = [c, c, c - 1, c + 1];

    for (let j = 0; j < 4; j++) {
      let nr = nearR[j];
      let nc = nearC[j];

      if (checkFrozen(nr, nc)) {
        fBoard[nr][nc] = 0;
      }
    }
  }
}

// 6- Boss

const BOSS_MAX_HP = 25;
let bossHP = BOSS_MAX_HP;
let matchCount = 0;
const HEAL_HP_TIME = 15;
let healTimer = null;
let healElapsed = 0;

function isBoss() {
  return currentLevel === 7;
}

function createBossUI() {
  let panel = document.getElementById("boss-panel");
  if (!panel) return;

  panel.style.display = isBoss() ? "block" : "none";

  if (isBoss()) {
    const hpSpan = document.getElementById("boss-hp");
    const maxHpSpan = document.getElementById("boss-max-hp");
    const hpBar = document.getElementById("boss-hp-bar");

    if (hpSpan) hpSpan.textContent = bossHP;
    if (maxHpSpan) maxHpSpan.textContent = BOSS_MAX_HP;

    if (hpBar) {
      const percent = Math.max(0, (bossHP / BOSS_MAX_HP) * 100);
      hpBar.style.width = `${percent}%`;
    }
  }
}

function damageBoss() {
  if (!isBoss() || bossHP <= 0) return;

  bossHP--;

  document.getElementById("boss-hp").textContent = bossHP;

  document.getElementById("boss-hp-bar").style.width =
    `${(bossHP / BOSS_MAX_HP) * 100}%`;
}

function bossAttack() {
  if (!isBoss() || bossHP <= 0) return;

  matchCount++;

  if (matchCount < 4) return;

  matchCount = 0;

  const cell = [];

  for (let r = 1; r <= BOARD_ROWS; r++) {
    for (let c = 1; c <= BOARD_COLS; c++) {
      if (board[r][c] > 0) {
        cell.push({ r, c });
      }
    }
  }

  shuffleArray(cell);

  const amount = Math.min(4, cell.length);

  for (let i = 0; i < amount; i++) {
    const r = cell[i].r;
    const c = cell[i].c;
    board[r][c] = -1;
  }
  showBossMessage("Boss tấn công! Một số ô đã bị phong ấn!");
  renderBoard();
}
function bossHeal() {
  stopHeal();
  if (!isBoss()) return;
  healElapsed = 0;
  healTimer = setInterval(() => {
    if (!isBoss() || bossHP <= 0) {
      stopHeal();
      return;
    }

    healElapsed++;

    if (healElapsed >= HEAL_HP_TIME) {
      healElapsed = 0;
      bossHP++;

      updateBossUI();

      showBossMessage(`Boss hồi 1 HP! HP hiện tại: ${bossHP}`);
    }
  }, 1000);
}
function stopHeal() {
  if (healTimer !== null) {
    clearInterval(healTimer);
    healTimer = null;
  }
  healElapsed = 0;
}

function updateBossUI() {
  const hpSpan = document.getElementById("boss-hp");
  const hpBar = document.getElementById("boss-hp-bar");

  if (hpSpan) {
    hpSpan.textContent = bossHP;
  }

  if (hpBar) {
    const percent = Math.max(0, Math.min(100, (bossHP / BOSS_MAX_HP) * 100));

    hpBar.style.width = `${percent}%`;
  }
}

let bossMessageTimeout = null;

function showBossMessage(message) {
  const mess = document.getElementById("boss-mess");
  if (!mess) return;

  mess.textContent = message;

  mess.classList.remove("show");
  mess.classList.add("show");

  clearTimeout(bossMessageTimeout);

  bossMessageTimeout = setTimeout(() => {
    mess.classList.remove("show");
    mess.textContent = "";
  }, 5000);
}

// Hiển thị kết quả chơi

function showWin() {
  stopTimer();
  stopHeal();
  const resElement = document.getElementById("game-result");

  resElement.classList.remove("lose");
  resElement.classList.add("win");

  document.getElementById("result-score").textContent = getScore();

  document.getElementById("result-time").textContent = getTimeResult();

  document.getElementById("result-level").textContent = `${currentLevel}`;

  document.querySelector(".return-menu").classList.remove("hidden");

  document.querySelector(".replay-level").classList.remove("hidden");

  document.querySelector(".next-level").classList.remove("hidden");

  resElement.classList.remove("hidden");
}

function showOver() {
  stopTimer();
  stopHeal();
  const resElement = document.getElementById("game-result");

  resElement.classList.remove("win");
  resElement.classList.add("lose");

  document.querySelector(".result-header").textContent = "Game Over";

  document.getElementById("result-score").textContent = getScore();

  document.getElementById("result-time").textContent = getTimeResult();

  document.getElementById("result-level").textContent = `${currentLevel}`;

  document.querySelector(".return-menu").classList.remove("hidden");

  document.querySelector(".replay-level").classList.remove("hidden");

  document.querySelector(".next-level").classList.add("hidden");

  resElement.classList.remove("hidden");
}
function nextLevel() {
  document.getElementById("game-result").classList.add("hidden");

  if (currentLevel < 7) {
    startGame(currentLevel + 1);
  } else {
    alert("Chúc mừng! Bạn đã hoàn thành tất cả các màn!");
    document.querySelector(".game-screen").classList.add("hidden");
    document.querySelector(".welcome-main").classList.remove("hidden");
  }
}

// Nút Bấm

// hint
document.getElementById("hint").addEventListener("click", () => {
  hintCount++;
  updateActionCount();
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
  shuffleCount++;
  updateActionCount();
  shuffleBoard();
});

// quay lại & trang chủ
document.getElementById("return-home").addEventListener("click", () => {
  disableNightMode();
  document.querySelector(".game-screen").classList.add("hidden");
  document.querySelector(".welcome-main").classList.remove("hidden");
});

document.getElementById("btn-return").addEventListener("click", () => {
  document.querySelector(".select-level").classList.add("hidden");
  document.querySelector(".welcome-main").classList.remove("hidden");
});

document.getElementById("return-menu").addEventListener("click", () => {
  document.querySelector(".game-result").classList.add("hidden");
  document.querySelector(".game-screen").classList.add("hidden");
  document.querySelector(".welcome-main").classList.remove("hidden");
});
// qua màn
document.getElementById("next-level").addEventListener("click", nextLevel);

document.getElementById("replay-level").addEventListener("click", () => {
  document.getElementById("game-result").classList.add("hidden");
  startGame(currentLevel);
});
document.getElementById("refresh-game").addEventListener("click", () => {
  startGame(currentLevel);
});

// GameOver
document.addEventListener("timeUP", () => {
  showOver();
});

// chơi ngay
document.querySelector(".btn-play").addEventListener("click", () => {
  startGame(1);
});

//Hiển thị bản lựa chọn level
document.querySelector(".btn-select-lv").addEventListener("click", () => {
  document.querySelector(".welcome-main").classList.add("hidden");
  document.querySelector(".select-level").classList.remove("hidden");
});

// chọn level chơi
document.querySelectorAll(".play-level").forEach((button) => {
  button.addEventListener("click", () => {
    const levelContainer = button.closest(".lv-container");

    const level = Number(levelContainer.dataset.level);

    console.log("Chọn level:", level);

    startGame(level);
  });
});

//Hướng dẫn
const guideModal = document.getElementById("guide-modal");
const guideButton = document.getElementById("guide-btn");
const closeGuideButton = document.getElementById("close-guide");
const understoodButton = document.getElementById("understood-btn");

// Mở hướng dẫn
guideButton.addEventListener("click", () => {
  guideModal.classList.remove("hidden");
});

// Đóng bằng nút X
closeGuideButton.addEventListener("click", () => {
  guideModal.classList.add("hidden");
});

// Đóng bằng nút Đã hiểu
understoodButton.addEventListener("click", () => {
  guideModal.classList.add("hidden");
});

// khởi động trò chơi
let currentLevel = 1;

function startGame(level) {
  currentLevel = level;

  initializeBoard(level);

  shuffleCount = 0;
  hintCount = 0;
  updateActionCount();

  if (level === 3) {
    enableNightMode();
  } else {
    disableNightMode();
  }

  renderBoard();

  document.getElementById("current-level").textContent = level;

  document.querySelector(".welcome-main").classList.add("hidden");

  document.querySelector(".game-screen").classList.remove("hidden");

  document.querySelector(".select-level").classList.add("hidden");

  startTime();
}

setupBoardEvent();
