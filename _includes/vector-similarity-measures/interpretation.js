


class InterpretationUnitCircle {
  constructor(name, vectorA, vectorB, vectorC) {

    this.unitVectorA = getUnitVector(new Point(vectorA[0], vectorA[1]));
    this.unitVectorB = getUnitVector(new Point(vectorB[0], vectorB[1]));
    this.unitVectorC = getUnitVector(new Point(vectorC[0], vectorC[1]));

    this.board = JXG.JSXGraph.initBoard(name, {
      boundingbox: [-1.4, 1.4, 1.4, -1.4],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    this.board.create(
      "circle",
      [
        [0, 0],
        [1, 0],
      ],
      { dash: 2, fixed: true }
    );

    this.vectorB = this.board.create("point", [this.unitVectorB.X(), this.unitVectorB.Y()], {
      face: "o",
      size: 0,
      name: "\\[ \\vec{b} \\]",
      fixed: true,
    });
    const arrowB = this.board.create("arrow", [[0, 0], this.vectorB], {
      fixed: true,
    });
    this.board.create("smartlabel", [arrowB], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-b",
    });

    this.vectorA = this.board.create("point", [this.unitVectorA.X(), this.unitVectorA.Y()], {
      face: "o",
      size: 0,
      name: "\\[ \\vec{a} \\]",
      fixed: true,
    });
    const arrowA = this.board.create("arrow", [[0, 0], [this.unitVectorA.X(), this.unitVectorA.Y()]], {
      fixed: true,
    });
    this.board.create("smartlabel", [arrowA], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-a",
    });

    this.vectorC = this.board.create("point", [this.unitVectorC.X(), this.unitVectorC.Y()], {
      face: "o",
      size: 0,
      name: "\\[ \\vec{c} \\]",
      fixed: true,
    });
    const arrowC = this.board.create("arrow", [[0, 0], this.vectorC], {
      fixed: true,
    });
    this.board.create("smartlabel", [arrowC], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-b",
    });

    const origin = this.board.create("point", [0, 0], {
      face: "o",
      size: 0,
      name: "",
      fixed: true,
    });

    this.board.create("angle", [this.vectorA, origin, this.vectorB], {
      radius: 0.5,
      fixed: true,
      name: () => {
        return `${JXG.Math.Geometry.trueAngle(
          this.vectorA,
          [0, 0],
          this.vectorB
        ).toFixed(1)}°`;
      },
    });

    this.board.create("angle", [this.vectorB, origin, this.vectorC], {
      radius: 0.4,
      fixed: true,
      name: () => {
        return `${JXG.Math.Geometry.trueAngle(
          this.vectorB,
          [0, 0],
          this.vectorC
        ).toFixed(1)}°`;
      },
    });

    this.board.unsuspendUpdate();
  }

}

class Interpretation {
  constructor(name, coordsA, coordsB, coordsC, showLabelOption) {
    this.showLabelOption = showLabelOption;

    this.board = JXG.JSXGraph.initBoard(name, {
      boundingbox: [-1, 10, 10, -1],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    this.vectorA = this.board.create("point", coordsA, {
      face: "o",
      size: 0,
      name: "\\[ \\vec{a} \\]",
      fixed: true
    });
    this.arrowA = this.board.create("arrow", [[0, 0], this.vectorA], {
      fixed: true,
    });
    this.board.create("smartlabel", [this.arrowA], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-a",
    });

    this.vectorB = this.board.create("point", coordsB, {
      face: "o",
      size: 0,
      name: "\\[ \\vec{b} \\]",
      fixed: true
    });
    this.arrowB = this.board.create("arrow", [[0, 0], this.vectorB], {
      fixed: true,
    });
    this.board.create("smartlabel", [this.arrowB], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-b",
    });

    this.vectorC = this.board.create("point", coordsC, {
      face: "o",
      size: 0,
      name: "\\[ \\vec{c} \\]",
      fixed: true
    });
    this.arrowC = this.board.create("arrow", [[0, 0], this.vectorC], {
      fixed: true,
    });
    this.board.create("smartlabel", [this.arrowC], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-c",
    });

    this.origin = this.board.create("point", [0, 0], {
      face: "o",
      size: 0,
      fixed: true,
      name: ""
    });

    this.angleAB = this.board.create(
      "angle",
      [this.vectorA, this.origin, this.vectorB],
      {
        radius: 1,
        fixed: true,
        name: () => {
          return `${JXG.Math.Geometry.trueAngle(
            this.vectorA,
            [0, 0],
            this.vectorB
          ).toFixed(1)}°`;
        },
      }
    );

    this.angleBC = this.board.create(
      "angle",
      [this.vectorB, this.origin, this.vectorC],
      {
        radius: 0.75,
        fixed: true,
        name: () => {
          return `${JXG.Math.Geometry.trueAngle(
            this.vectorB,
            [0, 0],
            this.vectorC
          ).toFixed(1)}°`;
        },
      }
    );

    this.distAB = this.board.create("line", [this.vectorA, this.vectorB], {
      strokeWidth: 2,
      dash: 2,
      straightFirst: false,
      straightLast: false,
      fixed: true,
    });

