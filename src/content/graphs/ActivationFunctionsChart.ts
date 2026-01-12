import JXG from 'jsxgraph';

export class ActivationFunctionsChart {
    board: JXG.Board;

    constructor(board: JXG.Board, type: 'sigmoid' | 'relu') {
        this.board = board;

        if (type === 'sigmoid') {
            this.renderSigmoid();
        } else {
            this.renderReLU();
        }
    }

    renderSigmoid() {
        // User requested limits: y from -0.5 to 1.5
        // Reverting x to [-5, 5]
        this.board.setBoundingBox([-5, 1.5, 5, -0.5]);

        this.board.create('functiongraph', [
            (x: number) => 1 / (1 + Math.exp(-x)),
            -5, 5
        ], {
            strokeColor: '#2563eb', // Blue-600
            strokeWidth: 3
        });

        // Use standard ASCII for formula
        this.board.create('text', [2, 0.8, 'f(x) = 1 / (1 + e^(-x))'], {
            fontSize: 16, strokeColor: '#2563eb'
        });
    }

    renderReLU() {
        // Reverting x to [-5, 5] and y-max to ~5.5
        this.board.setBoundingBox([-5, 5.5, 5, -1]);

        this.board.create('functiongraph', [
            (x: number) => Math.max(0, x),
            -5, 5
        ], {
            strokeColor: '#1A5276', // Dark Blue
            strokeWidth: 3
        });

        this.board.create('text', [-4, 3, 'f(x) = max(0, x)'], {
            fontSize: 16, strokeColor: 'black'
        });
    }
}

export const initSigmoid = (board: JXG.Board) => {
    new ActivationFunctionsChart(board, 'sigmoid');
};

export const initRelu = (board: JXG.Board) => {
    new ActivationFunctionsChart(board, 'relu');
};
