import React, { Component } from 'react';
import Board from './game';
import './index.css';

// size of each tile
const GRID_SIZE = 40;

/**
 * Tile component
 * It renders a single tile on board
 */
class Tile extends Component {
  render() {
    /**
     * Tile class based on value of tile
     * 0 for EMPTY
     * 1 for MARIO
     * 2 for BUN
     */
    const tileClass = {
      0: '',
      1: ' tile-mario',
      2: ' tile-bun',
    };

    const value = this.props.value;
    const style = {
      top: this.props.row * GRID_SIZE,
      left: this.props.col * GRID_SIZE
    };

    return (
      <div className={`tile${tileClass[value]}`} style={style} ></div>
    );
  }
}

/**
 * Maze component
 * It renders the whole game board
 */
class Maze extends Component {
  constructor(props) {
    super(props)
    this.state = { board: [] };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  /**
   * @description Update game board
   * @param {object} status - board status after each move 
   * @param {boolean} status.win - has user won or not in this move 
   * @param {object[]} status.updates - updates required for completing move 
   * @param {number} status.updates.value - new value for elem to update 
   * @param {object} status.updates.coord - coordinate of elem to update 
   * @param {number} status.updates.coord.x - x coordinate 
   * @param {number} status.updates.coord.y - y coordinate 
   */
  updateBoard(status) {
    let board = this.props.game.board;
    
    // if winning move display alert
    if (status.win) {
      const steps = this.props.game.noOfMoves;
      alert('Game over. Total move to save princess: ' + steps);
    }

    // update board elems according to status updates
    for (let i = 0; i < status.updates.length; i++) {
      const x = status.updates[i].coord.x;
      const y = status.updates[i].coord.y;
      const value = status.updates[i].value;
      
      board[x][y] = value;
    }
    // update state
    this.setState({ board });
  }

  /**
   * @description Handels every key press to make
   * Mario move
   * @param {object} event - React synthetic event
   */
  handleKeyPress(event) {
    event.preventDefault();
    let status;
    
    switch (event.key) {
      case 'ArrowUp':
        status = this.props.game.moveUp();
        this.updateBoard(status);
        break;
      case 'ArrowDown':
        status = this.props.game.moveDown();
        this.updateBoard(status);
        break;
      case 'ArrowLeft':
        status = this.props.game.moveLeft();
        this.updateBoard(status);
        break;
      case 'ArrowRight':
        status = this.props.game.moveRight();
        this.updateBoard(status);
        break;
      default:
    }
  }

  componentWillMount() {
    // start listning to keypress
    document.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    // stop listning to keypress
    document.removeEventListener('kepress', this.handleKeyPress);
  }

  render() {
    const board = this.state.board.length
      ? this.state.board : this.props.game.board; 
    const rows = board.length;
    const cols = board[0].length;

    const style = {
      height: rows * GRID_SIZE,
      width: cols * GRID_SIZE
    };
    
    const tiles = [];

    // construct board using tiles from board matrix
    board.forEach((col, i) => {
      col.forEach((elem, j) => {
        const key = i.toString() + j.toString();
        tiles.push(<Tile key={key} row={i} col={j} value={elem}/>);
      });
    });

    return (
      <div className='maze' style={style} >{tiles}</div>
    );
  }
}

/**
 * Game component
 * It inits and renders whole
 * Mario-Maze game
 */
class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      game: null
    };
    this.createPrompt = this.createPrompt.bind(this);
    // this.validateDimensions = this.validateDimensions.bind(this);
  }

  /**
   * @description Validates the dimention of game board
   * @param {*} rows - Number of rows 
   * @param {*} cols - Number of cols
   * @returns {boolean}
   */
  validateDimensions(rows, cols) {
    rows = parseInt(rows, 10);
    cols = parseInt(cols, 10)
    if (isNaN(rows) || isNaN(cols)) {
      return false;
    }
    return !(rows < 1 || cols < 1);
  }

  /**
   * Creates JS prompt for taking
   * game board dimensions as input form player
   */
  createPrompt() {
    let isValidDimension = false;
    let rows, cols;
    
    /**
     * Keep taking input from user
     * it user gives a valid input
     */
    while (!isValidDimension) {
      rows = prompt('Please enter board Height', 3);
      cols = prompt('Please enter board Width', 3);

      isValidDimension = this.validateDimensions(rows, cols);
      if(!isValidDimension) alert('Invalid height or width');
    }

    this.setState({
      game: new Board({rows, cols})
    });
  }

  componentDidMount() {
    this.createPrompt();
  }  

  render() {
    const mazeElem = (
      <div>
        <Maze game={this.state.game} />
      </div>
    );

    const greetElem = (
      <div>Welcome to Mario Maze</div>
    );

    /**
     * If game state is not there
     * show greetings else render game board
     */
    return this.state.game ? mazeElem : greetElem;
  }
}

export default Game;
