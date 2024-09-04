function createNeuron(board, label, origin, radius, incomingWeight) {
  const originPt = board.create("point", origin, {
    name: `${label}`,
    fixed: true,
  });

  const radiusPt = board.create("point", [origin[0] + radius, origin[1]], {
    size: 0,
    name: "",
    fixed: true,
  });

  board.create("circle", [originPt, radiusPt]);

  return { originPt, radius, incomingWeight};
}

class PerceptronChart {
  constructor(name) {
    this.board = JXG.JSXGraph.initBoard(name, {
      boundingBox: [-1, 10, 10, -1],
      axis: true,
      showCopyright: false,
    });

    const x1Circle = createNeuron(this.board, "$x1$", [1.0, 7.0], 1, "$w1$");
    const x2Circle = createNeuron(this.board, "$x2$", [1.0, 4.0], 1, "$w2$");
    const x3Circle = createNeuron(this.board, "$x3$", [1.0, 1.0], 1, "$w3$");

    const dotProductCircle = createNeuron(
      this.board,
      "weighted sum",
      [7.0, 4.0],
      1
    );

    [x1Circle, x2Circle, x3Circle].forEach((circle) => {
      const start = [circle.originPt.X() + circle.radius, circle.originPt.Y()];
      const end = [
        dotProductCircle.originPt.X() - dotProductCircle.radius,
        dotProductCircle.originPt.Y(),
      ];

      this.board.create("line", [start, end], {
        strokeWidth: 1,
        straightFirst: false,
        straightLast: false,
        fixed: true,
        withLabel: true,
        label: {
          anchorX: 'right',
          anchorY: 'bottom',
          offset: [0, 1],
          position: '25% right'
        },
        name: circle.incomingWeight
      });

      this.board.create("arrow", [start, end], {
        fixed: true,
      });
    });
  }

  getBoard() {
    return this.board;
  }
}
