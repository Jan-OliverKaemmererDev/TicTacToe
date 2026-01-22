const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');
const playerXDiv = document.getElementById('playerX');
const playerODiv = document.getElementById('playerO');

let currentPlayer = 'PLAYER 1';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));
    if (gameState[index] !== "" || !gameActive || currentPlayer === 'PLAYER 2') {
        return;
    }
    updateCell(cell, index);
    checkResult();
}

function updateCell(cell, index) {
    const symbol = (currentPlayer === 'PLAYER 1') ? 'X' : 'O';
    gameState[index] = symbol;
    cell.innerText = symbol;
    cell.setAttribute('data-symbol', symbol);
    cell.style.color = (symbol === 'X') ? 'var(--accent-color)' : 'white';
}

function updateUI() {
    if (currentPlayer === 'PLAYER 1') {
        playerXDiv.classList.add('active');
        playerODiv.classList.remove('active');
    } else {
        playerODiv.classList.add('active');
        playerXDiv.classList.remove('active');
    }
}

function switchPlayer() {
    currentPlayer = (currentPlayer === 'PLAYER 1') ? 'PLAYER 2' : 'PLAYER 1';
    updateUI();
}

function highlightWinner(line) {
    for (let i = 0; i < line.length; i++) {
        cells[line[i]].classList.add('winner');
    }
    statusText.innerText = currentPlayer + " hat gewonnen! 🎉";
    board.classList.add('shake');
    gameActive = false;
}

function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const cond = winningConditions[i];
        const a = gameState[cond[0]];
        const b = gameState[cond[1]];
        const c = gameState[cond[2]];
        if (a !== "" && a === b && a === c) {
            highlightWinner(cond);
            return true;
        }
    }
    return false;
}

function checkResult() {
    if (checkWin()) {
        return;
    }
    if (!gameState.includes("")) {
        statusText.innerText = "Unentschieden! 🤝";
        gameActive = false;
        return;
    }
    switchPlayer();
}

function clearCell(cell) {
    cell.innerText = "";
    cell.classList.remove('winner');
}

function resetGame() {
    currentPlayer = 'PLAYER 1';
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusText.innerText = "";
    board.classList.remove('shake');
    for (let i = 0; i < cells.length; i++) {
        clearCell(cells[i]);
    }
    updateUI();
}

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', handleCellClick);
}
resetBtn.addEventListener('click', resetGame);

function getRandomIndex() {
    const availableIndices = [];
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            availableIndices.push(i);
        }
    }
    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    return availableIndices[randomIndex];
}

function makeBotMove() {
    if (!gameActive || currentPlayer !== 'PLAYER 2') {
        return;
    }
    const index = getRandomIndex();
    if (index !== undefined) {
        const cell = cells[index];
        updateCell(cell, index);
        checkResult();
    }
}

function checkResult() {
    if (checkWin()) return;
    if (!gameState.includes("")) {
        statusText.innerText = "Unentschieden! 🤝";
        gameActive = false;
        return;
    }
    switchPlayer();
    if (currentPlayer === 'PLAYER 2' && gameActive) {
        setTimeout(makeBotMove, 500); 
    }
}

function findWinningIndex(symbol) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const values = [gameState[a], gameState[b], gameState[c]];
        const emptyIndex = [a, b, c][values.indexOf("")];
        if (values.filter(function(v) { return v === symbol; }).length === 2 && emptyIndex !== undefined) {
            return emptyIndex;
        }
    }
    return null;
}

function getBestMove() {
    let move = findWinningIndex("O");
    if (move !== null) return move;
    move = findWinningIndex("X");
    if (move !== null) return move;
    return getRandomIndex();
}

function makeBotMove() {
    if (!gameActive || currentPlayer !== 'PLAYER 2') return;
    const index = getBestMove();
    if (index !== null && index !== undefined) {
        updateCell(cells[index], index);
        checkResult();
    }
}