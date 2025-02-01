class Piece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.symbol = this.getSymbol();
        this.hasMoved = false;
    }

    getSymbol() {
        const symbols = {
            king: { white: '♔', black: '♚' },
            queen: { white: '♕', black: '♛' },
            rook: { white: '♖', black: '♜' },
            bishop: { white: '♗', black: '♝' },
            knight: { white: '♘', black: '♞' },
            pawn: { white: '♙', black: '♟' }
        };
        return symbols[this.type][this.color];
    }

    isValidMove(targetPos, board, enPassantPawn) {
        const [fromRow, fromCol] = this.position;
        const [toRow, toCol] = targetPos;
        const targetPiece = board[toRow]?.[toCol];

        if (targetPiece && targetPiece.color === this.color) return false;

        switch (this.type) {
            case 'pawn':
                return this.isValidPawnMove(targetPos, board, enPassantPawn);
            case 'rook':
                return this.isValidRookMove(targetPos, board);
            case 'knight':
                return this.isValidKnightMove(targetPos);
            case 'bishop':
                return this.isValidBishopMove(targetPos, board);
            case 'queen':
                return this.isValidQueenMove(targetPos, board);
            case 'king':
                return this.isValidKingMove(targetPos, board);
            default: return false;
        }
    }

    isValidPawnMove([toRow, toCol], board, enPassantPawn) {
        const [fromRow, fromCol] = this.position;
        const direction = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;

        // حرکت مستقیم
        if (fromCol === toCol) {
            if (toRow === fromRow + direction && !board[toRow][toCol]) return true;
            if (fromRow === startRow && toRow === fromRow + 2*direction &&
                !board[fromRow + direction][fromCol] && !board[toRow][toCol]) return true;
        }
        // حمله اریب
        else if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
            if (board[toRow][toCol]) return true;
            if (enPassantPawn?.position[0] === fromRow &&
                enPassantPawn.position[1] === toCol &&
                enPassantPawn.color !== this.color) return true;
        }
        return false;
    }

    isValidRookMove([toRow, toCol], board) {
        const [fromRow, fromCol] = this.position;
        if (fromRow !== toRow && fromCol !== toCol) return false;

        const stepRow = fromRow === toRow ? 0 : (toRow > fromRow ? 1 : -1);
        const stepCol = fromCol === toCol ? 0 : (toCol > fromCol ? 1 : -1);
        let currentRow = fromRow + stepRow;
        let currentCol = fromCol + stepCol;

        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol]) return false;
            currentRow += stepRow;
            currentCol += stepCol;
        }
        return true;
    }

    isValidKnightMove([toRow, toCol]) {
        const [fromRow, fromCol] = this.position;
        const dx = Math.abs(toCol - fromCol);
        const dy = Math.abs(toRow - fromRow);
        return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
    }

    isValidBishopMove([toRow, toCol], board) {
        const [fromRow, fromCol] = this.position;
        if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;

        const stepRow = toRow > fromRow ? 1 : -1;
        const stepCol = toCol > fromCol ? 1 : -1;
        let currentRow = fromRow + stepRow;
        let currentCol = fromCol + stepCol;

        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol]) return false;
            currentRow += stepRow;
            currentCol += stepCol;
        }
        return true;
    }

    isValidQueenMove(targetPos, board) {
        return this.isValidRookMove(targetPos, board) ||
            this.isValidBishopMove(targetPos, board);
    }

    isValidKingMove([toRow, toCol], board) {
        const [fromRow, fromCol] = this.position;
        if (Math.abs(toRow - fromRow) > 1 || Math.abs(toCol - fromCol) > 1) {
            return this.canCastle([toRow, toCol], board);
        }
        return true;
    }

    canCastle([toRow, toCol], board) {
        if (this.hasMoved) return false;
        const isKingSide = toCol === 6;
        const rookCol = isKingSide ? 7 : 0;
        const rook = board[toRow][rookCol];

        if (!rook || rook.type !== 'rook' || rook.hasMoved) return false;

        const step = isKingSide ? 1 : -1;
        let currentCol = fromCol + step;
        while (currentCol !== rookCol) {
            if (board[fromRow][currentCol]) return false;
            currentCol += step;
        }
        return true;
    }
}

