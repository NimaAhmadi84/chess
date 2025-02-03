export function isValidKingMove(piece, [toRow, toCol], board) {
    const [fromRow, fromCol] = piece.position;
    if (Math.abs(toRow - fromRow) > 1 || Math.abs(toCol - fromCol) > 1) {
        return canCastle(piece, [toRow, toCol], board);
    }
    return true;
}

export function canCastle(piece, [toRow, toCol], board) {
    if (piece.hasMoved) return false;
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