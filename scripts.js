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

    const diagonalHasWinner = function() {
        // Algorithmically checking diagonals is possible, but a brute force 
        // check here is simpler since we only ever need to handle a 3x3 grid. 
        const downDiagonal = [
            board[0][0], 
            board[1][1], 
            board[2][2],
        ];
        
        const downDiagonalMatches = downDiagonal.every(item => item === downDiagonal[0]);
        if (!downDiagonal.includes(null) && downDiagonalMatches) return true;

        const upDiagonal = [
            board[2][0], 
            board[1][1], 
            board[0][2],
        ];
        
        const upDiagonalMatches = upDiagonal.every(item => item === upDiagonal[0]);
        if (!upDiagonal.includes(null) && upDiagonalMatches) return true;

        return false;
    };

    const isBoardFilled = function() {
        const boardFilled = board.every(row => {
            return row.every(item => item !== null);
        });
        return boardFilled;
    }

    const hasWinner = function() {
        if (rowHasWinner() || colHasWinner() || diagonalHasWinner()) {
            return true;
        } else if (isBoardFilled()) {
            // If no winner exists and board is full, the game is a tie
            return null;
        } else {
            return false;
        }
    }

    return { 
        logBoard, 
        isValidMove, 
        addMove, 
        resetBoard, 
        hasWinner,
    }
})();