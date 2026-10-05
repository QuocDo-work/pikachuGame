let timeLeft = 120;
let timeID = null;

export function startTime() {
  stopTimer();
  updateTimeDisplay();

  timeID = setInterval(() => {
    timeLeft--;
    updateTimeDisplay();

    if (timeLeft <= 0) {
      stopTimer();
      alert("Hết giờ! Bạn đã thua cuộc.");
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
