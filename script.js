/*
Ashley Obman 
CS382 Modern Web Technologies 
2/29/2024

Purpose:
This script.js file contains Javascript code that implements a Connect 4 game with
the MVC model. The state of the game is stored in a JS data structure separate from the DOM (html file).

This code handles thing such as updating the game state, checking for player wins/draws, rendering
the game board dynamically, etc. 

Two events are used: DOMContentLoaded to initialize the game, and click to handle cell clicks.

JS is used to change the DOM by dynamically adding discs to the grid when players make a move, and by dynamically generating
the game board. When the game is reset, the game board is cleared and regenerated (elements are removed).

JS is used to change text contents of elements for the player turn text and game status text. These dynamically change based on the 
current state of the game. 

JS is used to dynamically change element styling by having Player 1 have red discs and Player 2 have yellow discs.

This game follows the standard rules of Connect 4 and is playable from start to finish.
*/


// Define variables
let currentPlayer = 1; // Player 1 will start the game
let gameOver = false;
const numRows = 6; // Size of Connect 4
const numCols = 7;
let gameBoardState = []; // The game board state stored separate from the DOM 

// PRE: No parameters are taken by this function.
// POST: The game board state is initialized as a 2D array filled with zeros. 
// Each element of the array represents a cell, 0 = empty cell.
function initializeGameBoardState() {
    gameBoardState = Array.from({ length: numRows }, () => Array(numCols).fill(0));
}

// PRE: This function takes the row, column, and player as parameters.
// POST: The game board state is updated after a disc is dropped by setting the value at the 
// specified row and column to the current player's number.
function updateGameBoardState(row, col, player) {
    gameBoardState[row][col] = player;
}

// PRE: No parameters are taken by this function.
// POST: The game board is reset to its empty state.
function resetGameBoardState() {
    initializeGameBoardState();
}

// PRE: The player is taken as a parameter.
// POST: Checks if the current player has won the game by checking the game board for 
// any winning combinations.
function checkWin(player) {

    // Check possible horizontal winning combo
    for (let row = 0; row < numRows; row++) {

        // Inner loop to iterate over each column, checking for at least 4
        // consecutive columns remaining to check for a horizontal win.
        for (let col = 0; col <= numCols - 4; col++) {
            if (gameBoardState[row][col] === player &&
                gameBoardState[row][col + 1] === player &&
                gameBoardState[row][col + 2] === player &&
                gameBoardState[row][col + 3] === player) {
                return true;
            }
        }
    }

    // Check possible vertical winning combo
    // Ensure there are at least 4 consecutive rows left to check for vertical win
    for (let row = 0; row <= numRows - 4; row++) {

        // Inner loop to iterate over each column
        for (let col = 0; col < numCols; col++) {
            if (gameBoardState[row][col] === player &&
                gameBoardState[row + 1][col] === player &&
                gameBoardState[row + 2][col] === player &&
                gameBoardState[row + 3][col] === player) {
                return true;
            }
        }
    }

    // Check for diagonal (top-left to bottom-right) win by iterating over each possible
    // starting position for a diagonal length of 4
    for (let row = 0; row <= numRows - 4; row++) {
        for (let col = 0; col <= numCols - 4; col++) {
            if (gameBoardState[row][col] === player &&
                gameBoardState[row + 1][col + 1] === player &&
                gameBoardState[row + 2][col + 2] === player &&
                gameBoardState[row + 3][col + 3] === player) {
                return true;
            }
        }
    }

    // Check diagonal (bottom-left to top-right) win with same logic as above
    for (let row = numRows - 1; row >= 3; row--) {
        for (let col = 0; col <= numCols - 4; col++) {
            if (gameBoardState[row][col] === player &&
                gameBoardState[row - 1][col + 1] === player &&
                gameBoardState[row - 2][col + 2] === player &&
                gameBoardState[row - 3][col + 3] === player) {
                return true;
            }
        }
    }

    return false; // No win
}

// PRE: No parameters are taken for this function.
// POST: Checks if the game has ended in a draw by checking if there are any 
// empty cells left on the gameboard.
function checkDraw() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (gameBoardState[row][col] === 0) {
                return false;
            }
        }
    }

    return true;
}

// PRE: No parameters are taken for this function.
// POST: The gameboard is rendered on the webpage by dynamically generating
// HTML elements to represent the cells. Each cell is created as a div element to identify
// its row and column position.
function renderGameBoard() {

    // Retrieve DOM game board element and clear contents
    const gameBoardContainer = document.getElementById('game-board');
    gameBoardContainer.innerHTML = '';

    // Iterate over each column of the game board and repeat the creation of columns and cells 
    // for each column
    for (let col = 0; col < numCols; col++) {
        const colDiv = document.createElement('div'); 
        colDiv.classList.add('col');

        // Iterate over each row of the game board and repeat the creation of cells for each row within
        // the current column
        for (let row = 0; row < numRows; row++) {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.setAttribute('data-row', row); // Identify row position
            cellDiv.setAttribute('data-col', col); // Identify column position
            colDiv.appendChild(cellDiv);
        }

        // Add the entire column to the game board 
        gameBoardContainer.appendChild(colDiv);
    }
}

