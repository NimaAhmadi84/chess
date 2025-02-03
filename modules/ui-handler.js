export class UIHandler {
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById('board');
        this.turnIndicator = document.getElementById('turn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.boardElement.addEventListener('click', (e) => {
            const row = parseInt(e.target.dataset.row);
            const col = parseInt(e.target.dataset.col);
            this.game.handleSquareClick([row, col]);
        });
    }

    renderBoard(board) {
        this.boardElement.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = board[row][col];
                if (piece) {
                    square.textContent = piece.symbol;
                    square.style.color = piece.color === 'white' ? '#fff' : '#333';
                }

                this.boardElement.appendChild(square);
            }
        }
    }

    updateTurnIndicator(turn) {
        this.turnIndicator.textContent = `نوبت: ${turn === 'white' ? 'سفید' : 'سیاه'}`;
    }

    highlightValidMoves(piece, board, enPassantPawn) {
        document.querySelectorAll('.square').forEach(square => {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            if (this.game.moveHandlers[piece.type](piece, [row, col], board, enPassantPawn)) {
                square.classList.add('valid-move');
            }
        });
    }
}