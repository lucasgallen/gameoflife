
exports.getNewBoard = getNewBoard;

function getNewBoard(cellRows) {
    // Check cell neighbors to assign cell to die or live
    // Args cellRows Array
    // Returns new cellRows

    const numRows = cellRows.length;

    for (let i=0;i<numRows;i++) {
        let cells = cellRows[i];
        let numCells = cells.length;

        for (let j=0;j<numCells;j++) {
            let tempNghb = 0;

            if (i-1>=0) {
                if (cellRows[i-1][j].isAlive)
                    tempNghb++;
                if (j+1<numCells) {
                    if (cellRows[i-1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[i-1][0].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[numRows-1][j].isAlive) {
                    tempNghb++;
                }
                if (j+1<numCells) {
                    if (cellRows[numRows-1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][0].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (j+1<numCells) {
                if (cellRows[i][j+1].isAlive) {
                    tempNghb++;
                }
                if (i+1<numRows) {
                    if (cellRows[i+1][j+1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][j+1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[i][0].isAlive) {
                    tempNghb++;
                }
                if (i+1<numRows) {
                    if (cellRows[i+1][0].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][0].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (i+1<numRows) {
                if (cellRows[i+1][j].isAlive) {
                    tempNghb++;
                }
                if (j-1>=0) {
                    if (cellRows[i+1][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[i+1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[0][j].isAlive) {
                    tempNghb++;
                }
                if (j-1>=0) {
                    if (cellRows[0][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[0][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            }
            if (j-1>=0) {
                if (cellRows[i][j-1].isAlive) {
                    tempNghb++;
                }
                if (i-1>=0) {
                    if (cellRows[i-1][j-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][j-1].isAlive) {
                        tempNghb++;
                    }
                }
            } else {
                if (cellRows[i][numCells-1].isAlive) {
                    tempNghb++;
                }
                if (i-1>=0) {
                    if (cellRows[i-1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                } else {
                    if (cellRows[numRows-1][numCells-1].isAlive) {
                        tempNghb++;
                    }
                }
            }
            cellRows[i][j].nghbrCount = tempNghb;
        }
    }

    // Using nghbrCount, set isAlive according to
    // the Game of Life rules
    for (let i=0;i<numRows;i++) {
        let numCells = cellRows[i].length;

        for (let j=0;j<numCells;j++) {
            if (cellRows[i][j].isAlive) {
                if (cellRows[i][j].nghbrCount === 2 || cellRows[i][j].nghbrCount === 3) {
                    cellRows[i][j].isAlive = true;
                } else {
                    cellRows[i][j].isAlive = false;
                }
            } else {
                if (cellRows[i][j].nghbrCount === 3) {
                    cellRows[i][j].isAlive = true;
                }
            }
        }
    }


    return cellRows;
}
