const rows = 6;
const cols = 7;
const board = [];
let currentPlayer = 1; // 1 for red, 2 for yellow

// Initialize the game board
function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = ""; // Clear the board
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < cols; col++) {
            board[row][col] = null;
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", makeMove);
            boardDiv.appendChild(cell);
        }
    }
    updateStatus();
}

// Update the status message
function updateStatus(message) {
    const status = document.getElementById("status");
    if (message) {
        status.textContent = message;
    } else {
        const playerColor = currentPlayer === 1 ? "Red" : "Yellow";
        status.textContent = `Player ${currentPlayer}'s Turn (${playerColor})`;
    }
}

// Handle the player's move
function makeMove(event) {
    const col = parseInt(event.target.dataset.col);
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === null) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            cell.classList.add(currentPlayer === 1 ? "red" : "yellow");
            if (checkWin(row, col)) {
                updateStatus(`Player ${currentPlayer} Wins!`);
                disableBoard();
            } else if (board.flat().every(cell => cell !== null)) {
                updateStatus("It's a Draw!");
            } else {
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateStatus();
            }
            return;
        }
    }
    alert("Invalid Move! Column is full.");
}

// Check for win conditions
function checkWin(row, col) {
    const directions = [
        { dr: -1, dc: 0 }, // vertical
        { dr: 0, dc: 1 },  // horizontal
        { dr: -1, dc: 1 }, // diagonal /
        { dr: -1, dc: -1 } // diagonal \
    ];
    const current = board[row][col];

    for (const { dr, dc } of directions) {
        let count = 1;
        for (let i = 1; i < 4; i++) {
            const r = row + dr * i;
            const c = col + dc * i;
            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === current) {
                count++;
            } else {
                break;
            }
        }
        for (let i = 1; i < 4; i++) {
            const r = row - dr * i;
            const c = col - dc * i;
            if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === current) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 4) return true;
    }
    return false;
}

// Disable further moves after the game ends
function disableBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.removeEventListener("click", makeMove);
    });
}

// Reset the game
document.getElementById("reset").addEventListener("click", () => {
    currentPlayer = 1;
    board.length = 0; // Clear the board array
    createBoard();
});

// Initialize the game
createBoard();
