// Optimized JavaScript with better performance and organization
class SpaceInvaders {
    constructor() {
        // Game settings
        this.width = 15;
        this.height = 15;
        this.invaderSpeed = 500;
        this.laserSpeed = 100;
        this.maxLasers = 3;
        
        // DOM elements
        this.grid = document.getElementById('grid');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.winnerElement = document.getElementById('winner');
        this.resetButton = document.getElementById('resetButton');
        
        // Game state
        this.squares = [];
        this.currentShooterIndex = 202;
        this.invaderIds = null;
        this.activeLasers = new Set(); // Track active lasers
        this.direction = 1;
        this.goingRight = true;
        this.aliensRemoved = new Set();
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameActive = true;
        
        // Initialize game
        this.createGrid();
        this.setupEventListeners();
        this.startGame();
    }

    createGrid() {
        // Clear existing grid
        this.grid.innerHTML = '';
        this.squares = [];

        // Create grid cells
        for (let i = 0; i < this.width * this.height; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            this.squares.push(cell);
            this.grid.appendChild(cell);
        }

        // Set initial shooter position
        this.squares[this.currentShooterIndex].classList.add('shooter');
        
        // Define initial invader positions
        this.alienInvaders = [
            ...Array(10).fill().map((_, i) => i),
            ...Array(10).fill().map((_, i) => i + this.width),
            ...Array(10).fill().map((_, i) => i + this.width * 2)
        ];
        
        this.drawInvaders();
    }

    setupEventListeners() {
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.resetGame = this.resetGame.bind(this);
        
        document.addEventListener('keydown', this.handleKeyPress);
        this.resetButton.addEventListener('click', this.resetGame);
    }

    resetGame() {
        // Clear all intervals
        clearInterval(this.invaderIds);
        this.activeLasers.forEach(laser => clearInterval(laser));
        
        // Reset game state
        this.activeLasers.clear();
        this.aliensRemoved.clear();
        this.direction = 1;
        this.goingRight = true;
        this.currentShooterIndex = 202;
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.gameActive = true;
        
        // Hide messages
        this.gameOverElement.style.display = 'none';
        this.winnerElement.style.display = 'none';
        
        // Recreate grid and start game
        this.createGrid();
        this.startGame();
    }

    handleKeyPress(e) {
        if (!this.gameActive) return;
        
        const key = e.key;
        
        if (key === 'ArrowLeft' && this.currentShooterIndex % this.width !== 0) {
            this.moveShooter(-1);
        } else if (key === 'ArrowRight' && this.currentShooterIndex % this.width < this.width - 1) {
            this.moveShooter(1);
        } else if (key === ' ') {
            e.preventDefault(); // Prevent page scrolling
            this.shoot();
        }
    }

    moveShooter(direction) {
        this.squares[this.currentShooterIndex].classList.remove('shooter');
        this.currentShooterIndex += direction;
        this.squares[this.currentShooterIndex].classList.add('shooter');
    }

    drawInvaders() {
        this.alienInvaders.forEach((invader, index) => {
            if (!this.aliensRemoved.has(index)) {
                this.squares[invader].classList.add('invader');
            }
        });
    }

    removeInvaders() {
        this.alienInvaders.forEach(invader => {
            this.squares[invader].classList.remove('invader');
        });
    }

    moveInvaders() {
        const leftEdge = this.alienInvaders[0] % this.width === 0;
        const rightEdge = this.alienInvaders[this.alienInvaders.length - 1] % this.width === this.width - 1;

        this.removeInvaders();

        if (rightEdge && this.goingRight) {
            this.moveInvadersDown(1);
            this.direction = -1;
            this.goingRight = false;
        } else if (leftEdge && !this.goingRight) {
            this.moveInvadersDown(-1);
            this.direction = 1;
            this.goingRight = true;
        }

        this.alienInvaders = this.alienInvaders.map(invader => invader + this.direction);
        this.drawInvaders();
        this.checkGameOver();
    }

    moveInvadersDown(direction) {
        this.alienInvaders = this.alienInvaders.map(invader => invader + this.width);
    }

    shoot() {
        if (this.activeLasers.size >= this.maxLasers) return;

        let currentLaserIndex = this.currentShooterIndex;
        const laserId = setInterval(() => {
            this.squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= this.width;

            if (currentLaserIndex < 0) {
                clearInterval(laserId);
                this.activeLasers.delete(laserId);
                return;
            }

            this.squares[currentLaserIndex].classList.add('laser');
            this.checkForHit(currentLaserIndex, laserId);
        }, this.laserSpeed);

        this.activeLasers.add(laserId);
    }

    checkForHit(laserIndex, laserId) {
        if (this.squares[laserIndex].classList.contains('invader')) {
            this.squares[laserIndex].classList.remove('laser', 'invader');
            this.squares[laserIndex].classList.add('boom');
            
            setTimeout(() => this.squares[laserIndex].classList.remove('boom'), 200);
            clearInterval(laserId);
            this.activeLasers.delete(laserId);

            const invaderRemoved = this.alienInvaders.indexOf(laserIndex);
            this.aliensRemoved.add(invaderRemoved);
            this.updateScore(10);
            this.checkWin();
        }
    }

    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreElement.textContent = this.highScore;
            localStorage.setItem('highScore', this.highScore);
        }
    }

    checkGameOver() {
        if (this.squares[this.currentShooterIndex].classList.contains('invader')) {
            this.endGame(false);
        }

        if (this.alienInvaders.some(invader => invader > this.squares.length - this.width)) {
            this.endGame(false);
        }
    }

    checkWin() {
        if (this.aliensRemoved.size === this.alienInvaders.length) {
            this.endGame(true);
        }
    }

    endGame(won) {
        this.gameActive = false;
        clearInterval(this.invaderIds);
        this.activeLasers.forEach(laser => clearInterval(laser));
        this.activeLasers.clear();
        
        if (won) {
            this.winnerElement.style.display = 'block';
        } else {
            this.gameOverElement.style.display = 'block';
        }
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.handleKeyPress);
        this.resetButton.removeEventListener('click', this.resetGame);
    }

    startGame() {
        this.highScoreElement.textContent = this.highScore;
        this.invaderIds = setInterval(() => this.moveInvaders(), this.invaderSpeed);
    }
}

// Start game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new SpaceInvaders());