/*
 * Create a board where the x-axis has Math.PI scale.
 * x-axis ticks are labelled as degrees from 0 to 360.
 */
class AngleDegreesMetricsGraph {
  constructor(name) {
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

    this.board.defaultAxes.x.ticks[0].generateLabelText = function (tick, zero) {
      var tickValue = (180 / Math.PI) * tick.usrCoords[1];
      return this.formatLabelText(tickValue.toFixed(1));
    };

  }

  getBoard() {
    return this.board;
  }

  withCosineSimilarityMeasure(invert) {

    // cosine function graph
    const minValue = 0;
    const maxValue = Math.PI * 2;
    this.board.create("functiongraph", [
      function (x) {
        const value = Math.cos(x);
        return invert ? 1 - value : value;
      },
      minValue,
      maxValue,
    ]);

    return this;
  }

  withEuclideanDistanceMetric() {

    // euclidean distance function graph
    const minAngleValue = 0;
    const maxAngleValue = Math.PI * 2;
    this.board.create(
      "functiongraph",
      [
        (x) => {
          const cx = Math.cos(x);
          const cy = Math.sin(x);
          return JXG.Math.Geometry.distance([1, 0], [cx, cy]);
        },
        minAngleValue,
        maxAngleValue,
      ],
      { strokeColor: "red" }
    );

    return this;
  }

}

class UnitCircleSimilarityMeasuresChart {
  constructor(name, unitCirclePoint) {

    this.unitCirclePoint = unitCirclePoint;

    this.graph = new AngleDegreesMetricsGraph(name);
    
    this.board = this.graph.getBoard();
  }

  getBoard() {
    return this.board;
  }

  withCosineSimilarityMeasure(invert) {

    // cosine function graph
    this.graph.withCosineSimilarityMeasure(invert);

    // point on the cosine function graph that corresponds to the point on the unit circle
    this.board.create(
      "point",
      [
        () => {
          return JXG.Math.Geometry.rad([1, 0], [0, 0], this.unitCirclePoint);
        },
        () => {
          const value = this.unitCirclePoint.X();
          return invert ? 1 - value : value;
        },
      ],
      { fixed: true, color: "#0000ff", name: "C" }
    );

    return this;
  }

  withEuclideanDistanceMetric() {

    // euclidean distance function graph
    this.graph.withEuclideanDistanceMetric();

    // point on the distance function graph that corresponds to the point on the unit circle
    this.board.create(
      "point",
      [
        () => {
          return JXG.Math.Geometry.rad([1, 0], [0, 0], this.unitCirclePoint);
        },
        () => {
          const distance = JXG.Math.Geometry.distance(
            [1, 0],
            [this.unitCirclePoint.X(), this.unitCirclePoint.Y()]
          );

          return distance;
        },
      ],
      { fixed: true, color: "#ff33ff", name: "X" }
    );

    return this;
  }

}

class UnitCircleChart {
  constructor(name) {
    this.board = JXG.JSXGraph.initBoard(name + "UnitCircle", {
      boundingbox: [-1.4, 1.4, 1.4, -1.4],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    const unitCircle = this.board.create(
      "circle",
      [
        [0, 0],
        [1, 0],
      ],
      { dash: 2, fixed: true }
    );

    // pont on the unit circle which can be dragged around the radius
    const unitCirclePoint = this.board.create("point", [2, 1], {
      slideObject: unitCircle,
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

    this.board.create("angle", [vectorB, origin, unitCirclePoint], {
      radius: 1,
      fixed: true,
      name: () => {
        return `${JXG.Math.Geometry.trueAngle(
          vectorB,
          [0, 0],
          unitCirclePoint
        ).toFixed(1)}°`;
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

    this.similarityMetricsChart = new UnitCircleSimilarityMeasuresChart(
      name + "Metrics",
      unitCirclePoint
    );

    this.board.addChild(this.similarityMetricsChart.getBoard());

    this.board.unsuspendUpdate();
  }

  withCosineSimilarityMeasure(invert) {
    this.similarityMetricsChart.withCosineSimilarityMeasure(invert);
    return this;
  }

  withEuclideanDistanceMetric() {
    this.similarityMetricsChart.withEuclideanDistanceMetric();
    return this;
  }

}