    this.board.create("smartlabel", [this.distAB], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-ab",
    });

    this.distAC = this.board.create("line", [this.vectorA, this.vectorC], {
      strokeWidth: 2,
      dash: 2,
      straightFirst: false,
      straightLast: false,
      fixed: true,
    });

    this.board.create("smartlabel", [this.distAC], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-ab",
    });

    this.distBC = this.board.create("line", [this.vectorB, this.vectorC], {
      strokeWidth: 2,
      dash: 2,
      straightFirst: false,
      straightLast: false,
      fixed: true,
    });

    this.board.create("smartlabel", [this.distBC], {
      measure: "length",
      cssClass: "smart-label-pure smart-label-circle-vector-ab",
    });

    this.board.create(
      "text",
      [
        -5,
        3,
        () => {
          const dotProduct = getDotProduct(this.vectorA, this.vectorB);

          const vectorAMagnitude = getMagnitude(this.vectorA);
          const vectorBMagnitude = getMagnitude(this.vectorB);

          const unitVectorA = getUnitVector(this.vectorA);
          const unitVectorB = getUnitVector(this.vectorB);
          const unitDotProduct = getDotProduct(unitVectorA, unitVectorB);

          const vectorAXColorValue = `{\\color{red}{${this.vectorA
            .X()
            .toFixed(2)}}}`;
          const vectorAYColorValue = `{\\color{green}{${this.vectorA
            .Y()
            .toFixed(2)}}}`;
          const vectorBXColorValue = `{\\color{blue}{${this.vectorB
            .X()
            .toFixed(2)}}}`;
          const vectorBYColorValue = `{\\color{purple}{${this.vectorB
            .Y()
            .toFixed(2)}}}`;
          /*  
          const l2 = Math.hypot(
            vectorA.X() - vectorB.X(),
            vectorA.Y() - vectorB.Y()
          );
          const EuclideanDistnce = `\\( x = ${l2.toFixed(
            2
          )} = \\sqrt {(${vectorAXColorValue} - ${vectorBXColorValue} )^2 + (${vectorAYColorValue} - ${vectorBYColorValue}) ^2 } \\)`;
     */
          const dotProductColorValue = `{\\color{teal}{${dotProduct.toFixed(
            2
          )}}}`;

          const cosineValueColorValue = `{\\color{brown}{${unitDotProduct.toFixed(
            2
          )}}}`;

          const vectorAMagnitudeColorValue = `{\\color{orange}{${vectorAMagnitude.toFixed(
            2
          )}}}`;
          const vectorBMagnitudeColorValue = `{\\color{lime}{${vectorBMagnitude.toFixed(
            2
          )}}}`;

          const vectorALine = `$ \\vec{a} = \\left(\\begin{matrix} ${vectorAXColorValue} & ${vectorAYColorValue} \\end{matrix}\\right) $`;
          const vectorBLine = `$ \\vec{b} = \\left(\\begin{matrix} ${vectorBXColorValue} & ${vectorBYColorValue} \\end{matrix}\\right) $`;

          const dotProductCalculation = `${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} * ${cosineValueColorValue}`;

          /*
          const vectorAMagnitudeLine = `\\( \\vert\\vert \\vec{a} \\vert\\vert = ${vectorAMagnitudeColorValue} = \\sqrt{${vectorAXColorValue}^2 + ${vectorAYColorValue}^2} \\)`;
          const vectorBMagnitudeLine = `\\( \\vert\\vert \\vec{b} \\vert\\vert = ${vectorBMagnitudeColorValue} = \\sqrt{${vectorBXColorValue}^2 + ${vectorBYColorValue}^2} \\)`;
          */
          const dotProductLineCalc1 = `$ \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = ${vectorAXColorValue} * ${vectorBXColorValue} +  ${vectorAYColorValue} * ${vectorBYColorValue} $`;
          /*
          const dotProductLineCalc2 = `\\( \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert \\cos\\theta = ${dotProductCalculation} \\) `;

          const cosineFormulae = `\\cos \\theta = ${cosineValueColorValue} = \\dfrac{ \\vec{a} \\cdot \\vec{b}  }{  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert }`;
          const cosineFormulaeWithVariables = `\\dfrac{ ${dotProductColorValue} }{ ${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} } `;
          const cosTheta = `\\( ${cosineFormulae} = ${cosineFormulaeWithVariables} \\)`;

          return `${vectorALine} <br><br> ${vectorBLine} <br><br> ${EuclideanDistnce} <br><br> ${vectorAMagnitudeLine} <br><br> ${vectorBMagnitudeLine} <br><br> ${dotProductLineCalc1} <br><br> ${dotProductLineCalc2} <br><br> ${cosTheta}`;
          */
          //return `${vectorALine} <br><br> ${vectorBLine} <br><br>`;

          const l2 = Math.hypot(
            this.vectorA.X() - this.vectorB.X(),
            this.vectorA.Y() - this.vectorB.Y()
          );

          const cosineFromDegrees = `$ \\cos ${this.angleAB.Value('degrees').toFixed(1)}$°`



          return ``;
        },
      ],
      { fixed: false,
        fontSize: 8
       }
    );

    this.board.on('update', () => {
      MathJax.startup.promise = MathJax.startup.promise
      .then(() => MathJax.typesetPromise())
      .catch((err) => console.log('Typeset failed: ' + err.message));
    });

    this.board.unsuspendUpdate();
  }
}