// PRE: No parameters are taken for this function.
// POST: Updates the text of "player-turn" to indicate which player's turn it is.
function updatePlayerTurnText() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.textContent = `Player ${currentPlayer}'s Turn`;
}

// PRE: Takes the game status as a parameter (who is winning, or if there is a draw).
// POST: Updates the text of "game-status" to display the current game status.
function updateGameStatusText(status) {
    const gameStatusElement = document.getElementById('game-status');
    gameStatusElement.textContent = status;
}

// PRE: Takes event as a parameter. 
// POST: This function is triggered when a player clicks on a cell to drop their disc. It 
// gets the row and column indicies of the clicked cell, checks if that cell is empty, drops the current player's
// disc into the cell, checks for a win/draw, and updates the game state accordingly. 
function handleCellClick(event) {

    if (gameOver) return; // Game is already over
    const cell = event.target; // Retrieve the clicked cell

    // Retrieve the row/column index of clicked cell by paring value of data-row, convert to int
    const rowIndex = parseInt(cell.getAttribute('data-row'));
    const colIndex = parseInt(cell.getAttribute('data-col'));

    if (gameBoardState[rowIndex][colIndex] !== 0) return; // Cell already filled

    // Call function to drop a disc into the clicked cell
    dropDisc(rowIndex, colIndex, currentPlayer);

    // If the current player has won the game, the game ends.
    if (checkWin(currentPlayer)) {
        updateGameStatusText(`Player ${currentPlayer} Wins!`); // Update status
        gameOver = true; 

    // If draw, game ends and status is updated
    } else if (checkDraw()) {
        updateGameStatusText('Draw!');
        gameOver = true;

    // Neither a win/draw, game continues
    } else {

        // Toggle between players
        currentPlayer = currentPlayer === 1 ? 2 : 1;

        // Update player turn text
        updatePlayerTurnText();

        // Update disc color for the next player 
        updateDiscColor();
    }
}

// PRE: No parameters are taken by this function.
// POST: The text updates to show whose turn it is.
function updatePlayerTurnText() {
    const playerTurnElement = document.getElementById('player-turn');
    playerTurnElement.textContent = `Player ${currentPlayer}'s Turn`;
}

// PRE: No parameters are taken by this function.
// POST: The color of each disc is updated based on the current player.
// It adds/removes CSS classes to change the disc color accordingly. 
function updateDiscColor() {

    // Dynamically select all HTML elements with disc class and store in variable
    const discs = document.querySelectorAll('.disc');

    // For each disc element selected 
    discs.forEach(disc => {
        const cell = disc.parentElement; // Get parent of current disc (the cell where disc is located)
        const row = parseInt(cell.getAttribute('data-row')); // Get row index
        const col = parseInt(cell.getAttribute('data-col')); // Get col index
        const player = gameBoardState[row][col]; // Get player number based on row and col (which player's disc is in the current cell?)
        disc.classList.remove('player1-disc', 'player2-disc'); // Remove both player color classes to make sure color is updated correctly
        disc.classList.add(player === 1 ? 'player1-disc' : 'player2-disc'); // Add class based on player from game board state
    });
}

// PRE: Takes the row, column, and player as parameters.
// POST: Drops a disc into the specified row and column of the gameboard for the given player. 
// The gameboard array then gets updated and adds a disc element to the corresponding HTML cell.
function dropDisc(row, col, player) {

    let rowIndex = numRows - 1;

    // Iterate from top to bottom row on game board
    while (rowIndex < numRows) {

        // If cell is empty, occupy with player's disc
        if (gameBoardState[rowIndex][col] === 0) {
            gameBoardState[rowIndex][col] = player;
            updateGameBoardState(rowIndex, col, player); // Update
            const cell = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${col}"]`); // Select HTML cell element
            const disc = document.createElement('div'); 
            disc.classList.add('disc');
            cell.appendChild(disc); // Append to display on game board

            // Update disc color based on player turn
            disc.classList.add(currentPlayer === 1 ? 'player1-disc' : 'player2-disc');

            // Animate disc drop
            animateDiscDrop(disc);

            // Exit the loop once a disc is dropped
            break;
        }

        rowIndex--; // Move to next row
    }
}

// PRE: No parameters are taken by this function.
// POST: The game board is initialized by resetting the game board state, updating player turn text, 
// and setting the initial disc color (red for player 1).
function initializeGame() {
    initializeGameBoardState();
    renderGameBoard();
    updatePlayerTurnText();
    updateDiscColor(); // Initial disc color based on player 1's turn
}

// Event listeners DOMContentLoaded, click, and the reset game button
document.addEventListener('DOMContentLoaded', initializeGame);
document.getElementById('game-board').addEventListener('click', handleCellClick);
document.getElementById('reset-button').addEventListener('click', resetGame);


// PRE: No parameters are taken by this function.
// POST: The game board is reset to its initial state.
function resetGame() {
    gameOver = false;
    currentPlayer = 1;
    resetGameBoardState();
    renderGameBoard();
    updatePlayerTurnText();
    updateGameStatusText('');
}

// Function to animate disc drop
function animateDiscDrop(disc) {

    // Set initial position above the board
    disc.style.transform = 'translateY(-250px)';

    // Apply animation
    disc.style.animation = 'dropAnimation 1.5s forwards';
}




