import { initializeBoard } from "./board.js";
import { renderBoard } from "./renderer.js";
import { setupBoardEvent } from "./input.js";

function startGame() {
  initializeBoard();

  renderBoard();

  setupBoardEvent();
}

startGame();