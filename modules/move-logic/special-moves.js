export function handleEnPassant(game, toRow, toCol) {
  if (game.selectedPiece?.type === "pawn") {
    if (Math.abs(toRow - game.selectedPiece.position[0]) === 2) {
      game.enPassantPawn = game.selectedPiece;
    } else if (
      game.enPassantPawn &&
      Math.abs(toCol - game.selectedPiece.position[1]) === 1
    ) {
      const capturedPawnRow =
        game.currentTurn === "white" ? toRow + 1 : toRow - 1;
      game.board[capturedPawnRow][toCol] = null;
      game.enPassantPawn = null;
    }
  } else {
    game.enPassantPawn = null;
  }
}
