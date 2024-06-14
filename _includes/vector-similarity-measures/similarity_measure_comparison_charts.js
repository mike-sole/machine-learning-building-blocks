
const SIMPLE_LBL_NONE = 0;
const SIMPLE_LBL_BASIC = 1;
const SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS = 2;
const MATHS_EQUATIONS = 3;

JXG.Options.text.useMathJax = true;

class Chart {
  constructor(name, showLabelOption) {
    this.showLabelOption = showLabelOption;

    this.board = JXG.JSXGraph.initBoard(name, {
      boundingbox: [-6, 6, 6, -6],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    this.vectorA = createInteractiveVector(this.board, [3.5, 1], 'a', 'smart-label-circle-vector-a');

    this.vectorB = createInteractiveVector(this.board, [2, 4], 'b', 'smart-label-circle-vector-b');

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

    this.board.create(
      "text",
      [
        -6,
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

          const dotProductLineCalc1 = `$ \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = ${vectorAXColorValue} * ${vectorBXColorValue} +  ${vectorAYColorValue} * ${vectorBYColorValue} $`;

          const l2 = Math.hypot(
            this.vectorA.X() - this.vectorB.X(),
            this.vectorA.Y() - this.vectorB.Y()
          );

          const euclideanDistanceLine = `$ x = ${l2.toFixed(
            2
          )} = \\sqrt{(${vectorAXColorValue} - ${vectorBXColorValue})^2 + (${vectorAYColorValue} - ${vectorBYColorValue})^2 }$`;
     

          const cosineFromDegrees = `$ \\cos ${this.angleAB.Value('degrees').toFixed(1)}$°`

          if (this.showLabelOption == SIMPLE_LBL_BASIC) {
            return `$\\vec{a}$ length = $${vectorAMagnitudeColorValue}$ <br><br> $\\vec{b}$ length = $${vectorBMagnitudeColorValue}$ <br><br> Euclidean Distance = ${l2.toFixed(
              2
            )} <br><br> Cosine Similarity = $${cosineValueColorValue}$ = ${cosineFromDegrees} <br><br> Dot Product = $${dotProductColorValue} = ${dotProductCalculation}$`;
          }

          if (this.showLabelOption == SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS) {
            return `${vectorALine} <br><br> ${vectorBLine} <br><br> $\\vec{a}$ length = $${vectorAMagnitudeColorValue}$ <br><br> $\\vec{b}$ length = $${vectorBMagnitudeColorValue}$ <br><br> Cosine = $${cosineValueColorValue}$ = ${cosineFromDegrees} <br><br> $ \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = ${dotProductCalculation}$ <br><br> ${dotProductLineCalc1}`;
          }

          if (this.showLabelOption == MATHS_EQUATIONS) {

            const vectorAMagnitudeLine = `$ \\vert\\vert \\vec{a} \\vert\\vert = ${vectorAMagnitudeColorValue} = \\sqrt{${vectorAXColorValue}^{2} + ${vectorAYColorValue}^2} $`;
            const vectorBMagnitudeLine = `$ \\vert\\vert \\vec{b} \\vert\\vert = ${vectorBMagnitudeColorValue} = \\sqrt{${vectorBXColorValue}^2 + ${vectorBYColorValue}^2} $`;
      
            const dotProductLineCalc1 = `$ \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = ${vectorAXColorValue} * ${vectorBXColorValue} +  ${vectorAYColorValue} * ${vectorBYColorValue} $`;
            const dotProductLineCalc2 = `$ \\vec{a} \\cdot \\vec{b} = ${dotProductColorValue} = \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert \\cos\\theta = ${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} * ${cosineValueColorValue} $ `;
      
            const cosineFormulae = `\\cos \\theta = ${cosineValueColorValue} = \\dfrac{ \\vec{a} \\cdot \\vec{b}  }{  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert }`;
            const cosineFormulaeWithVariables = `\\dfrac{ ${dotProductColorValue} }{ ${vectorAMagnitudeColorValue} * ${vectorBMagnitudeColorValue} } `;
            const cosTheta = `$ ${cosineFormulae} = ${cosineFormulaeWithVariables} $`;
      
            return `${vectorALine} <br><br> ${vectorBLine} <br><br> ${euclideanDistanceLine} <br><br> ${vectorAMagnitudeLine} <br><br> ${vectorBMagnitudeLine} <br><br> ${dotProductLineCalc1} <br><br> ${dotProductLineCalc2} <br><br> ${cosTheta}`;
          }

          return ``;
        },
      ],
      {
        fixed: true,
        fontUnit: 'vmin',
        fontSize: 1.5,
        mathJax: true
       }
    );

    this.board.unsuspendUpdate();
  }
}
