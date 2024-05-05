class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  X() {
    return this.x;
  }

  Y() {
    return this.y;
  }
}

function getMagnitude(point) {
  return JXG.Math.Geometry.distance([0, 0], [point.X(), point.Y()]);
}

function getDotProduct(a, b) {
  return a.X() * b.X() + a.Y() * b.Y();
}

function getUnitVector(v) {
  const magnitude = getMagnitude(v);
  return new Point(v.X() / magnitude, v.Y() / magnitude);
}

JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard("jxgbox", {
  boundingbox: [-5, 5, 5, -5],
  axis: true,
  showCopyright: false,
});

board.suspendUpdate();

var vectorA = board.create("point", [3, 2], {
  face: "o",
  size: 2,
  name: "\\[ \\vec{a} \\]",
});
board.create("arrow", [[0, 0], vectorA], { fixed: true });

var vectorB = board.create("point", [2, 4], {
  face: "o",
  size: 2,
  name: "\\[ \\vec{b} \\]",
});
board.create("arrow", [[0, 0], vectorB], { fixed: true });

const angle = board.create("angle", [vectorA, [0, 0], vectorB], {
  radius: 1,
  fixed: true,
  name: function () {
    return "&theta;";
  },
});

board.create(
  "text",
  [
    -4.5,
    2,
    function () {
      const dotProduct = getDotProduct(vectorA, vectorB);

      const vectorAMagnitude = getMagnitude(vectorA);
      const vectorBMagnitude = getMagnitude(vectorB);

      const unitVectorA = getUnitVector(vectorA);
      const unitVectorB = getUnitVector(vectorB);
      const unitDotProduct = getDotProduct(unitVectorA, unitVectorB);

      const vectorAXColorValue = `{\\color{red}{${vectorA.X().toFixed(2)}}}`;
      const vectorAYColorValue = `{\\color{green}{${vectorA.Y().toFixed(2)}}}`;
      const vectorBXColorValue = `{\\color{blue}{${vectorB.X().toFixed(2)}}}`;
      const vectorBYColorValue = `{\\color{purple}{${vectorB.Y().toFixed(2)}}}`;

      /*
      const unitVectorAXColorValue = `{\\color{navy}{${unitVectorA
        .X()
        .toFixed(2)}}}`;
      const unitVectorAYColorValue = `{\\color{teal}{${unitVectorA
        .Y()
        .toFixed(2)}}}`;
      const unitVectorBXColorValue = `{\\color{olive}{${unitVectorB
        .X()
        .toFixed(2)}}}`;
      const unitVectorBYColorValue = `{\\color{brown}{${unitVectorB
        .Y()
        .toFixed(2)}}}`;
      */

      const dotProductColorValue = `{\\color{teal}{${dotProduct.toFixed(2)}}}`;

      const cosineValueColorValue = `{\\color{brown}{${unitDotProduct.toFixed(
        2
      )}}}`;

      const vectorAMagnitudeColorValue = `{\\color{orange}{${vectorAMagnitude.toFixed(
        2
      )}}}`;
      const vectorBMagnitudeColorValue = `{\\color{lime}{${vectorBMagnitude.toFixed(
        2
      )}}}`;

      const vectorALine = `\\( \\vec{a} = \\left(\\begin{matrix} ${vectorAXColorValue} & ${vectorAYColorValue} \\end{matrix}\\right) \\)`;
      const vectorBLine = `\\( \\vec{b} = \\left(\\begin{matrix} ${vectorBXColorValue} & ${vectorBYColorValue} \\end{matrix}\\right) \\)`;

      const vectorAMagnitudeLine = `\\( \\vert\\vert \\vec{a} \\vert\\vert = ${vectorAMagnitudeColorValue} = \\sqrt{${vectorAXColorValue}^2 + ${vectorAYColorValue}^2} \\)`;
      const vectorBMagnitudeLine = `\\( \\vert\\vert \\vec{b} \\vert\\vert = ${vectorBMagnitudeColorValue} = \\sqrt{${vectorBXColorValue}^2 + ${vectorBYColorValue}^2} \\)`;

      const dotProductLineCalc1 = `\\( \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = ${vectorAXColorValue} * ${vectorBXColorValue} +  ${vectorAYColorValue} * ${vectorBYColorValue} \\)`;
      const dotProductLineCalc2 = `\\( \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert \\cos\\theta = ${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} * ${cosineValueColorValue} \\) `;

      const cosineFormulae = `\\cos \\theta = ${cosineValueColorValue} = \\dfrac{ \\vec{a} \\cdot \\vec{b}  }{  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert }`;
      const cosineFormulaeWithVariables = `\\dfrac{ ${dotProductColorValue} }{ ${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} } `;
      const cosTheta = `\\( ${cosineFormulae} = ${cosineFormulaeWithVariables} \\)`;

      return `${vectorALine} <br><br> ${vectorBLine} <br><br> ${vectorAMagnitudeLine} <br><br> ${vectorBMagnitudeLine} <br><br> ${dotProductLineCalc1} <br><br> ${cosTheta} <br><br> ${dotProductLineCalc2}`;
    },
  ],
  { fixed: true }
);

board.unsuspendUpdate();
