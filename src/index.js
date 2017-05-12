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

    flipLifeState() {
        this.setState({
            isAlive: !this.state.isAlive
        });
    }

    render() {
        return (
            <button className="cell" onClick={() => this.flipLifeState()}>
                {this.state.isAlive ? 1 : 0}
            </button>
        );
    }
}

class Row extends React.Component {
    renderCells(rowNum, cellsPerRow) {
        const newRow = [];

        for (let cellNum=0; cellNum<cellsPerRow; cellNum++) {
            newRow.push(
                <Cell key={[rowNum,cellNum]}/>
            );
        }

        return newRow;
    }

    render() {
        const cellsPerRow = 10;
        const rowId = this.props.id;

        return (
            <div className="cell-row">
                {this.renderCells(rowId, cellsPerRow)}
            </div>
        );
    }
}

class Board extends React.Component {
    render() {
        const cellRowCount = 10;
        const rows = [];

        for (let row=0; row<cellRowCount; row++) {
            rows.push(
                <Row key={'row' + row} id={row} />
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
