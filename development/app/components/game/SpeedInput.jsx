import React from 'react';

class SpeedInput extends React.Component {
    render() {
        return (
            <label>
                <input type='radio'
                    value={this.props.value}
                    name='cycle speed'
                    checked={this.props.checked}
                    onChange={() => this.props.handleClick()}
                ></input>
                {this.props.name}
            </label>
        );
    }
}

export default SpeedInput;
