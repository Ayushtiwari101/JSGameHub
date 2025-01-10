const images = [
    "https://via.placeholder.com/100x100?text=1",
    "https://via.placeholder.com/100x100?text=2",
    "https://via.placeholder.com/100x100?text=3",
    "https://via.placeholder.com/100x100?text=4",
    "https://via.placeholder.com/100x100?text=5",
    "https://via.placeholder.com/100x100?text=6",
    "https://via.placeholder.com/100x100?text=7",
    "https://via.placeholder.com/100x100?text=8",
];

let gameData = [...images, ...images];
let firstTile = null;
let secondTile = null;
let lockBoard = false;
const gameContainer = document.getElementById("gameContainer");

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createTile(imageSrc) {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    const img = document.createElement("img");
    img.src = imageSrc;
    tile.appendChild(img);

    tile.addEventListener("click", () => {
        if (lockBoard || tile === firstTile || tile.classList.contains("matched")) return;

        tile.classList.add("flipped");

        if (!firstTile) {
            firstTile = tile;
            return;
        }

        secondTile = tile;
        lockBoard = true;

        checkMatch();
    });

    return tile;
}

function checkMatch() {
    const firstImage = firstTile.querySelector("img").src;
    const secondImage = secondTile.querySelector("img").src;

    if (firstImage === secondImage) {
        firstTile.classList.add("matched");
        secondTile.classList.add("matched");
        resetBoard();
        checkWin();
    } else {
        setTimeout(() => {
            firstTile.classList.remove("flipped");
            secondTile.classList.remove("flipped");
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    [firstTile, secondTile, lockBoard] = [null, null, false];
}

function checkWin() {
    if (document.querySelectorAll(".tile:not(.matched)").length === 0) {
        setTimeout(() => alert("Congratulations! You've won the game!"), 200);
    }
}

function initGame() {
    gameData = shuffle(gameData);
    gameData.forEach(image => {
        const tile = createTile(image);
        gameContainer.appendChild(tile);
    });
}

initGame();
