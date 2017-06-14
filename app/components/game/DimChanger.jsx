import React from 'react';
import styles from '../../index.css';

class DimChanger extends React.Component {
    handleClick() {
        const numRows = parseInt(document.getElementById('numRows').value);
        const cellsPerRow = parseInt(document.getElementById('numCells').value);

        this.props.resetGame(numRows, cellsPerRow);
    }

    render() {
        return (
            <fieldset className={styles.dimensionField}>
                <legend>Game Dimensions</legend>

                <label htmlFor='Rows'>Number of Rows: <input id="numRows" type='number' min='3' max='20' name='Rows' placeholder={this.props.numRows} /></label>

                <label htmlFor='cellsPerRow'>Cells Per Row: <input id="numCells" type='number' min='3' max='20' name='cellsPerRow' placeholder={this.props.cellsPerRow} /></label>

                <button
                    onClick={() => this.handleClick()}
                >
                    Reset Game
                </button>
            </fieldset>
        );
    }
}

export default DimChanger;
