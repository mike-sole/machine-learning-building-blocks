

function createCosineGraph(name) {
  
  this.board = JXG.JSXGraph.initBoard(name, {
    boundingBox: [-1, 2.5, 7, -2.5],
    axis: true,
    showCopyright: false,
    defaultAxes: {
      x: {
        ticks: {
          scale: Math.PI,
          scaleSymbol: "°",
          ticksDistance: 0.5,

          insertTicks: false,
          minorTicks: 0,
        },
      },
      y: {},
    },
  });

  this.board.create("functiongraph", [
    function (x) {
      return Math.cos(x);
    },
    0,
    Math.PI * 2,
  ]);

  this.board.defaultAxes.x.ticks[0].generateLabelText = function (tick, zero) {
    var tickValue = (180 / Math.PI) * tick.usrCoords[1];
    return this.formatLabelText(tickValue.toFixed(1));
  };

  return this.board;

}

class UnitCircleSimilarityMeasuresChart {

  constructor(name, parentBoard, unitCirclePoint) {

    this.board = createCosineGraph(name + "Metrics");

    this.board.suspendUpdate();

    this.board.create(
      "point",
      [
        function () {
          return JXG.Math.Geometry.rad([1, 0], [0, 0], unitCirclePoint);
        },
        function () {
          return unitCirclePoint.X();
        },
      ],
      { fixed: true, color: "#0000ff", name: "C" }
    );




    this.board.unsuspendUpdate();

    parentBoard.addChild(this.board);

  }

  withEuclidianDistanceMetric() {

    this.board.create(
      "point",
      [
        function () {
          return JXG.Math.Geometry.rad([1, 0], [0, 0], unitCirclePoint);
        },
        function () {
          const xvalue = JXG.Math.Geometry.distance(
            [1, 0],
            [unitCirclePoint.X(), unitCirclePoint.Y()]
          );
          console.log(xvalue);
          return xvalue;
        },
      ],
      { fixed: true, color: "#ff33ff", name: "X" }
    );


    this.board.create(
      "functiongraph",
      [
        function (x) {
          const cx = Math.cos(x);
          const cy = Math.sin(x);
          return JXG.Math.Geometry.distance([1, 0], [cx, cy]);
        },
        0,
        Math.PI * 2,
      ],
      { strokeColor: "red" }
    );

  }

}

class UnitCircleChart {
  constructor(name, showLabelOption) {

    this.board = JXG.JSXGraph.initBoard(name + "UnitCircle", {
      boundingbox: [-1.4, 1.4, 1.4, -1.4],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    var b1c1 = this.board.create(
      "circle",
      [
        [0, 0],
        [1, 0],
      ],
      { dash: 2, fixed: true }
    );

    var unitCirclePoint = this.board.create("point", [2, 1], {
      slideObject: b1c1,
      name: "\\[ \\vec{a} \\]",
    });

    this.board.create(
      "perpendicular",
      [this.board.defaultAxes.x, unitCirclePoint],
      [{ strokeColor: "#ff0000", visible: true }, { visible: false }]
    );

    this.board.create(
      "perpendicular",
      [this.board.defaultAxes.y, unitCirclePoint],
      [{ strokeColor: "#0000ff", visible: true }, { visible: false }]
    );

    const arrowA = this.board.create("arrow", [[0, 0], unitCirclePoint], {
      fixed: true,
    });
    this.board.create("smartlabel", [arrowA], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-a",
    });

    const vectorB = this.board.create("point", [1, 0], {
      face: "o",
      size: 0,
      name: "\\[ \\vec{b} \\]",
      fixed: true,
    });

    const origin = this.board.create("point", [0, 0], {
      face: "o",
      size: 0,
      fixed: true,
    });

    const arrowB = this.board.create("arrow", [[0, 0], vectorB], {
      fixed: true,
    });
    this.board.create("smartlabel", [arrowB], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-b",
    });

    const angleAB = this.board.create("angle", [vectorB, origin, unitCirclePoint], {
      radius: 1,
      fixed: true,
      name: () => {
        return `${JXG.Math.Geometry.trueAngle(vectorB, [0, 0], unitCirclePoint).toFixed(
          1
        )}°`;
      },
    });

    const distAB = this.board.create("line", [unitCirclePoint, vectorB], {
      strokeWidth: 2,
      dash: 2,
      straightFirst: false,
      straightLast: false,
      fixed: true,
    });
    this.board.create("smartlabel", [distAB], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-ab",
    });

    this.board.unsuspendUpdate();

    this.similarityMetricsChart = new UnitCircleSimilarityMeasuresChart(name, this.board, unitCirclePoint);

  }
}
