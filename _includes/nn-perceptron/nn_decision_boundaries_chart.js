const SIMPLE_LBL_NONE = 0;
const SIMPLE_LBL_BASIC = 1;
const SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS = 2;
const MATHS_EQUATIONS = 3;

JXG.Options.text.useMathJax = true;

class Chart {
  constructor(name, showLabelOption) {
    this.showLabelOption = showLabelOption;

    this.points = [];

    this.board = JXG.JSXGraph.initBoard(name, {
      boundingbox: [-6, 6, 6, -6],
      axis: true,
      showCopyright: false,
    });

    this.board.suspendUpdate();

    this.weightVectorX = -2;
    this.weightVectorY = 2;

    this.weightVector = this.board.create(
      "point",
      [this.weightVectorX, this.weightVectorY],
      {
        face: "o",
        size: 2,
        name: `\\[ \\vec{w} \\]`,
      }
    );

    this.weightUnitVector = this.board.create(
      "point",
      [
        () => getUnitVector(this.weightVector).X(),
        () => getUnitVector(this.weightVector).Y(),
      ],
      {
        face: "o",
        size: 2,
        name: `\\[ \\vec{w} \\]`,
        visible: false,
      }
    );

    var invisibleWeightVectorLine = this.board.create(
      "line",
      [this.weightUnitVector, [0, 0]],
      {
        visible: false,
      }
    );

    this.bias = this.board.create("glider", [invisibleWeightVectorLine], {
      size: 2,
      name: `\\[ b \\]`,
    });

    this.addPoint(3.0, 5.0, "action");
    this.addPoint(1.6, 3.6, "action");
    this.addPoint(1, 2.5, "action");
    this.addPoint(1.2, 4, "action");

    this.addPoint(5, 4, "comedy");
    this.addPoint(4, 3.5, "comedy");
    this.addPoint(4.75, 2.5, "comedy");

    this.bias.on("drag", (e, i) => this.updateBias());
    this.weightVector.on("drag", (e, i) => this.updateWeightVec());

    this.board.create("perpendicular", [invisibleWeightVectorLine, this.bias]);

    this.board.create("arrow", [this.bias, this.weightVector], {
      fixed: true,
    });

    this.updatePointClassifications();

    this.board.unsuspendUpdate();
  }

  updateBias() {
    const distanceFromOrigin = Math.abs(
      this.weightUnitVector.X() * this.bias.X() +
        this.weightUnitVector.Y() * this.bias.Y()
    );

    console.log('distance from origin ' + distanceFromOrigin)

    // move the weight vector with the bias
    this.weightVector.setPositionDirectly(JXG.COORDS_BY_USER, [
      this.weightVectorX + this.bias.X(),
      this.weightVectorY + this.bias.Y(),
    ]);

    this.updatePointClassifications();
  }

  updateWeightVec() {
    // keep track of when the user adjusts the weight vector
    this.weightVectorX = this.weightVector.X() - this.bias.X();
    this.weightVectorY = this.weightVector.Y() - this.bias.Y();

    this.updatePointClassifications();
  }

  updatePointClassifications() {
    this.points.forEach((pt) => {
      
      const dotProduct =
        this.weightVector.X() * (pt.X() - this.bias.X()) +
        this.weightVector.Y() * (pt.Y() - this.bias.Y());
      
      dotProduct >= 0
        ? pt.setAttribute({ color: "red" })
        : pt.setAttribute({ color: "blue" });
    });
  }

  addPoint(x, y, name) {
    const pt = this.board.create("point", [x, y], {
      face: "o",
      size: 2,
      name: `\\[ ${name} \\]`,
    });

    pt.on("drag", (e, i) => this.updatePointClassifications());

    this.points.push(pt);
  }
}
