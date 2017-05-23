import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import board from './board.js';
import './index.css';
import 'rc-slider/assets/index.css';

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
            <button className="button" onClick={() => this.props.handleClick()}>{this.props.state}</button>
        );
    }
}

class SpeedInput extends React.Component {
    render() {
        return (
            <label>
                <input type="radio"
                    value={this.props.value}
                    name="cycle speed"
                    checked={this.props.checked}
                    onChange={() => this.props.handleClick()}
                ></input>
                {this.props.name}
            </label>
        );
    }
}

class HistorySlider extends React.Component {
    render() {
        return (
            <fieldset className="history-slider">
                <legend>History Slider</legend>
                <div className="history-length">{this.props.max}</div>
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    onChange={(step) => this.props.handleChange(step)}
                />
            </fieldset>
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
            gameSpeed: 'normal',
        };
    }

    timeoutID = null;

    clearTimeout() {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = null;
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
        const newRows = board.getNewBoard(rows);

        this.setState({
            history: history.concat([{
                cellRows: newRows
            }]),
            stepNumber: history.length
        });
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

        const speedKey = {
            'slow' : 1500,
            'normal' : 1000,
            'fast' : 500
        }

        const gameSpeed = speedKey[this.state.gameSpeed];

        if (this.state.isLive) {
            this.timeoutID = setTimeout(() => this.runGame(), gameSpeed);
        }

        return (
            <div className="game">
                <div className="game-board">
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

                    <fieldset className="cycle-speed">
                        <legend>Life Cycle Speed</legend>
                        <SpeedInput
                            checked={this.state.gameSpeed === 'slow'}
                            name="slow"
                            handleClick={() => this.updateSpeed('slow')}
                        />
                        <SpeedInput
                            checked={this.state.gameSpeed === 'normal'}
                            name="normal"
                            handleClick={() => this.updateSpeed('normal')}
                        />
                        <SpeedInput
                            checked={this.state.gameSpeed === 'fast'}
                            name="fast"
                            handleClick={() => this.updateSpeed('fast')}
                        />
                    </fieldset>

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

ReactDOM.render(
    <Game numRows={10} cellsPerRow={10} />,
    document.getElementById('root')
);
