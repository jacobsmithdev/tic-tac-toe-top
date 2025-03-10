const createGameboard = function() {
    // Treat board[0] as top left cell, e.g.:
    // [0][1][2]
    // [3][4][5]
    // [6][7][8]
    const board = [
        null, null, null, null, null, null, null, null, null,
    ];

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    const getBoard = function() {
        return board;
    }

    // Expects zero indexed input (e.g. [0] [1] [2], NOT [1], [2], [3])
    const isValidMove = function(cell) {
        const cellEmpty = board[cell] === null;
        return cellEmpty;
    };

    // Expects zero indexed input (e.g. [0] [1] [2], NOT [1], [2], [3])
    const addMove = function(cell, char) {
        if (isValidMove(cell)) {
            board[cell] = char;
            return true;
        } else {
            return false;
        }
    };

    const checkForWin = function(player) {
        const winFound = winPatterns.some(pattern =>
            pattern.every(cell => board[cell] === player.id)
        );

        if (winFound) {
            return true;
        } else if (isBoardFilled()) {
            // If no winner exists and board is full, the game is a tie
            return null;
        } else {
            return false;
        }
    }

    const isBoardFilled = function() {
        const boardFilled = board.every(cell => cell !== null);
        return boardFilled;
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

    const playRound = function(cell) {
        if (gameOver) return;
        const moveAdded = gameboard.addMove(cell, currentPlayer.id);
        if (!moveAdded) return;
        
        const hasWinner = gameboard.checkForWin(currentPlayer);
        // If hasWinner is null, the game is a tie
        if (hasWinner || hasWinner === null) {
            gameOver = true;
        } else {
            switchCurrentPlayer();
        }
    };

    const isGameOver = function() {
        return gameOver;
    }

    const getBoardIcons = function() {
        const board = gameboard.getBoard();

        const iconBoard = board.map(playerID => {
            if (player1.id === playerID) return player1.icon;
            if (player2.id === playerID) return player2.icon;
            return null;
        })
        return iconBoard;
    }

    return {
        playRound,
        getCurrentPlayer,
        isGameOver,
        getBoardIcons,
        checkForWin: gameboard.checkForWin,
    }
};

const displayController = (function() {
    const form = document.querySelector('#player-input-form');
    const boardDisplay = document.querySelector('.board');
    const turnDisplay = document.querySelector('.turn');
    const startBtn = document.querySelector('#start');
    const resultDisplay = document.querySelector('.result');
    const restartBtn = document.querySelector('#restart');

    let gameController;

    const updateDisplay = function() {
        updateBoardDisplay();
        updateTurnDisplay();
        updateResultDisplay();
        updateFormDisplay();
        updateRestartBtnDisplay();
        updateStartBtnDisplay();
    };

    const updateBoardDisplay = function() {
        if (!gameController) {
            Array.from(boardDisplay.children).forEach(btn => btn.disabled = true)
            boardDisplay.classList.add('board--disabled');
            return;
        };
        boardDisplay.textContent = '';

        const board = gameController.getBoardIcons();

        if (gameController.isGameOver()) {
            boardDisplay.classList.add('board--disabled');
        } else {
            boardDisplay.classList.remove('board--disabled');
        }

        board.forEach((item, itemIndex) => {
                const cell = document.createElement('button');
                if (gameController.isGameOver()) {
                    cell.disabled = true;
                }
                cell.dataset.cellIndex = itemIndex; 
                cell.textContent = board[itemIndex];

                cell.classList.add('board__cell')

                boardDisplay.append(cell);
        });
    };

    const updateTurnDisplay = function() {
        if (!gameController || gameController.isGameOver()) {
            turnDisplay.textContent = '';
            return;
        };
        const currentPlayer = gameController.getCurrentPlayer();
        turnDisplay.textContent = `( ${currentPlayer.icon} ) ${currentPlayer.name}'s turn`
    }

    const updateFormDisplay = function() {
        if (!gameController || gameController.isGameOver()) {
            Array.from(form).forEach(fieldset => fieldset.removeAttribute('disabled'));
        } else {
            Array.from(form).forEach(fieldset => fieldset.setAttribute('disabled', true));
        }
    }

    const updateStartBtnDisplay = function() {
        if (!gameController || gameController.isGameOver()) {
            startBtn.disabled = false;
        } else {
            startBtn.disabled = true;
        }
    }

    const updateRestartBtnDisplay = function() {
        if (!gameController || gameController.isGameOver()) {
            restartBtn.disabled = true;
        } else {
            restartBtn.disabled = false;
        }
    }

    restartBtn.addEventListener('click', () => {
        gameController = null;
        updateDisplay();
    });

    boardDisplay.addEventListener('click', (e) => {
        if (!e.target || !gameController) return;
        const cell = e.target.dataset.cellIndex;
        gameController.playRound(cell);
        updateDisplay();
    });

    startBtn.addEventListener('click', (e) => {
        const player1Name = form.querySelector('#player-1-name').value;
        const player2Name = form.querySelector('#player-2-name').value;

        let player1Icon = form.querySelector('#player-1-icon').value;
        let player2Icon = form.querySelector('#player-2-icon').value;

        player1Icon = player1Icon.slice(0, 3).trim();
        player2Icon = player2Icon.slice(0, 3).trim();

        if (!player1Icon) player1Icon = "X";
        if (!player2Icon) player2Icon = "O";

        if (player1Icon === player2Icon) {
            player1Icon = "X";
            player2Icon = "O";
        }

        const player1 = createPlayer(player1Name, 0, player1Icon);
        const player2 = createPlayer(player2Name, 1, player2Icon);

        gameController = createGameController(player1, player2);
        updateDisplay();
    });

    const updateResultDisplay = function() {
        if (!gameController) return;

        const currentPlayer = gameController.getCurrentPlayer();
        const hasWinner = gameController.checkForWin(currentPlayer);
        if (hasWinner) {
            resultDisplay.textContent = `${currentPlayer.name} (${currentPlayer.icon}) wins!`;
        } else if (hasWinner === null) {
            resultDisplay.textContent = 'tie!';
        } else {
            // If no winner/tie (i.e. game still running), ensure
            // no result is being displayed from a previous game
            resultDisplay.textContent = '';
        }
    };



    updateDisplay();
})();