// script.js
const grid = document.getElementById("grid");
const startPauseBtn = document.getElementById("start-pause-btn");
const timerDisplay = document.getElementById("timer");
const statusDisplay = document.getElementById("status");

const width = 9; // Grid width
let timer = 20;
let timerInterval;
let gameActive = false;
let frogIndex = 76; // Starting block position

// Create grid
for (let i = 0; i < width * width; i++) {
  const cell = document.createElement("div");
  cell.classList.add("grid-cell");
  if (i === frogIndex) cell.classList.add("frog");
  if (i === 4) cell.classList.add("ending-block");
  if (i >= 72 && i <= 80) cell.classList.add("starting-block");
  if (i >= 9 && i < 18) cell.classList.add("road");
  if (i >= 27 && i < 36) cell.classList.add("river");
  grid.appendChild(cell);
}

const cells = Array.from(document.querySelectorAll(".grid-cell"));

// Add cars
const cars = [11, 14, 17];
cars.forEach((car) => cells[car].classList.add("car"));

// Add logs
const logs = [30, 33, 36];
logs.forEach((log) => cells[log].classList.add("log"));

// Move frog
function moveFrog(e) {
  cells[frogIndex].classList.remove("frog");
  switch (e.key) {
    case "ArrowUp":
      if (frogIndex - width >= 0) frogIndex -= width;
      break;
    case "ArrowDown":
      if (frogIndex + width < width * width) frogIndex += width;
      break;
    case "ArrowLeft":
      if (frogIndex % width !== 0) frogIndex -= 1;
      break;
    case "ArrowRight":
      if (frogIndex % width !== width - 1) frogIndex += 1;
      break;
  }
  cells[frogIndex].classList.add("frog");
  checkGameStatus();
}

// Move cars and logs
function moveElements() {
  cars.forEach((car, i) => {
    cells[car].classList.remove("car");
    cars[i] = (car + 1) % 81;
    cells[cars[i]].classList.add("car");
  });

  logs.forEach((log, i) => {
    cells[log].classList.remove("log");
    logs[i] = (log + 1) % 81;
    cells[logs[i]].classList.add("log");
  });

  if (cells[frogIndex].classList.contains("log")) {
    frogIndex = (frogIndex + 1) % 81;
    cells[frogIndex].classList.add("frog");
  }

  checkGameStatus();
}

// Check game status
function checkGameStatus() {
  if (cells[frogIndex].classList.contains("car")) {
    endGame("You got hit by a car! Game over.");
  } else if (cells[frogIndex].classList.contains("river") && !cells[frogIndex].classList.contains("log")) {
    endGame("You fell into the river! Game over.");
  } else if (frogIndex === 4) {
    endGame("You reached the ending block! You win!");
  }
}

// Start or pause game
function startPauseGame() {
  if (gameActive) {
    clearInterval(timerInterval);
    gameActive = false;
    startPauseBtn.textContent = "Start";
  } else {
    gameActive = true;
    startPauseBtn.textContent = "Pause";
    timerInterval = setInterval(() => {
      timer--;
      timerDisplay.textContent = `Time: ${timer}s`;
      if (timer === 0) {
        endGame("Time's up! Game over.");
      }
      moveElements();
    }, 1000);
  }
}

// End game
function endGame(message) {
  clearInterval(timerInterval);
  gameActive = false;
  statusDisplay.textContent = message;
  startPauseBtn.textContent = "Restart";
}

// Event listeners
document.addEventListener("keydown", moveFrog);
startPauseBtn.addEventListener("click", startPauseGame);
