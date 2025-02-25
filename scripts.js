const createGameboard = function() {
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
        checkForWin,
    }
};

const createPlayer = function(name, id, icon) {
    return {
        name,
        id,
        icon
    };
}

const createGameController = function(player1, player2) {
    const gameboard = createGameboard();

    let gameOver = false;

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

    const isGameOver = function() {
        return gameOver;
    }

    return {
        playRound,
        getCurrentPlayer,
        isGameOver,
        getBoard: gameboard.getBoard,
        checkForWin: gameboard.checkForWin,
    }
};

const displayController = (function() {
    const form = document.querySelector('.form');
    const boardDisplay = document.querySelector('.board');
    const turnDisplay = document.querySelector('.turn');
    const startBtn = document.querySelector('.start');
    const resultDisplay = document.querySelector('.result');
    const restartBtn = document.querySelector('.restart');

    let gameController;

    const updateDisplay = function() {
        updateBoardDisplay();
        updateTurnDisplay();
        updateResultDisplay();
        updateFormDisplay();
    };

    const updateBoardDisplay = function() {
        if (!gameController) return;
        boardDisplay.innerText = '';

        const board = gameController.getBoard();

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

    const updateTurnDisplay = function() {
        if (!gameController) return;
        const currentPlayer = gameController.getCurrentPlayer();
        turnDisplay.innerText = `( ${currentPlayer.icon} ) ${currentPlayer.name}'s turn:`
    }

    const updateFormDisplay = function() {
        if (!gameController || gameController.isGameOver()) {
            Array.from(form).forEach(fieldset => fieldset.removeAttribute('disabled'));
        } else {
            Array.from(form).forEach(fieldset => fieldset.setAttribute('disabled', true));
        }
    }

    restartBtn.addEventListener('click', () => {
        gameController = null;
        updateDisplay();
    });

    boardDisplay.addEventListener('click', (e) => {
        if (!e.target || !gameController) return;
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        gameController.playRound(row, col);
        updateDisplay();
    });

    startBtn.addEventListener('click', (e) => {
        const player1Name = form.querySelector('#player-1-name').value;
        const player2Name = form.querySelector('#player-2-name').value;

        const player1 = createPlayer(player1Name, 0, 'X');
        const player2 = createPlayer(player2Name, 1, 'O');

        gameController = createGameController(player1, player2);
        updateDisplay();
    });

    const updateResultDisplay = function() {
        if (!gameController) return;

        const currentPlayer = gameController.getCurrentPlayer();
        const hasWinner = gameController.checkForWin(currentPlayer);
        if (hasWinner) {
            resultDisplay.innerText = `${currentPlayer.name} (${currentPlayer.icon}) wins!`;
        } else if (hasWinner === null) {
            resultDisplay.innerText = 'tie!';
        } else {
            // If no winner/tie (i.e. game still running), ensure
            // no result is being displayed from a previous game
            resultDisplay.innerText = '';
        }
    };



    updateDisplay();
})();