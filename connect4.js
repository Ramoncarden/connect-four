/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  // for (let y = 0; y < HEIGHT; y++) {
  //   board.push([ ...Array(WIDTH) ]);
  // }
  // return board;
  for (let y = 0; y < HEIGHT; y++) {
    board.push([]);
    for (let x = 0; x < WIDTH; x++) {
      board[y].push(null);
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  // create top table row element that will be used to play round
  let top = document.createElement('tr');
  // set id for table row element
  top.setAttribute('id', 'column-top');
  // add Event listener to table row element
  top.addEventListener('click', handleClick);

  // Create top td elements and assign unique id to each
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    headCell.style.backgroundColor = 'gold';
    top.append(headCell);
    headCell.onmouseenter = function() {
      if (currPlayer === 1) {
        this.style.backgroundColor = 'teal';
      } else {
        this.style.backgroundColor = '#eb6734';
      }
    };
    headCell.onmouseleave = function() {
      return (this.style.backgroundColor = 'gold');
    };
  }
  // Append the top row and cells to gameboard
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Add table rows to the rest of gameboard and append the rest of gameboard squares. Assign individual id to each game pieces to serve as coordinates.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      cell.style.backgroundColor = '#f8f8ff';
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const makeCircle = document.createElement('div');
  makeCircle.classList.add('piece');
  makeCircle.classList.add(`player${currPlayer}`);

  // get coordinates
  const coordinate = document.getElementById(`${y}-${x}`);
  coordinate.append(makeCircle);
}

/** endGame: announce game end */

function endGame(msg) {
  setTimeout(() => {
    alert(msg);
  }, 1000);
  setTimeout(() => {
    location.reload();
  }, 1001);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  const notNull = (val) => val !== null;
  // const isNotNull = (curVal) => curVal !== null;
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board[0].every(notNull)) {
    return endGame('Tie Game!');
  }
  // if (board[0].every(isNotNull)) {
  //   return endGame("It's a tie!");
  // }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
      const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
      const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
      const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
