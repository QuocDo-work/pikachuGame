import { getScore } from "./current-score.js";
import { getTimeResult, stopTimer } from "./timers.js";

export function showWin() {
  stopTimer();
  const resElement = document.getElementById("game-result");

  resElement.classList.remove("lose");
  resElement.classList.add("win");

  document.getElementById("result-score").textContent = getScore();

  document.getElementById("result-time").textContent = getTimeResult();

  document.querySelector(".return-menu").classList.remove("hidden");

  document.querySelector(".replay-level").classList.remove("hidden");

  document.querySelector(".next-level").classList.remove("hidden");

  resElement.classList.remove("hidden");
}

export function showOver() {
  stopTimer();
  const resElement = document.getElementById("game-result");

  resElement.classList.remove("win");
  resElement.classList.add("lose");

  document.querySelector(".result-header").textContent = "Game Over";

  document.getElementById("result-score").textContent = getScore();

  document.getElementById("result-time").textContent = getTimeResult();

  document.querySelector(".return-menu").classList.remove("hidden");

  document.querySelector(".replay-level").classList.remove("hidden");

  document.querySelector(".next-level").classList.add("hidden");

  resElement.classList.remove("hidden");
}
