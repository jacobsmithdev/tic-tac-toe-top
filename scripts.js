const gameboard = (function() {
    const BOARD_SIZE = 3;

    // Board formatted as [row][col]
    const board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    const getBoard = function() {
        return board;
    }

    // Function expects zero indexed input ([0] [1] [2], NOT [1], [2], [3])
    const isValidMove = function(row, col) {
        const outsideBoard = row >= BOARD_SIZE && col >= BOARD_SIZE;
        if (outsideBoard) return false;

        // Check array AFTER we ensure our (row, col) is within the board
        const celltaken = board[row][col] !== null;
        if (celltaken) return false;

        return true;
    };

    const addMove = function(row, col, char) {
        if (isValidMove(row, col)) {
            board[row][col] = char;
            return true;
        } else {
            return false;
        }
    };
    
    const resetBoard = function() {
        board.forEach(row => row.fill(null));
    };

    const rowHasWinner = function(playerIcon) {
        for (let row = 0; row < BOARD_SIZE; row++) {
            const rowItems = board[row];
            if (rowItems.every(item => item === playerIcon)) return true;
        }
    };

    const colHasWinner = function(playerIcon) {
        const firstRow = board[0];
        return firstRow.some((firstItem, col) => {
            let allItemsMatch = true;
            for (row = 0; row < BOARD_SIZE; row++) {
                const item = board[row][col];
                if (item !== playerIcon) allItemsMatch = false;
            }
            return allItemsMatch;
        });
    };

    const diagonalHasWinner = function(playerIcon) {
        // Algorithmically checking diagonals is possible, but a brute force 
        // check here is simpler since we only ever need to handle a 3x3 grid. 
        const downDiagonal = [
            board[0][0], 
            board[1][1], 
            board[2][2],
        ];
        
        const downDiagonalMatches = downDiagonal.every(item => item === playerIcon);
        if (downDiagonalMatches) return true;

        const upDiagonal = [
            board[2][0], 
            board[1][1], 
            board[0][2],
        ];
        
        const upDiagonalMatches = upDiagonal.every(item => item === playerIcon);
        if (upDiagonalMatches) return true;

        return false;
    };

    const isBoardFilled = function() {
        const boardFilled = board.every(row => {
            return row.every(item => item !== null);
        });
        return boardFilled;
    }

    const checkForWin = function(player) {
        if (rowHasWinner(player.icon) || colHasWinner(player.icon) || diagonalHasWinner(player.icon)) {
            return true;
        } else if (isBoardFilled()) {
            // If no winner exists and board is full, the game is a tie
            return null;
        } else {
            return false;
        }
    }

    return { 
        getBoard,
        addMove, 
        resetBoard, 
        checkForWin,
    }
})();

const gameController = (function(gameboard) {
    const player1 = {
        name: "player1",
        id: 0,
        icon: "X",
    };

    const player2 = {
        name: "player2",
        id: 1,
        icon: "O",
    };

    let currentPlayer = player1;

    const getCurrentPlayer = function() {
        return currentPlayer;
    }

    const switchCurrentPlayer = function() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = function(row, col) {
        const moveAdded = gameboard.addMove(row, col, currentPlayer.icon);
        if (!moveAdded) return;
        
        if (gameboard.checkForWin(currentPlayer)) {
            handleWin(currentPlayer);
        } else if (gameboard.checkForWin(currentPlayer) === null) {
            handleTie();
        } else {
            switchCurrentPlayer();
        }
    };

    const resetGame = function() {
        gameboard.resetBoard();
        currentPlayer = player1;
    }

    const handleWin = function() {
        resetGame();
    }

    const handleTie = function() {
        resetGame();
    }

    return {
        playRound,
        getCurrentPlayer,
    }
})(gameboard);

const displayController = (function() {
    const boardDisplay = document.querySelector('.board');
    const turnDisplay = document.querySelector('.turn');

    const updateDisplay = function() {
        boardDisplay.innerText = '';

        const board = gameboard.getBoard();

        board.forEach((row, rowIndex) => {
            row.forEach((item, colIndex) => {
                const cell = document.createElement('button');
                
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                cell.innerText = board[rowIndex][colIndex];

                boardDisplay.append(cell);
            });
        });

        const currentPlayer = gameController.getCurrentPlayer();
        turnDisplay.innerText = `( ${currentPlayer.icon} ) ${currentPlayer.name}'s turn:`
    };

    boardDisplay.addEventListener('click', (e) => {
        if (!e.target) return;
        gameController.playRound(e.target.dataset.row, e.target.dataset.col);
        updateDisplay();
    });

    updateDisplay();
})();