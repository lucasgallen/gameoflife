import React from 'react';
import Slider from 'rc-slider';
import styles from '../../index.css';
import 'rc-slider/assets/index.css';


class HistorySlider extends React.Component {
    render() {
        return (
            <fieldset className='history-slider'>
                <legend>History Slider</legend>
                <div className={styles.historyLength}>{this.props.max}</div>
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    onChange={(step) => this.props.handleChange(step)}
                />
            </fieldset>
        );
    }
}

export default HistorySlider;
