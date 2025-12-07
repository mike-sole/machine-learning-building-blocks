const SIMPLE_LBL_NONE = 0;
const SIMPLE_LBL_BASIC = 1;
const SIMPLE_LBL_BASIC_MULTI_DOT_PRODUCT_REPRESENTATIONS = 2;
const MATHS_EQUATIONS = 3;

JXG.Options.text.useMathJax = true;

class Chart {
  constructor(name, showLabelOption, classOnePoints, classTwoPoints, showBias) {

    this.showLabelOption = showLabelOption;

    this.classOnePoints = [];
    this.classTwoPoints = [];

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
        color: "green",
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

    classOnePoints.forEach((pt) => this.addPoint(0, pt.x, pt.y, `\\text{${pt.label}}`));
    classTwoPoints.forEach((pt) => this.addPoint(1, pt.x, pt.y, `\\text{${pt.label}}`));

    this.bias = this.board.create("glider", [invisibleWeightVectorLine], {
      size: 2,
      visible: showBias,
      name: `\\[ b \\]`,
    });

    if(showBias) {
      this.bias.on("drag", (e, i) => this.updateBias());
    }

    this.weightVector.on("drag", (e, i) => this.updateWeightVec());

    this.board.create("perpendicular", [invisibleWeightVectorLine, this.bias],
      {
        strokeWidth: 3, 
        dash: 2
      }
    );

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
    this.classOnePoints.forEach((pt) => {
      
      const dotProduct =
        this.weightVector.X() * (pt.X() - this.bias.X()) +
        this.weightVector.Y() * (pt.Y() - this.bias.Y());
      
      dotProduct >= 0
        ? pt.setAttribute({ color: "red" })
        : pt.setAttribute({ color: "blue" });

      pt.setAttribute({ name: `${dotProduct.toFixed(2)}` });

    });

    this.classTwoPoints.forEach((pt) => {
      
      const dotProduct =
        this.weightVector.X() * (pt.X() - this.bias.X()) +
        this.weightVector.Y() * (pt.Y() - this.bias.Y());
      
      dotProduct >= 0
        ? pt.setAttribute({ color: "red" })
        : pt.setAttribute({ color: "blue" });

      pt.setAttribute({ name: `${dotProduct.toFixed(2)}` });

    });
  }

  addPoint(classLbl, x, y, name) {
    const pt = this.board.create("point", [x, y], {
      face: "o",
      size: 2,
      name: `\\[ ${name} \\]`,
    });

    pt.on("drag", (e, i) => this.updatePointClassifications());

    if(classLbl === 0) {
      this.classOnePoints.push(pt);
    } else {
      this.classTwoPoints.push(pt);
    }
  }
}

function createPoint(x, y, label) {
  return { x: x, y: y, label: label };
}

function createFirstExampleChart(name, showLabelOption) {

    const showBias = false;

    const classOnePoints = [
      createPoint(3.0, 5.0, "spam"),
      createPoint(1, 2.5, "spam"),
      createPoint(1.2, 4, "spam"),
      createPoint(-4.75, 3.2, "spam"),
      createPoint(-4, 2.8, "spam"),
      createPoint(-4.5, 2.1, "spam"),
    ];
    
    const classTwoPoints = [
      createPoint(5, 4, "not spam"),
      createPoint(4, 3.5, "not spam"),
      createPoint(4.75, 2.5, "not spam"),
      createPoint(-2, -2.2, "not spam"),
      createPoint(-3, -2.75, "not spam"),
      createPoint(-1.75, -3.67, "not spam"),
    ];

  return new Chart(
    name, 
    showLabelOption,
    classOnePoints,
    classTwoPoints,
    showBias);
}

function createSecondExampleChart(name, showLabelOption) {
  return new Chart(name, showLabelOption);
}
