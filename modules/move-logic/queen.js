import { isValidRookMove } from './rook.js';
import { isValidBishopMove } from './bishop.js';

export function isValidQueenMove(piece, targetPos, board) {
    return isValidRookMove(piece, targetPos, board) ||
        isValidBishopMove(piece, targetPos, board);
}