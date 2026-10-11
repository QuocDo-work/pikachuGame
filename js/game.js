import { initializeBoard } from "./board.js";
import { renderBoard } from "./renderer.js";
import { setupBoardEvent } from "./input.js";
import { disableNightMode, enableNightMode } from "./night.js";

export let currentLevel = 1;

export function startGame(level) {
  currentLevel = level;

  initializeBoard(level);

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
}

document.querySelector(".btn-play").addEventListener("click", () => {
  startGame(1);
});
document.querySelector(".btn-select-lv").addEventListener("click", () => {
  document.querySelector(".welcome-main").classList.add("hidden");
  document.querySelector(".select-level").classList.remove("hidden");
});

document.querySelectorAll(".play-level").forEach((button) => {
  button.addEventListener("click", () => {
    const levelContainer = button.closest(".lv-container");

    const level = Number(levelContainer.dataset.level);

    console.log("Chọn level:", level);

    startGame(level);
  });
});

setupBoardEvent();
