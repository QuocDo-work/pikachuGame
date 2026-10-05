import { BOARD_ROWS, BOARD_COLS, } from "./config.js";

export function drawConnection(path) {
  const boardElement = document.getElementById("board");

  // Xóa đường cũ
  const oldLayer = boardElement.querySelector(".path-layer");

  if (oldLayer) {
    oldLayer.remove();
  }

  const layer = document.createElement("div");
  layer.className = "path-layer";

  boardElement.appendChild(layer);

  const points = [
    path.start,
    ...(path.corners || []),
    path.end,
  ];

  for (let i = 0; i < points.length - 1; i++) {
    drawLine(layer, points[i], points[i + 1]);
  }
}

function getCellCenter(row, col) {
  const boardElement = document.getElementById("board");
  const boardRect = boardElement.getBoundingClientRect();

  const cell = boardElement.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );

  if (cell) {
        const cellRect = cell.getBoundingClientRect();

        return {
            x: cellRect.left - boardRect.left + cellRect.width / 2,
            y: cellRect.top - boardRect.top + cellRect.height / 2,
        };
    }

  // lấy vị trí ô chuẩn 
  const fCell = boardElement.querySelector(`.cell[data-row="1"][data-col="1"]`);

  const scColCell = boardElement.querySelector(`.cell[data-row="1"][data-col="2"]`);

  const scRowCell = boardElement.querySelector(`.cell[data-row="2"][data-col="1"]`)

  if(!fCell || !scColCell || !scRowCell){
    return null;
  }
  
  const fRect = fCell.getBoundingClientRect();
  const scRowRect = scRowCell.getBoundingClientRect();
  const scColRect = scColCell.getBoundingClientRect();


// Tâm ô đầu tiên.
  const fX = fRect.left - boardRect.left + fRect.width / 2;
  const fY = fRect.top - boardRect.top + fRect.height / 2

// khoản cách giữa tâm 2 cột
  const colStep = scColRect.left - fRect.left;
// khoản cách giữa tâm 2 hàng
  const rowStep = scRowRect.top - fRect.top;

  let x;

  if(col < 1){
    x = fX + (col - 1) * colStep;
  } else if (col > BOARD_COLS){
    x = fX + (col - 1) * colStep;
  } else {
    x = fX + (col -1 ) * colStep;
  }

  let y;
  
  if(row < 1){
    y = fY + (row - 1) * rowStep;
  }else if (row > BOARD_ROWS){
    y = fY + (row - 1) * rowStep;
  }else {
    y = fY + (row - 1) * rowStep;
  }
  return {x, y };

}

function drawLine(layer, p1, p2) {
  const start = getCellCenter(p1.r, p1.c);
  const end = getCellCenter(p2.r, p2.c);

  // Nếu điểm là biên ảo thì hiện tại chưa có .cell
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