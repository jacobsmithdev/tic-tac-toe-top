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

    return { 
        logBoard, 
        isValidMove, 
        addMove, 
        resetBoard, 
    }
})();