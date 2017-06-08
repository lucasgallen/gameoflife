import ReactDOM from 'react-dom';
import React from 'react';
import Game from './components/Game';


ReactDOM.render(
    <Game numRows={10} cellsPerRow={10} />,
    document.getElementById('root')
);
