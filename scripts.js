const gameboard = (function() {
    const BOARD_SIZE = 3;

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

    const colHasWinner = function() {
        const firstRow = board[0];
        return firstRow.some((firstItem, col) => {
            let allItemsMatch = true;
            for (row = 0; row < BOARD_SIZE; row++) {
                const item = board[row][col];
                if (item !== firstItem) allItemsMatch = false;
            }
            return firstItem !== null && allItemsMatch;
        });
    };

    return { 
        logBoard, 
        isValidMove, 
        addMove, 
        resetBoard, 
    }
})();