import React from 'react';
import Row from './Row';


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

export default Board;
