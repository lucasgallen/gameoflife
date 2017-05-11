import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Cell extends React.Component {
    render() {
        return (
            <button className="cell" onClick={() => alert('click')}>
                {this.props.value}
            </button>
        );
    }
}

class Row extends React.Component {
    renderCells(rowNum, cellsPerRow) {
        const newRow = [];

        for (let cellNum=0; cellNum<cellsPerRow; cellNum++) {
            newRow.push(
                <Cell key={[rowNum,cellNum]} value={0}/>
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
                <Row id={row} />
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
