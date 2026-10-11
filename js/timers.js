const TOTAL_TIME = 180;
let timeLeft = TOTAL_TIME;
let timeR = TOTAL_TIME;
let timeID = null;

export function startTime() {
  stopTimer();
  updateTimeDisplay();

  timeLeft = TOTAL_TIME;
  timeR = TOTAL_TIME;

  timeID = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      document.dispatchEvent(new CustomEvent("timeUP"));
    }
  }, 1000);
}

export function stopTimer() {
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

export function getTimeResult() {
  const elapsed = timeR - timeLeft;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
