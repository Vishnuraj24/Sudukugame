document.addEventListener("DOMContentLoaded", () => {
  const sudokuBoard = document.getElementById("sudoku-board");
  const generateBtn = document.getElementById("generate-btn");
  const solveBtn = document.getElementById("solve-btn");
  const resetBtn = document.getElementById("reset-btn");

  let board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
  let initialBoard = [];

  function createBoard(board, initial = false) {
    sudokuBoard.innerHTML = "";
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        if (board[row][col] !== 0) {
          cell.textContent = board[row][col];
          cell.classList.add(initial ? "initial" : "solution");
        } else {
          const input = document.createElement("input");
          input.type = "number";
          input.min = 1;
          input.max = 9;
          cell.appendChild(input);
        }
        sudokuBoard.appendChild(cell);
      }
    }
  }

  function generateSudoku() {
    board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));
    initialBoard = JSON.parse(JSON.stringify(board));
    fillDiagonal();
    solveSudoku(board);
    removeKDigits();
    initialBoard = JSON.parse(JSON.stringify(board)); // Save the initial puzzle
    createBoard(board, true);
  }

  function fillDiagonal() {
    for (let i = 0; i < 9; i += 3) {
      fillBox(i, i);
    }
  }

  function fillBox(row, col) {
    let num;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        do {
          num = randomNumber(1, 9);
        } while (!isSafeToPlace(board, row + i, col + j, num));
        board[row + i][col + j] = num;
      }
    }
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isSafeToPlace(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false;
      }
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }

    return true;
  }

  function solveSudoku(board) {
    let emptySpot = findEmptyLocation(board);
    if (!emptySpot) {
      return true;
    }

    const [row, col] = emptySpot;
    for (let num = 1; num <= 9; num++) {
      if (isSafeToPlace(board, row, col, num)) {
        board[row][col] = num;
        if (solveSudoku(board)) {
          return true;
        }
        board[row][col] = 0;
      }
    }
    return false;
  }

  function findEmptyLocation(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  function removeKDigits() {
    let count = 40; // Number of cells to remove
    while (count !== 0) {
      let cellId = randomNumber(0, 80);
      let i = Math.floor(cellId / 9);
      let j = cellId % 9;
      if (board[i][j] !== 0) {
        board[i][j] = 0;
        count--;
      }
    }
  }

  function resetBoard() {
    createBoard(initialBoard, true);
  }

  generateBtn.addEventListener("click", generateSudoku);
  solveBtn.addEventListener("click", () => {
    solveSudoku(board);
    createBoard(board, false);
  });
  resetBtn.addEventListener("click", resetBoard);

  createBoard(board);
});
