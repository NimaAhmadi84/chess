import { Piece } from './piece.js';
import { isValidPawnMove, handlePawnPromotion } from './move-logic/pawn.js';
import { isValidRookMove } from './move-logic/rook.js';
import { isValidKnightMove } from './move-logic/knight.js';
import { isValidBishopMove } from './move-logic/bishop.js';
import { isValidQueenMove } from './move-logic/queen.js';
import { isValidKingMove, canCastle } from './move-logic/king.js';
import { handleEnPassant } from './move-logic/special-moves.js';
import { UIHandler } from './ui-handler.js';

export class ChessGame {
    constructor() {
        this.board = Array(8).fill().map(() => Array(8).fill(null));
        this.selectedPiece = null;
        this.currentTurn = 'white';
        this.enPassantPawn = null;
        this.castlingRights = { white: true, black: true };
        this.ui = new UIHandler(this);
        this.moveHandlers = {
            pawn: isValidPawnMove,
            rook: isValidRookMove,
            knight: isValidKnightMove,
            bishop: isValidBishopMove,
            queen: isValidQueenMove,
            king: isValidKingMove
        };
    }

    init() {
        this.initializeBoard();
        this.ui.renderBoard(this.board);
        this.ui.updateTurnIndicator(this.currentTurn);
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

    handleSquareClick(position) {
        const [row, col] = position;
        const piece = this.board[row][col];

        if (this.selectedPiece) {
            if (this.selectedPiece.position[0] === row &&
                this.selectedPiece.position[1] === col) {
                this.selectedPiece = null;
                this.ui.renderBoard(this.board);
                return;
            }

            if (this.selectedPiece.color === this.currentTurn &&
                this.moveHandlers[this.selectedPiece.type](this.selectedPiece, position, this.board, this.enPassantPawn)) {
                this.movePiece(this.selectedPiece.position, position);
                this.handlePromotion(row, col);
                this.handleEnPassant(row, col);
                this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
                this.ui.updateTurnIndicator(this.currentTurn);
            }
            this.selectedPiece = null;
        } else if (piece && piece.color === this.currentTurn) {
            this.selectedPiece = piece;
        }

        this.ui.renderBoard(this.board);
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
        this.ui.highlightValidMoves(this.selectedPiece, this.board, this.enPassantPawn);
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
            const newType = handlePawnPromotion();
            if (newType) {
                this.board[row][col] = new Piece(newType, piece.color, [row, col]);
            }
        }
    }
}