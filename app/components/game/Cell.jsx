import React from 'react';
import styles from '../../index.css';


class Cell extends React.Component {
    render() {
        const cellNum = this.props.cellNum;
        const rowNum = this.props.rowNum;

        return (
            <button
                className={this.props.isAlive ? styles.cellAlive : styles.cell}
                onClick={() => this.props.handleClick(rowNum, cellNum)}
            >
                {this.props.isAlive ? 1 : 0}
            </button>
        );
    }
}

export default Cell;
