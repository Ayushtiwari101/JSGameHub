const squares = document.querySelectorAll('.square');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');

let score = 0;
let timeLeft = 30;
let moleTimer;
let countdownTimer;
let activeSquareId = null;

// Function to randomly select a square for the mole
function randomSquare() {
    squares.forEach(square => square.classList.remove('active'));
    const randomIndex = Math.floor(Math.random() * squares.length);
    const randomSquare = squares[randomIndex];
    randomSquare.classList.add('active');
    activeSquareId = randomSquare.id;
}

// Function to start the mole timer
function startMoleMovement() {
    moleTimer = setInterval(randomSquare, 1000);
}

// Function to handle square clicks
squares.forEach(square => {
    square.addEventListener('click', () => {
        if (square.id === activeSquareId) {
            score++;
            scoreDisplay.textContent = score;
            square.classList.remove('active');
            activeSquareId = null;
        }
    });
});

// Function to start the countdown
function startCountdown() {
    countdownTimer = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(moleTimer);
            clearInterval(countdownTimer);
            alert(`Game Over! Your final score is ${score}.`);
        }
    }, 1000);
}

// Start the game
function startGame() {
    randomSquare();
    startMoleMovement();
    startCountdown();
}

// Start the game when the script loads
startGame();
