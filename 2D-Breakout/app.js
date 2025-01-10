const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties
const ballRadius = 8;
let ballX = canvas.width / 2;
let ballY = canvas.height - 40;
let ballDX = 4; // Ball's horizontal velocity
let ballDY = -4; // Ball's vertical velocity

// Block properties
const blockRowCount = 5;
const blockColumnCount = 8;
const blockWidth = 75;
const blockHeight = 20;
const blockPadding = 10;
const blockOffsetTop = 30;
const blockOffsetLeft = 30;

// Game variables
let blocks = [];
let score = 0;
let lives = 3;
let rightPressed = false;
let leftPressed = false;

// Initialize blocks
for (let c = 0; c < blockColumnCount; c++) {
  blocks[c] = [];
  for (let r = 0; r < blockRowCount; r++) {
    blocks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Event listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') rightPressed = true;
  if (e.key === 'ArrowLeft') leftPressed = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') rightPressed = false;
  if (e.key === 'ArrowLeft') leftPressed = false;
});

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

// Draw blocks
function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status === 1) {
        const blockX = c * (blockWidth + blockPadding) + blockOffsetLeft;
        const blockY = r * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;
        ctx.fillStyle = '#f00';
        ctx.fillRect(blockX, blockY, blockWidth, blockHeight);
      }
    }
  }
}

// Detect ball collision with blocks
function collisionDetection() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      const block = blocks[c][r];
      if (block.status === 1) {
        if (
          ballX > block.x &&
          ballX < block.x + blockWidth &&
          ballY > block.y &&
          ballY < block.y + blockHeight
        ) {
          ballDY = -ballDY;
          block.status = 0;
          score++;
          if (score === blockRowCount * blockColumnCount) {
            alert('You win! 🎉');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Draw score and lives
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 75, 20);
}

// Update game objects
function update() {
  // Move ball
  ballX += ballDX;
  ballY += ballDY;

  // Ball collision with walls
  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX; // Reverse horizontal direction
  }

  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY; // Reverse vertical direction (top wall)
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    // Ball collision with paddle
    if (
      ballX > paddleX &&
      ballX < paddleX + paddleWidth &&
      ballY + ballRadius > canvas.height - paddleHeight - 10
    ) {
      // Reverse vertical direction
      ballDY = -ballDY;

      // Adjust ball's horizontal velocity based on where it hits the paddle
      const hitPosition = ballX - (paddleX + paddleWidth / 2);
      const maxBounceAngle = Math.PI / 3; // 60 degrees
      const bounceAngle = (hitPosition / (paddleWidth / 2)) * maxBounceAngle;

      ballDX = 4 * Math.sin(bounceAngle); // Horizontal velocity based on angle
      ballDY = -4 * Math.cos(bounceAngle); // Upward vertical velocity
    } else if (ballY > canvas.height) {
      // Ball missed paddle (falling off bottom edge)
      lives--;
      if (!lives) {
        alert('Game Over! 😢');
        document.location.reload();
      } else {
        // Reset ball and paddle
        ballX = canvas.width / 2;
        ballY = canvas.height - 40;
        ballDX = 4;
        ballDY = -4;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  // Check for collisions with blocks
  collisionDetection();
}

// Main game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBlocks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  update();

  requestAnimationFrame(draw);
}

// Start the game
draw();
