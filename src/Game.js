import React from 'react';
import './Game.css';
const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

/*
 * The Cells' coordinates reference axis is the window
 *
 *      	             x
 *   	 ------------->
 *	 	|
 *   	|
 *   	|
 *   	|
 *   	v
 *   y
 *
 *
 *	Conversely, the board's reference is
 *
 *      	             y
 *   	 ------------->
 *	 	|
 *   	|
 *   	|
 *   	|
 *   	v
 *   x
 *
 */
class Cell extends React.Component {
	render() {
		const {x, y } = this.props;
		return (
				<div className="Cell"
						style={{
						        left: `${CELL_SIZE * x + 1}px`,
                				top: `${CELL_SIZE * y + 1}px`,
                				width: `${CELL_SIZE - 1}px`,
								height: `${CELL_SIZE - 1}px`,
							}}
					>
				</div>
			)
	}
}

class Game extends React.Component {
	constructor(props)
	{
		super(props);
		this.rows = HEIGHT / CELL_SIZE;
		this.columns = WIDTH / CELL_SIZE;
		this.board = this.makeEmptyBoard();

		this.state = {
			running: false,
			interval: 500,
			cells: [],
		};
	}

	makeCells() {
		let cells = []
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++)
			{
				if (this.board[i][j])
				{
					cells.push({x: j, y: i})
				}
			}
		}
		return cells;
	}

	handleClick = (event) =>
	{
		// Getting element reference coordinates
		let rect = this.boardRef.getBoundingClientRect();

		let actualCoord = {x: event.clientX - rect.left, y: event.clientY - rect.top};
		let cellCoord = {x: Math.floor(actualCoord["x"] / CELL_SIZE), y: Math.floor(actualCoord["y"] / CELL_SIZE)};

		// x and y are reversed in the board
		this.board[cellCoord.y][cellCoord.x] = !this.board[cellCoord.y][cellCoord.x];

		this.setState({cells: this.makeCells()});

	}

	makeEmptyBoard() {
		let board = [];
		for (let i = 0; i < this.rows; i++)
		{
			board[i] = [];
			for (let j = 0; j < this.columns; j++)
			{
				board[i][j] = false;
			}
		}
		return board;
	}

	countNeighbors(x, y)
	{
		let num_neighbors = 0;
		const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

		for (let i = 0; i < dirs.length; i++)
		{
			const dir = dirs[i];
			let n = x + dir[0];
			let p = y + dir[1];
			if (0 <= n && n < this.rows && 0 <= p && p < this.columns)
			{
				num_neighbors += +this.board[n][p];
			}
		}
		return num_neighbors;
	}

	// Running every this.state.interval ms when game on
	runIteration = () => {
		console.log("Running game")
		let newBoard = this.makeEmptyBoard();
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++)
			{
				let num_neighbors = this.countNeighbors(i, j);
				if (num_neighbors < 2 || num_neighbors > 3)
				{
					newBoard[i][j] = false;
				}
				else if (num_neighbors === 3)
				{
					newBoard[i][j] = true;
				}
				else
				{
					newBoard[i][j] = this.board[i][j];
				}
			}
		}
		this.board = newBoard;
		this.setState({cells: this.makeCells()})

        this.timeoutHandler = window.setTimeout(() => {
            		this.runIteration();
			}, this.state.interval);

	}

	runGame = () => {
		if (this.state.running)
		{
			return ;
		}
		this.setState({running: true});
		this.runIteration()
	}

	stopGame = () => {
		this.setState({running: false})
        if (this.timeoutHandler)
        {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
		}
		console.log("Game stopped");
	}

	handleRandom = () => {
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++)
			{
				this.board[i][j] = Math.floor(Math.random() * 2);
			}
		}
		this.setState({cells: this.makeCells()});
	}

	handleClear = () => {
		this.board = this.makeEmptyBoard();
		this.setState({cells: []});
		this.stopGame();
	}

	render() {
    	const cells = this.state.cells;
    	const running = this.state.running;
	    return (
	          <div>
	                <div className="Board"
	                	 style={{ width: WIDTH, height: HEIGHT,
	                	 		backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
	                	 onClick={this.handleClick}
	                	 // Hack to get board coordinates reference and not underlying cell
	                	 ref={elem => this.boardRef = elem}
	                	 >
	                	 {
	                	 	cells.map(cell => (
	                	 					<Cell x={cell.x} y={cell.y} key={cell.x + cell.y * this.columns}/>
	                	 					)
	                	 			)
	                	}
	                </div>
	                <div className="Controls">
	                	<button className="gameState" style={{color: running ? `#5cb884` : `red`,
	                										  backgroundColor: running ? `#5cb884` : `red`,
	                										  borderColor: running ? `#5cb884` : `red`,
	                										  borderRadius: `20px`,}}
	                										   > "" </button>
	                	<button className="button" onClick={this.runGame}> Run </button>
	                	<button className="button" onClick={this.stopGame}> Stop </button>
	                	<button className="button" onClick={this.handleRandom}> Random </button>
	                	<button className="button" onClick={this.handleClear}> Clear </button>
	                </div>
	          </div>
	            );
	          }
	    }

export default Game;