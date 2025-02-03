export function isValidBishopMove(piece, [toRow, toCol], board) {
    const [fromRow, fromCol] = piece.position;
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
