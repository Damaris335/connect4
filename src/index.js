const board = document.querySelector("#board");
const result = document.querySelector("#result");

const rows = 6;
const cols = 7;
let currentPlayer = "player1";
result.textContent = "Player 1 starts!";
let gameOver = false;

let cells = [];

// create the game board
function createBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", function () {
                if (!gameOver) {
                    game(c);
                }
            });
            board.appendChild(cell);
            cells.push(cell);
        }
    }
}

createBoard();

// place a piece in the selected column and return the row index where the piece was placed
function dropPiece(col) {

    for (let r = rows - 1; r >= 0; r--) {
        const cell = cells[r * cols + col];
        if (!cell) return null;
        if (!cell.classList.contains("player1") && !cell.classList.contains("player2")) {
            cell.classList.add(currentPlayer);
            return r;
        }
    }
    return null;
}

// restart button
function restartoption() {
    gameOver = true;
    let restartbutton = document.createElement("button");
    restartbutton.textContent = "Re-start";
    restartbutton.classList.add("restart-button");
    restartbutton.addEventListener("click", function () {
        cells.forEach(cell => {
            cell.classList.remove("player1", "player2");
        });
        currentPlayer = "player1";
        result.textContent = "Player 1 starts!";
        restartbutton.remove();
        gameOver = false;
    });
    result.appendChild(restartbutton);
}


// Check the win condition
function checkWin(row, col) {
    const cell = cells[row * cols + col];
    if (!cell) return false;

    const color = cell.classList.contains("player1") ? "player1" : "player2";

    return (
        checkDirection(row, col, color, 0, 1) || // horizontal
        checkDirection(row, col, color, 1, 0) || // vertical
        checkDirection(row, col, color, 1, 1) || // diagonal \
        checkDirection(row, col, color, 1, -1)   // diagonal /
    );
}

// check in a specific direction
function checkDirection(
    row,
    col,
    color,
    dr,
    dc
) {
    let count = 1;

    // positive direction
    count += countInDirection(row, col, color, dr, dc);

    // negative direction
    count += countInDirection(row, col, color, -dr, -dc);

    return count >= 4;
}

// count consecutive pieces in a specific direction
function countInDirection(row, col, color, dr, dc) {
    let count = 0;

    for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;

        if (r < 0 || r >= rows || c < 0 || c >= cols) break;

        const cell = cells[r * cols + c];
        if (cell && cell.classList.contains(color)) {
            count++;
        } else {
            break;
        }
    }

    return count;
}

// main game function
function game(col) {
    const placedRow = dropPiece(col);

    if (placedRow === null) return;

    if (checkWin(placedRow, col)) {
        result.textContent = `${currentPlayer === "player1" ? "Player 1" : "Player 2"} wins!`;
        restartoption();
        return;
    }

    if (cells.every(cell => cell.classList.contains("player1") || cell.classList.contains("player2"))) {
        result.textContent = "It's a tie!";
        restartoption();
        return;
    }

    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";

    result.textContent = `${currentPlayer === "player1" ? "Player 1" : "Player 2"}'s turn`;
}
