document.addEventListener('DOMContentLoaded', () => {
    function createSimpleSound(frequency = 440, duration = 0.1, volume = 0.5, type = 'sine') {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + duration);
    }
    // DOM Elements
    const grid = document.querySelector('.grid');
    const cells = document.querySelectorAll('.cell');
    const currentPlayerText = document.getElementById('current-player');
    const resetButton = document.getElementById('reset-button');
    const resetScoresButton = document.getElementById('reset-scores');
    const themeSelector = document.getElementById('theme');
    const soundToggle = document.getElementById('sound-toggle');
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');

    // Audio Elements
    const pieceDropSound = document.getElementById('piece-drop');
    const winSound = document.getElementById('win-sound');
    const drawSound = document.getElementById('draw-sound');

    // Game State
    let currentPlayer = 1;
    let gameBoard = Array(42).fill(0);
    let gameActive = true;
    let scores = {
        player1: parseInt(localStorage.getItem('player1Score')) || 0,
        player2: parseInt(localStorage.getItem('player2Score')) || 0
    };

    // Initialize scores from localStorage
    player1Score.textContent = scores.player1;
    player2Score.textContent = scores.player2;

    // Initialize game
    function initGame() {
        gameBoard = Array(42).fill(0);
        currentPlayer = 1;
        gameActive = true;
        cells.forEach(cell => {
            cell.classList.remove('player-1', 'player-2', 'winner');
        });
        currentPlayerText.textContent = "Player 1's Turn";
    }

    // Play sound effect
    function playSound(type) {
        if (!soundToggle.checked) return;
        
        switch(type) {
            case pieceDropSound:
                createSimpleSound(300, 0.1, 0.3, 'sine');
                break;
            case winSound:
                createSimpleSound(440, 0.2, 0.3, 'sine');
                setTimeout(() => createSimpleSound(550, 0.2, 0.3, 'sine'), 200);
                setTimeout(() => createSimpleSound(660, 0.3, 0.3, 'sine'), 400);
                break;
            case drawSound:
                createSimpleSound(200, 0.3, 0.3, 'sine');
                setTimeout(() => createSimpleSound(150, 0.3, 0.3, 'sine'), 300);
                break;
        }
    }

    // Update scores
    function updateScore(player) {
        if (player === 1) {
            scores.player1++;
            player1Score.textContent = scores.player1;
            localStorage.setItem('player1Score', scores.player1);
        } else {
            scores.player2++;
            player2Score.textContent = scores.player2;
            localStorage.setItem('player2Score', scores.player2);
        }
    }

    // Reset scores
    function resetScores() {
        scores.player1 = 0;
        scores.player2 = 0;
        player1Score.textContent = '0';
        player2Score.textContent = '0';
        localStorage.setItem('player1Score', '0');
        localStorage.setItem('player2Score', '0');
    }

    // Apply theme
    function applyTheme(themeName) {
        document.body.className = `theme-${themeName}`;
        localStorage.setItem('connect4-theme', themeName);
    }

    // Check if move is valid
    function isValidMove(col) {
        const startIndex = col;
        for (let row = 5; row >= 0; row--) {
            const index = row * 7 + col;
            if (gameBoard[index] === 0) {
                return index;
            }
        }
        return -1;
    }

    // Get winning cells
    function getWinningCells(lastMove) {
        const row = Math.floor(lastMove / 7);
        const col = lastMove % 7;
        const player = gameBoard[lastMove];
        let winningCells = [];

        // Check directions: horizontal, vertical, diagonal
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal right
            [1, -1]  // diagonal left
        ];

        for (const [dx, dy] of directions) {
            let cells = [lastMove];
            let count = 1;

            // Check forward
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r * 7 + c] === player) {
                cells.push(r * 7 + c);
                count++;
                r += dx;
                c += dy;
            }

            // Check backward
            r = row - dx;
            c = col - dy;
            while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r * 7 + c] === player) {
                cells.push(r * 7 + c);
                count++;
                r -= dx;
                c -= dy;
            }

            if (count >= 4) {
                winningCells = cells;
                break;
            }
        }

        return winningCells;
    }

    // Check for win
    function checkWin(lastMove) {
        const winningCells = getWinningCells(lastMove);
        return winningCells.length >= 4;
    }

    // Highlight winning cells
    function highlightWinningCells(lastMove) {
        const winningCells = getWinningCells(lastMove);
        winningCells.forEach(index => {
            cells[index].classList.add('winner');
        });
    }

    // Make move
    function makeMove(index) {
        gameBoard[index] = currentPlayer;
        const cell = cells[index];
        
        // Add piece with animation
        cell.classList.add(`player-${currentPlayer}`);
        playSound(pieceDropSound);

        if (checkWin(index)) {
            gameActive = false;
            currentPlayerText.textContent = `Player ${currentPlayer} Wins!`;
            highlightWinningCells(index);
            updateScore(currentPlayer);
            playSound(winSound);
            return;
        }

        if (gameBoard.every(cell => cell !== 0)) {
            gameActive = false;
            currentPlayerText.textContent = "Game Draw!";
            playSound(drawSound);
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        currentPlayerText.textContent = `Player ${currentPlayer}'s Turn`;
    }

    // Event Listeners
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (!gameActive) return;
            
            const col = index % 7;
            const moveIndex = isValidMove(col);
            
            if (moveIndex !== -1) {
                makeMove(moveIndex);
            }
        });
    });

    resetButton.addEventListener('click', initGame);
    resetScoresButton.addEventListener('click', resetScores);
    
    themeSelector.addEventListener('change', (e) => {
        applyTheme(e.target.value);
    });

    // Handle sound toggle
    soundToggle.addEventListener('change', () => {
        localStorage.setItem('soundEnabled', soundToggle.checked);
    });

    // Load saved preferences
    const savedTheme = localStorage.getItem('connect4-theme') || 'classic';
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    themeSelector.value = savedTheme;
    soundToggle.checked = soundEnabled;
    applyTheme(savedTheme);

    // Initialize game on load
    initGame();
});