export function isValidRookMove(piece, [toRow, toCol], board) {
    const [fromRow, fromCol] = piece.position;
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