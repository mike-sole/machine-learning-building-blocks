


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

    this.board.on('update', () => {
      MathJax.startup.promise = MathJax.startup.promise
      .then(() => MathJax.typesetPromise())
      .catch((err) => console.log('Typeset failed: ' + err.message));
    });

    this.board.unsuspendUpdate();
  }
}

