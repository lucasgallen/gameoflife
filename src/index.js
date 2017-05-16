import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


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

    flipLifeState(rowNum, cellNum) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const historyCopy = JSON.parse(JSON.stringify(history));
        const current = historyCopy[historyCopy.length - 1];
        const rows = current.cellRows.slice();
        const cellsInRow = rows[rowNum].slice();

        cellsInRow[cellNum].isAlive = !cellsInRow[cellNum].isAlive;
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
        const history = JSON.parse(JSON.stringify(this.state.history));
        const current = history[history.length - 1];
        const rows = current.cellRows.slice();
        const newRows = getNewBoard(rows);

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

    const numRows = cellRows.length;

    for (let i=0;i<numRows;i++) {
        let cells = cellRows[i];
        let numCells = cells.length;

        for (let j=0;j<numCells;j++) {
            let tempNghb = 0;

            if (i-1>=0) {
                if (cellRows[i-1][j].isAlive)
                    tempNghb++;
                if (j+1<numCells) {
                    if (cellRows[i-1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[i-1][0].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[numRows-1][j].isAlive) {
                    tempNghb++;
                }
                if (j+1<numCells) {
                    if (cellRows[numRows-1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][0].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (j+1<numCells) {
                if (cellRows[i][j+1].isAlive) {
                    tempNghb++;
                }
                if (i+1<numRows) {
                    if (cellRows[i+1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][j+1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[i][0].isAlive) {
                    tempNghb++;
                }
                if (i+1<numRows) {
                    if (cellRows[i+1][0].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][0].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (i+1<numRows) {
                if (cellRows[i+1][j].isAlive) {
                    tempNghb++;
                }
                if (j-1>=0) {
                    if (cellRows[i+1][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[i+1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[0][j].isAlive) {
                    tempNghb++;
                }
                if (j-1>=0) {
                    if (cellRows[0][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (j-1>=0) {
                if (cellRows[i][j-1].isAlive) {
                    tempNghb++;
                }
                if (i-1>=0) {
                    if (cellRows[i-1][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][j-1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[i][numCells-1].isAlive) {
                    tempNghb++;
                }
                if (i-1>=0) {
                    if (cellRows[i-1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            }
            cellRows[i][j].nghbrCount = tempNghb;
        }
    }

    // Using nghbrCount, set isAlive according to
    // the Game of Life rules
    for (let i=0;i<numRows;i++) {
        let numCells = cellRows[i].length;

        for (let j=0;j<numCells;j++) {
            if (cellRows[i][j].isAlive) {
                if (cellRows[i][j].nghbrCount === 2 || cellRows[i][j].nghbrCount === 3) {
                    cellRows[i][j].isAlive = true;
                } else {
                    cellRows[i][j].isAlive = false;
                }
            } else {
                if (cellRows[i][j].nghbrCount === 3) {
                    cellRows[i][j].isAlive = true;
                }
            }
        }
    }


    return cellRows;
}

ReactDOM.render(
    <Game numRows={10} cellsPerRow={10} />,
    document.getElementById('root')
);
