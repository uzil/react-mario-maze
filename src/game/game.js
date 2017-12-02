/**
 * @file Contains the whole game engine
 */

/**
 * @description Generate a ramdom number
 * form given limit
 * @param {number} lowest - lowest limit 
 * @param {number} highest - heighest limit
 */

function rand( lowest, highest){
  var adjustedHigh = (highest - lowest) + 1;       
  return Math.floor(Math.random()*adjustedHigh) + parseFloat(lowest);
}

/**
 * @description Board game class
 * hosts all the methods and logics for
 * game to work.
 * Every init creates a new board game
 * @param {object} dimensions - dimension of game board
 * @param {number} dimensions.rows - no. of rows
 * @param {number} dimensions.cols - no. of columns
 * @returns {Board}
 */
const Board = function (dimensions) {
  this.mario = null; // position of mario {x: x-coord, y: y-coord};
  this.noOfMoves = 0; // no of steps legal mario moved
  // total no of buns to drop on board
  this.noOfBuns = rand(1, Math.floor(dimensions.rows * dimensions.rows) / 2);
  this.board = this.createBoard(dimensions);
  this.placeMario(this.board, dimensions);
  this.placeBuns(this.noOfBuns, this.board, dimensions);
};

/**
 * Values corresponding to
 * each actor in game
 */
Board.EMPTY = 0;
Board.MARIO = 1;
Board.BUN = 2;

/**
 * @description Create empty board matrix
 * @param {object} dimensions - dimension of game matrix
 * @param {number} dimensions.rows - no. of rows
 * @param {number} dimensions.cols - no. of columns
 * @returns {object} - empty board matrix
 */
Board.prototype.createBoard = function (dimensions) {
  const matrix = [];
  
  for (let i = 0; i < dimensions.rows; i++) {
    matrix[i] = [];
    for (let j = 0; j < dimensions.cols; j++) {
      matrix[i][j] = Board.EMPTY;
    }
  }

  return matrix;
};

/**
 * @description Place a actor at random point on
 * given matrix 
 * @param {number} elem - Actors - MARIO, BUN, EMPTY 
 * @param {array} matrix - game board matrix 
 * @param {object} dimensions - dimension of board matrix
 * @param {object} coord - Position of elem which has been placed
 */
Board.prototype.placeElem = function (elem, matrix, dimensions) {
  let coord = null;
  while (!coord) {
    const i = rand(0, dimensions.rows - 1);
    const j = rand(0, dimensions.cols - 1);

    if (matrix[i][j] === Board.EMPTY) {
      matrix[i][j] = elem;
      coord = {x: i, y: j};
    }
  }
  
  return coord;
}

/**
 * @description Place a mario on game board
 * and set mario coordinates
 * @param {array} matrix - game board matrix 
 * @param {object} dimensions - dimension of board matrix 
 */
Board.prototype.placeMario = function (matrix, dimensions) {
  this.mario = this.placeElem(Board.MARIO, matrix, dimensions);
};

/**
 * @description Place buns on game board
 * @param {number} noOfBuns - Total no of buns to place on board 
 * @param {array} matrix - game board matrix 
 * @param {object} dimensions - dimension of board matrix 
 */
Board.prototype.placeBuns = function (noOfBuns, matrix, dimensions) {
  const _this = this;
  for (let i = noOfBuns; i > 0; i--) {
    _this.placeElem(Board.BUN, matrix, dimensions);
  }
};

/**
 * @description Check if a given move in game is legal
 * @param {number} x - x coord of move 
 * @param {number} y - y coord of move
 * @returns {boolean}
 */
Board.prototype.isLegalMove = function (x, y) {
  const rows = this.board.length;
  const cols = this.board[0].length;

  const upperLimit = (x < rows && y < cols);
  const lowerLimit = (x >= 0 && y >= 0);
  
  return (upperLimit && lowerLimit);
};

/**
 * Check if player won
 */
Board.prototype.hasWon = function () {
  // if no buns are left player wins
  return !this.noOfBuns;
}; 

/**
 * @description Move to given coordinates on game board
 * @param {number} x - x coord of move 
 * @param {number} y - y coord of move
 * @returns {object} moves - object containing changes for
 * game board after move
 */
Board.prototype.move = function (x, y) {
  const moves = {
    win: false,
    updates: []
  };

  // if move is not legal return with no updates
  if (!this.isLegalMove(x, y)) return moves;
  this.noOfMoves++;
  
  // clear tile on which mario was
  moves.updates.push({
    coord: {x: this.mario.x, y: this.mario.y},
    value: Board.EMPTY
  });

  // if buns are found eat them
  if (this.board[x][y] === Board.BUN) {
    this.noOfBuns--;
  }

  // check if won
  if (this.hasWon()) moves.win = true;

  // mario new position
  this.mario.x = x;
  this.mario.y = y;
  moves.updates.push({
    coord: {x, y},
    value: Board.MARIO
  });

  return moves;
};

Board.prototype.moveUp = function () {
  return this.move(this.mario.x - 1, this.mario.y);
};
Board.prototype.moveDown = function () {
  return this.move(this.mario.x + 1, this.mario.y);
};
Board.prototype.moveLeft = function () {
  return this.move(this.mario.x, this.mario.y - 1);
};
Board.prototype.moveRight = function () {
  return this.move(this.mario.x, this.mario.y + 1);
};

export default Board;