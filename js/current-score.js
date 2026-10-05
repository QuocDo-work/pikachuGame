let score = 0;

export function addScore() {
  score += 10;

  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

export function getScore() {
  return score;
}

export function resetScore() {
  score = 0;

  const scoreElement = document.getElementById("score");

  if (scoreElement) {
    scoreElement.textContent = score;
  }
}
