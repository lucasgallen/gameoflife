import React from 'react';

import Board from './game/Board';
import PlayPause from './game/PlayPause';
import SpeedInput from './game/SpeedInput';
import HistorySlider from './game/HistorySlider';
import DimChanger from './game/DimChanger';

import board from '../board.js';
import styles from '../index.css';


let timeoutID = null;

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
                    });
                })
            }],
            numRows: numRows,
            cellsPerRow: cellsPerRow,
            stepNumber: 0,
            isLive: false,
            gameSpeed: 'normal',
        };
    }

    resetGame(rows, cells) {
        const numRows = rows ? rows : this.state.numRows;
        const cellsPerRow = cells ? cells : this.state.cellsPerRow;

        this.clearTimeout();

        this.setState({
            history: [{
                cellRows: Array(numRows).fill(0).map(() => {
                    return Array(cellsPerRow).fill(0).map(() => {
                        return {
                            isAlive: false,
                            nghbrCount: 0
                        };
                    });
                })
            }],

            stepNumber: 0,
            isLive: false,
            numRows: numRows,
            cellsPerRow: cellsPerRow,
        });
    }

    clearTimeout() {
        if (timeoutID) {
            clearTimeout(timeoutID);
            timeoutID = null;
        }
    }

    updateSpeed(speed) {
        this.clearTimeout();

        this.setState({
            gameSpeed: speed
        });
    }

    flipLifeState(rowNum, cellNum) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const historyCopy = JSON.parse(JSON.stringify(history));
        const current = historyCopy[historyCopy.length - 1];
        const rows = current.cellRows.slice();
        const cellsInRow = rows[rowNum].slice();

        cellsInRow[cellNum].isAlive = !cellsInRow[cellNum].isAlive;
        rows[rowNum] = cellsInRow;

        this.clearTimeout();

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

    slideHistory(step) {
        if (this.state.isLive) {
            this.toggleGame();
        }

        this.jumpTo(step);
    }

    // TODO: update comments
    // Steps through each board state
        // Check previous board state
        // Set the new state of the board for each cell
        // Save new state to old state
        // Render board with new state

    toggleGame() {
        const isLive = this.state.isLive;

        this.clearTimeout();

        this.setState({
            isLive: !isLive,
        });
    }

    runGame() {
        const history = JSON.parse(JSON.stringify(this.state.history));
        const current = history[history.length - 1];
        const rows = current.cellRows.slice();
        const newBoard = board.getNewBoard(rows);

        this.setState({
            history: history.concat([{
                cellRows: newBoard.rows
            }]),
            stepNumber: history.length
        });

        if (newBoard.allCellsDead) {
            this.toggleGame();
        }
    }

    handleMouseDown(e) {
        let initPos = {
            x: e.clientX,
            y: e.clientY,
        };
        let changedCells = [];
        let isPaused = false;

        const self = this;
        const deltaTrigger = 15;

        function handleMouseMove(e) {
            const currentPos = {
                x: e.clientX,
                y: e.clientY
            };

            const deltaX = currentPos.x - initPos.x;
            const deltaY = currentPos.y - initPos.y;
            const distance = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));

            if (distance > deltaTrigger) {
                const cell = document.elementFromPoint(currentPos.x, currentPos.y);

                if (changedCells.indexOf(cell) === -1) {
                    changedCells.push(cell);
                    cell.click();
                }

                if (self.state.isLive) {
                    self.toggleGame();
                    isPaused = true;
                }

                initPos.x = currentPos.x;
                initPos.y = currentPos.y;
            }

            e.preventDefault();
        }

        function handleMouseUp(e) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            if (isPaused) {
                self.toggleGame();
            }

            e.preventDefault();
        }

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        e.preventDefault();
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const numRows = this.state.numRows;
        const cellsPerRow = this.state.cellsPerRow;

        const speedKey = {
            'slow' : 1500,
            'normal' : 1000,
            'fast' : 500
        };

        const gameSpeed = speedKey[this.state.gameSpeed];

        const width = cellsPerRow * 50 + 'px';
        const gameDim = {
            width: width
        };

        if (this.state.isLive) {
            timeoutID = setTimeout(() => this.runGame(), gameSpeed);
        }

        return (
            <div className='game'>
                <div
                    className={styles.gameBoard}
                    style={gameDim}
                >
                    <div
                        onMouseDownCapture={(e) => this.handleMouseDown(e)}
                    >
                        <Board
                            rows={current.cellRows}
                            handleClick={(rowNum, cellNum) => this.flipLifeState(rowNum, cellNum)}
                        />
                    </div>

                    <PlayPause
                        handleClick={() => this.toggleGame()}
                        state={this.state.isLive ? 'Pause' : 'Play'}
                    />

                    <fieldset className={styles.cycleSpeed}>
                        <legend>Life Cycle Speed</legend>
                        <SpeedInput
                            checked={this.state.gameSpeed === 'slow'}
                            name='slow'
                            handleClick={() => this.updateSpeed('slow')}
                        />
                        <SpeedInput
                            checked={this.state.gameSpeed === 'normal'}
                            name='normal'
                            handleClick={() => this.updateSpeed('normal')}
                        />
                        <SpeedInput
                            checked={this.state.gameSpeed === 'fast'}
                            name='fast'
                            handleClick={() => this.updateSpeed('fast')}
                        />
                    </fieldset>

                    <DimChanger
                        numRows={numRows}
                        cellsPerRow={cellsPerRow}
                        resetGame={(rows,cells) => this.resetGame(rows,cells)}
                    />

                    <HistorySlider
                        min={1}
                        max={history.length - 1}
                        handleChange={(step) => this.slideHistory(step)}
                    />
                </div>
            </div>
        );
    }
}

export default Game;
