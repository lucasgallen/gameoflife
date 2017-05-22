import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const board =  require('./board.js');

class Cell extends React.Component {
    render() {
        const cellNum = this.props.cellNum;
        const rowNum = this.props.rowNum;

        return (
            <button
                className={this.props.isAlive ? 'cell alive' : 'cell'}
                onClick={() => this.props.handleClick(rowNum, cellNum)}
            >
                {this.props.isAlive ? 1 : 0}
            </button>
        );
    }
}

class Row extends React.Component {
    renderCells(rowNum, cells) {
        const newRow = [];

        for (let cellNum=0; cellNum<cells.length; cellNum++) {
            newRow.push(
                <Cell
                    key={[rowNum,cellNum]}
                    isAlive={cells[cellNum].isAlive}
                    cellNum={cellNum}
                    rowNum={rowNum}
                    handleClick={(rowNum, cellNum) => this.props.handleClick(rowNum,cellNum)}
                />
            );
        }

        return newRow;
    }

    render() {
        const cells = this.props.cells;
        const rowId = this.props.id;

        return (
            <div className="cell-row">
                {this.renderCells(rowId, cells)}
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        const cellRowCount = this.props.rows.length;
        const rows = [];

        for (let row=0; row<cellRowCount; row++) {
            let cellsInRow = this.props.rows[row];
            rows.push(
                <Row
                    key={'row' + row}
                    id={row}
                    cells={cellsInRow}
                    handleClick={(rowNum, cellNum) => this.props.handleClick(rowNum, cellNum)}
                />
            );
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class PlayPause extends React.Component {
    render() {
        return (
            <button onClick={() => this.props.handleClick()}>{this.props.state}</button>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        const numRows = this.props.numRows;
        const cellsPerRow = this.props.cellsPerRow;

        this.state = {
            history: [{
                cellRows: Array(numRows).fill(0).map(() => {
                        return Array(cellsPerRow).fill(0).map(() => {
                            return {
                                isAlive: false,
                                nghbrCount: 0
                            };
                        })
                    })
            }],
            stepNumber: 0,
            isLive: false,
        };
    }

    flipLifeState(rowNum, cellNum, timeoutID) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const historyCopy = JSON.parse(JSON.stringify(history));
        const current = historyCopy[historyCopy.length - 1];
        const rows = current.cellRows.slice();
        const cellsInRow = rows[rowNum].slice();

        cellsInRow[cellNum].isAlive = !cellsInRow[cellNum].isAlive;
        rows[rowNum] = cellsInRow;

        if (timeoutID) {
            clearTimeout(timeoutID);
        }

        this.setState({
            history: history.concat([{
                cellRows: rows
            }]),
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
        });
    }

    // Steps through each board state
        // Check previous board state
        // Set the new state of the board for each cell
        // Save new state to old state
        // Render board with new state

    toggleGame() {
        const isLive = this.state.isLive;

        this.setState({
            isLive: !isLive,
        });
    }

    runGame() {
        const history = JSON.parse(JSON.stringify(this.state.history));
        const current = history[history.length - 1];
        const rows = current.cellRows.slice();
        const newRows = board.getNewBoard(rows);

        this.setState({
            history: history.concat([{
                cellRows: newRows
            }]),
            stepNumber: history.length
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        let timeoutID = null;

        const steps = history.map((step, state) => {
            return (
                <li key={state}>
                    <a href="#" onClick={() => this.jumpTo(state)}>'board state'</a>
                </li>
            );
        });

        if (this.state.isLive) {
            timeoutID = setTimeout(() => this.runGame(), 500);
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={current.cellRows}
                        handleClick={(rowNum, cellNum) => this.flipLifeState(rowNum, cellNum, timeoutID)}
                    />
                </div>
                <PlayPause
                    handleClick={() => this.toggleGame()}
                    state={this.state.isLive ? 'Pause' : 'Play'}
                />
                <ol>{steps}</ol>
            </div>
        );
    }
}

ReactDOM.render(
    <Game numRows={10} cellsPerRow={10} />,
    document.getElementById('root')
);
