import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Cell extends React.Component {
    constructor() {
        super();

        this.state = {
            isAlive: false
        };
    }

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
    constructor() {
        super();

        this.state = {
            rows: Array(10).fill(Array(10).fill(true))
        }
    }

    flipLifeState(rowNum, cellNum) {
        const rows = this.state.rows.slice();
        const cellsInRow = rows[rowNum].slice();

        cellsInRow[cellNum] = !cellsInRow[cellNum];
        rows[rowNum] = cellsInRow;

        this.setState({
            rows: rows
        });
    }

    render() {
        const cellRowCount = this.state.rows.length;
        const rows = [];

        for (let row=0; row<cellRowCount; row++) {
            let cellsInRow = this.state.rows[row];
            rows.push(
                <Row
                    key={'row' + row}
                    id={row}
                    cells={cellsInRow}
                    handleClick={(row, cell) => this.flipLifeState(row, cell)}
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
    // Steps through each board state
        // Check previous board state
        // Set the new state of the board for each cell
        // Save new state to old state
        // Render board with new state

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
