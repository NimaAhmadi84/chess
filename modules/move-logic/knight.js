export function isValidKnightMove(piece, [toRow, toCol]) {
    const [fromRow, fromCol] = piece.position;
    const dx = Math.abs(toCol - fromCol);
    const dy = Math.abs(toRow - fromRow);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}