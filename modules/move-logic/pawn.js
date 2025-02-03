export function isValidPawnMove(piece, [toRow, toCol], board, enPassantPawn) {
    const [fromRow, fromCol] = piece.position;
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // حرکت مستقیم
    if (fromCol === toCol) {
        if (toRow === fromRow + direction && !board[toRow][toCol]) return true;
        if (fromRow === startRow && toRow === fromRow + 2 * direction &&
            !board[fromRow + direction][fromCol] && !board[toRow][toCol]) return true;
    }
    // حمله اریب
    else if (Math.abs(toCol - fromCol) === 1 && toRow === fromRow + direction) {
        if (board[toRow][toCol]) return true;
        if (enPassantPawn?.position[0] === fromRow &&
            enPassantPawn.position[1] === toCol &&
            enPassantPawn.color !== piece.color) return true;
    }
    return false;
}

export function handlePawnPromotion() {
    return prompt('مهره جدید را انتخاب کنید (queen, rook, bishop, knight):', 'queen');
}