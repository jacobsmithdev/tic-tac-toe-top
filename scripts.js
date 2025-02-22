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

const createPlayer = function(name, id, icon) {
    return {
        name,
        id,
        icon
    };
}

const createGameController = function(gameboard, player1, player2) {
    let gameOver = true;

    let currentPlayer = player1;

    const getCurrentPlayer = function() {
        return currentPlayer;
    }

    const switchCurrentPlayer = function() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const playRound = function(row, col) {
        if (gameOver) return;
        const moveAdded = gameboard.addMove(row, col, currentPlayer.icon);
        if (!moveAdded) return;
        
        if (gameboard.checkForWin(currentPlayer)) {
            gameOver = true;
        } else if (gameboard.checkForWin(currentPlayer) === null) {
            gameOver = true;
        } else {
            switchCurrentPlayer();
        }
    };

    const resetGame = function() {
        gameOver = false;
        gameboard.resetBoard();
        currentPlayer = player1;
    }

    return {
        playRound,
        getCurrentPlayer,
        resetGame,
    }
};

const displayController = (function() {
    const boardDisplay = document.querySelector('.board');
    const turnDisplay = document.querySelector('.turn');
    const startBtn = document.querySelector('.start');
    const resultDisplay = document.querySelector('.result');

    const player1 = createPlayer('player1', 0, 'X');
    const player2 = createPlayer('player2', 1, 'O');

    const gameController = createGameController(gameboard, player1, player2);

    const updateDisplay = function() {
        updateBoardDisplay();
        const currentPlayer = gameController.getCurrentPlayer();
        turnDisplay.innerText = `( ${currentPlayer.icon} ) ${currentPlayer.name}'s turn:`
    };

    const updateBoardDisplay = function() {
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
    };

    boardDisplay.addEventListener('click', (e) => {
        if (!e.target) return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        gameController.playRound(row, col);
        const currentPlayer = gameController.getCurrentPlayer();

        const hasWinner = gameboard.checkForWin(currentPlayer);
        if (hasWinner) handleWinner(currentPlayer);
        if (hasWinner === null) handleTie();
        updateDisplay();
    });

    startBtn.addEventListener('click', (e) => {
        gameController.resetGame();
        startBtn.innerText = 'Restart';
        resultDisplay.innerText = '';
        updateDisplay();
    });

    const handleWinner = function(winner) {
        resultDisplay.innerText = `${winner.name} (${winner.icon}) wins!`;
    }
    
    const handleTie = function() {
        resultDisplay.innerText = 'tie!';
    }

    updateDisplay();
})();