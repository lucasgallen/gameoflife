import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Cell extends React.Component {
    render() {
        const cellNum = this.props.cellNum;
        const rowNum = this.props.rowNum;

        return (
            <button className="cell" onClick={() => this.props.handleClick(rowNum, cellNum)}>
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
                    isAlive={cells[cellNum]}
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

class Game extends React.Component {
    constructor() {
        super();

        this.state = {
            history: [{
                cellRows: Array(10).fill(Array(10).fill(false))
            }],
            stepNumber: 0,
            isLive: false,
        };
    }

    flipLifeState(rowNum, cellNum) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const rows = current.cellRows.slice();
        const cellsInRow = rows[rowNum].slice();

        cellsInRow[cellNum] = !cellsInRow[cellNum];
        rows[rowNum] = cellsInRow;

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

    playGame() {
        this.setState({
            isLive: true
        });
    }

    pauseGame() {
        this.setState({
            isLive: false
        });
    }

    runGame() {
        const history = this.state.history.slice(0);
        const current = history[history.length - 1];
        const rows = current.cellRows.slice();

        this.setState({
            history: history.concat([{
                cellRows: getNewBoard(rows)
            }]),
            stepNumber: history.length
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const latest = history[history.length - 1];

        const steps = history.map((step, state) => {
            return (
                <li key={state}>
                    <a href="#" onClick={() => this.jumpTo(state)}>'board state'</a>
                </li>
            );
        });

        if (this.state.isLive) {
            setTimeout(() => this.runGame(latest.cellRows), 1000);
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={current.cellRows}
                        handleClick={(rowNum, cellNum) => this.flipLifeState(rowNum, cellNum)}
                    />
                </div>
                <button onClick={() => this.pauseGame()}>pause</button>
                <button onClick={() => this.playGame()}>play</button>
                <ol>{steps}</ol>
            </div>
        );
    }
}

function getNewBoard(cellRows) {
    // Check cell neighbors to assign cell to die or live
    // Returns new cellRows

    // TODO: Implement neighbor check

    return cellRows;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
