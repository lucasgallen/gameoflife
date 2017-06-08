import React from 'react';
import styles from '../../index.css';


class PlayPause extends React.Component {
    render() {
        return (
            <button className={styles.button} onClick={() => this.props.handleClick()}>{this.props.state}</button>
        );
    }
}

export default PlayPause;
