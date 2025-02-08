const gameboard = (function() {
    // Board formatted as [row][col]
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const logBoard = function() {
        console.table(board);
    };

    const isValidMove = function(row, col) {
        if (board[row][col]) return false;
        return true;
    };

    const addMove = function(row, col, char) {
        board[row][col] = char;
    };
    
    const resetBoard = function() {
        board.forEach(row => row.fill(null));
    };

    const rowHasWinner = function() {
        return board.some(row => {
            const allItemsMatch = row.every(item => item === row[0]);
            return allItemsMatch && !row.includes(null);
        });
    };

    return { 
        logBoard, 
        isValidMove, 
        addMove, 
        resetBoard, 
    }
})();