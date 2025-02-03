export class Piece {
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
}