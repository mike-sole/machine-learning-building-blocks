

class UnitCircleChart {
  constructor(name, showLabelOption) {

  }
}

var board = JXG.JSXGraph.initBoard("box", {
  boundingbox: [-1.4, 1.4, 1.4, -1.4],
  axis: true
});

board.suspendUpdate();

var b1c1 = board.create(
  "circle",
  [
    [0, 0],
    [1, 0],
  ],
  { dash: 2, fixed: true }
);

var b1p1 = board.create("point", [2, 1], { slideObject: b1c1, name: "\\[ \\vec{a} \\]",});

board.create(
  "perpendicular",
  [board.defaultAxes.x, b1p1],
  [{ strokeColor: "#ff0000", visible: true }, { visible: false }]
);

board.create(
  "perpendicular",
  [board.defaultAxes.y, b1p1],
  [{ strokeColor: "#0000ff", visible: true }, { visible: false }]
);



const arrowA = board.create("arrow", [[0, 0], b1p1], {
  fixed: true,
});
board.create("smartlabel", [arrowA], {
  measure: "length",
  cssClass: "smart-label-pure smart-label-circle-vector-a",
});

const vectorB = board.create("point", [1, 0], {
  face: "o",
  size: 0,
  name: "\\[ \\vec{b} \\]",
  fixed: true
});

const origin = board.create("point", [0, 0], {
  face: "o",
  size: 0,
  fixed: true
});

const arrowB = board.create("arrow", [[0, 0], vectorB], {
  fixed: true,
});
board.create("smartlabel", [arrowB], {
  measure: "length",
  cssClass: "smart-label-pure smart-label-circle-vector-b",
});

const angleAB = board.create(
  "angle",
  [vectorB, origin, b1p1],
  {
    radius: 1,
    fixed: true,
    name: () => {
      return `${JXG.Math.Geometry.trueAngle(
        vectorB,
        [0, 0],
        b1p1
      ).toFixed(1)}°`;
    },
  }
);

const distAB = board.create("line", [b1p1, vectorB], {
  strokeWidth: 2,
  dash: 2,
  straightFirst: false,
  straightLast: false,
  fixed: true,
});
board.create("smartlabel", [distAB], {
  measure: "length",
  cssClass: "smart-label-pure smart-label-circle-vector-ab",
});

board.unsuspendUpdate();

///////////////////////////////////
// board 2
///////////////////////////////////

const board2 = JXG.JSXGraph.initBoard('box2', { boundingBox: [-1, 2.5, 7, -2.5], axis: true,
  defaultAxes: {
    x: {
      ticks: {
        scale: Math.PI,
        scaleSymbol: '°',
        ticksDistance: 0.5,

        insertTicks: false,
        minorTicks: 0
      }
   },
    y: {},
  },
});

board2.defaultAxes.x.ticks[0].generateLabelText = function (tick, zero) {
  var tickValue = (180/Math.PI) * tick.usrCoords[1];
  return this.formatLabelText(tickValue.toFixed(1));
};

board2.suspendUpdate();

// cosine:

board2.create(
  "point",
  [
    function () {
      return JXG.Math.Geometry.rad([1, 0], [0, 0], b1p1);
    },
    function () {
      return b1p1.X();
    },
  ],
  { fixed: true, color: "#0000ff", name: "C" }
);

board2.create(
  "point",
  [
    function () {
      return JXG.Math.Geometry.rad([1, 0], [0, 0], b1p1);
    },
    function () {
      const xvalue = JXG.Math.Geometry.distance([1, 0], [b1p1.X(), b1p1.Y()]);
      console.log(xvalue);
      return xvalue;
    },
  ],
  { fixed: true, color: "#ff33ff", name: "X" }
);

board2.create("functiongraph", [
  function (x) {
    return Math.cos(x);
  }, 0, Math.PI * 2
]);

/*
board2.create("functiongraph", [
  function (x) {
    return Math.sin(x);
  },
]);
*/

board2.create(
  "functiongraph",
  [
    function (x) {
      const cx = Math.cos(x);
      const cy = Math.sin(x);
      return JXG.Math.Geometry.distance([1, 0], [cx, cy]);
    }, 0, Math.PI * 2
  ],
  { strokeColor: "red" }
);

board2.unsuspendUpdate();

board.addChild(board2);