class ChessGame {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.selectedPiece = null;
        this.currentTurn = 'white';
        this.enPassantPawn = null;
        this.castlingRights = { white: true, black: true };
        this.initializeBoard();
        this.renderBoard();
        this.updateTurnIndicator();
    }

    initializeBoard() {
        // تنظیم مهره‌های سیاه
        const blackPieces = [
            ['rook', 0, 0], ['knight', 0, 1], ['bishop', 0, 2], ['queen', 0, 3],
            ['king', 0, 4], ['bishop', 0, 5], ['knight', 0, 6], ['rook', 0, 7]
        ];
        blackPieces.forEach(([type, row, col]) => {
            this.board[row][col] = new Piece(type, 'black', [row, col]);
        });
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = new Piece('pawn', 'black', [1, col]);
        }

        // تنظیم مهره‌های سفید
        const whitePieces = [
            ['rook', 7, 0], ['knight', 7, 1], ['bishop', 7, 2], ['queen', 7, 3],
            ['king', 7, 4], ['bishop', 7, 5], ['knight', 7, 6], ['rook', 7, 7]
        ];
        whitePieces.forEach(([type, row, col]) => {
            this.board[row][col] = new Piece(type, 'white', [row, col]);
        });
        for (let col = 0; col < 8; col++) {
            this.board[6][col] = new Piece('pawn', 'white', [6, col]);
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                square.dataset.row = row;
                square.dataset.col = col;

                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = piece.symbol;
                    square.style.color = piece.color === 'white' ? '#fff' : '#333';
                }

                square.addEventListener('click', (e) => this.handleSquareClick(e));
                boardElement.appendChild(square);
            }
        }
    }

    handleSquareClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);
        const piece = this.board[row][col];

        if (this.selectedPiece) {
            if (this.selectedPiece.position[0] === row &&
                this.selectedPiece.position[1] === col) {
                this.selectedPiece = null;
                this.renderBoard();
                return;
            }

            if (this.selectedPiece.color === this.currentTurn &&
                this.selectedPiece.isValidMove([row, col], this.board, this.enPassantPawn)) {
                this.movePiece(this.selectedPiece.position, [row, col]);
                this.handlePromotion(row, col);
                this.handleEnPassant(row, col);
                this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
                this.updateTurnIndicator();
            }
            this.selectedPiece = null;
        } else if (piece && piece.color === this.currentTurn) {
            this.selectedPiece = piece;
        }

        this.renderBoard();
        this.highlightValidMoves();
    }

    movePiece(from, to) {
        const [fromRow, fromCol] = from;
        const [toRow, toCol] = to;
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        this.board[toRow][toCol].position = [toRow, toCol];
        this.board[toRow][toCol].hasMoved = true;
    }

    highlightValidMoves() {
        if (!this.selectedPiece) return;

        document.querySelectorAll('.square').forEach(square => {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            if (this.selectedPiece.isValidMove([row, col], this.board, this.enPassantPawn)) {
                square.classList.add('valid-move');
            }
        });
    }

    updateTurnIndicator() {
        document.getElementById('turn').textContent =
            `نوبت: ${this.currentTurn === 'white' ? 'سفید' : 'سیاه'}`;
    }

    handleEnPassant(toRow, toCol) {
        if (this.selectedPiece?.type === 'pawn') {
            if (Math.abs(toRow - this.selectedPiece.position[0]) === 2) {
                this.enPassantPawn = this.selectedPiece;
            } else if (this.enPassantPawn && Math.abs(toCol - this.selectedPiece.position[1]) === 1) {
                const capturedPawnRow = this.currentTurn === 'white' ? toRow + 1 : toRow - 1;
                this.board[capturedPawnRow][toCol] = null;
                this.enPassantPawn = null;
            }
        } else {
            this.enPassantPawn = null;
        }
    }

    handlePromotion(row, col) {
        const piece = this.board[row][col];
        if (piece?.type === 'pawn' && (row === 0 || row === 7)) {
            const newType = prompt('مهره جدید را انتخاب کنید (queen, rook, bishop, knight):', 'queen');
            if (newType) {
                this.board[row][col] = new Piece(newType, piece.color, [row, col]);
            }
        }
    }
}

// شروع بازی
const game = new ChessGame();