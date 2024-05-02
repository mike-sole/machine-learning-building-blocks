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

JXG.Options.text.useMathJax = true;
var board = JXG.JSXGraph.initBoard("jxgbox", {
boundingbox: [-10, 10, 10, -10],
axis: true,
showCopyright: false
});

board.suspendUpdate();

var vectorA = board.create("point", [5, 4], {
face: "o",
size: 2,
name: "\\[ \\vec{a} \\]",
});
board.create("arrow", [[0, 0], vectorA], {fixed: true});

var vectorB = board.create("point", [2, 8], {
face: "o",
size: 2,
name: "\\[ \\vec{b} \\]",
});
board.create("arrow", [[0, 0], vectorB], {fixed: true});

const angle = board.create("angle", [vectorA, [0, 0], vectorB], {
radius: 1,
fixed: true,
name: function () {
return (
  "&theta;"
);
},
});

function getMagnitude(point) {
return JXG.Math.Geometry.distance([0,0], [point.X(), point.Y()]);
}

function getDotProduct(a, b) {
return (a.X() * b.X() + a.Y() * b.Y());
}

function getUnitVector(v) {
const magnitude = getMagnitude(v);
return new Point(v.X() / magnitude, v.Y() / magnitude);
} 

var vectorProj = board.create("point", 
[
() => {
  const dotProduct = getDotProduct(vectorA, vectorB);
  const vectorBMagnitude = getMagnitude(vectorB);
  
  return (vectorB.X() * dotProduct) / (vectorBMagnitude * vectorBMagnitude);
},
() => {
  const dotProduct = getDotProduct(vectorA, vectorB);
  const vectorBMagnitude = getMagnitude(vectorB);

  return (vectorB.Y() * dotProduct) / (vectorBMagnitude * vectorBMagnitude);
}
], 
{
face: "o",
size: 2,
fixed: true,
name: "\\[ \\textit{proj}_{\\vec{b}}\\vec{a} \\]"
});
board.create("arrow", [[0, 0], vectorProj], {fixed: true});

board.create('line', [vectorA, vectorProj], {strokeWidth:2, dash:2, straightFirst:false, straightLast:false, fixed: true});

board.create("angle", [[0, 0], vectorProj, vectorA], {
radius: 0.5,
fixed: true,
name: function () {
return (
  ''
);
},
});

board.create("text", [
-9,
6.5,
function () {

  const dotProduct = getDotProduct(vectorA, vectorB);

  const vectorAMagnitude = getMagnitude(vectorA);
  const vectorBMagnitude = getMagnitude(vectorB);

  const unitVectorA = getUnitVector(vectorA);
  const unitVectorB = getUnitVector(vectorB);
  const unitDotProduct = getDotProduct(unitVectorA, unitVectorB);

  const angleDegrees = Math.acos(unitDotProduct) * (180 / Math.PI);


  const angleCos = Math.cos(angle.Value('radian'));

  /*
  return (

  "<br> unit vector dot product: " + unitDotProduct.toFixed(2) +
  "<br> angle: " + angleDegrees.toFixed(2) +
  "<br> the angle: " + angle.Value('degree').toFixed(2) +

  "<br> calculated dot " + (angleCos * vectorAMagnitude * vectorBMagnitude).toFixed(2)
);*/

 const vectorALine = `\\[ \\vec{a} = \\left(\\begin{matrix} ${vectorA.X().toFixed(2)} & ${vectorA.Y().toFixed(2)} \\end{matrix}\\right)\\]`
 const vectorBLine = `\\[ \\vec{b} = \\left(\\begin{matrix} ${vectorB.X().toFixed(2)} & ${vectorB.Y().toFixed(2)} \\end{matrix}\\right)\\]`
 const dotProductLine = `\\[ \\vec{a} \\cdot \\vec{b} = ${dotProduct.toFixed(2)} \\]`
 

 const vectorAMagnitudeLine = `\\[ \\vert\\vert \\vec{a} \\vert\\vert = ${vectorAMagnitude.toFixed(2)} \\]`
 const vectorBMagnitudeLine = `\\[ \\vert\\vert \\vec{a} \\vert\\vert = ${vectorBMagnitude.toFixed(2)} \\]`

 const cosTheta = `\\[ \\cos\\theta = ${angleCos.toFixed(2)} \\]`

 const unitVectorALine = `\\[ \\hat{a} = \\left(\\begin{matrix} ${unitVectorA.X().toFixed(2)} & ${unitVectorA.Y().toFixed(2)} \\end{matrix}\\right)\\]`
 const unitVectorBLine = `\\[ \\hat{b} = \\left(\\begin{matrix} ${unitVectorB.X().toFixed(2)} & ${unitVectorB.Y().toFixed(2)} \\end{matrix}\\right)\\]`


 return `${vectorALine} ${vectorBLine} ${vectorAMagnitudeLine} ${vectorBMagnitudeLine} ${cosTheta} ${unitVectorALine} ${unitVectorBLine}`


},
]);

board.create("text", [
-9,
-3,
function () {

  const dotProduct = getDotProduct(vectorA, vectorB);

  const vectorAMagnitude = getMagnitude(vectorA);
  const vectorBMagnitude = getMagnitude(vectorB);

  const unitVectorA = getUnitVector(vectorA);
  const unitVectorB = getUnitVector(vectorB);
  const unitDotProduct = getDotProduct(unitVectorA, unitVectorB);

  const angleDegrees = Math.acos(unitDotProduct) * (180 / Math.PI);


  const angleCos = Math.cos(angle.Value('radian'));

  /*
  return (

  "<br> unit vector dot product: " + unitDotProduct.toFixed(2) +
  "<br> angle: " + angleDegrees.toFixed(2) +
  "<br> the angle: " + angle.Value('degree').toFixed(2) +

  "<br> calculated dot " + (angleCos * vectorAMagnitude * vectorBMagnitude).toFixed(2)
);*/

 const dotProductLine = `\\( \\vec{a} \\cdot \\vec{b} = ${dotProduct.toFixed(2)} \\) <br>`
 
 const dotProductLineCalc1 = `\\( \\vec{a} \\cdot \\vec{b} = ${vectorA.X().toFixed(2)} * ${vectorB.X().toFixed(2)} +  ${vectorA.Y().toFixed(2)} * ${vectorB.Y().toFixed(2)} \\) <br>`;
 const dotProductLineCalc2 = `\\( \\vec{a} \\cdot \\vec{b} =  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert \\cos\\theta =  ${vectorAMagnitude.toFixed(2)} * ${vectorBMagnitude.toFixed(2)} * ${angleCos.toFixed(2)} \\) <br>`


 const cosTheta = `\\( \\cos\\theta = ${angleCos.toFixed(2)} \\)`;

 return `${dotProductLine} ${dotProductLineCalc1} ${dotProductLineCalc2}` ;


},
]);

board.create("text", [
-9,
-6,
function () {

  const dotProduct = getDotProduct(vectorA, vectorB);

  const vectorAMagnitude = getMagnitude(vectorA);
  const vectorBMagnitude = getMagnitude(vectorB);

  const cosThetaCalc = dotProduct / (vectorAMagnitude * vectorBMagnitude);

  const unitVectorA = getUnitVector(vectorA);
  const unitVectorB = getUnitVector(vectorB);
  const unitDotProduct = getDotProduct(unitVectorA, unitVectorB);

  const angleDegrees = Math.acos(unitDotProduct) * (180 / Math.PI);


  const angleCos = Math.cos(angle.Value('radian'));

  /*
  return (

  "<br> unit vector dot product: " + unitDotProduct.toFixed(2) +
  "<br> angle: " + angleDegrees.toFixed(2) +
  "<br> the angle: " + angle.Value('degree').toFixed(2) +

  "<br> calculated dot " + (angleCos * vectorAMagnitude * vectorBMagnitude).toFixed(2)
);*/


const dotProductLineCalc1 = `\\( \\vec{a} \\cdot \\vec{b} = ${vectorA.X().toFixed(2)} * ${vectorB.X().toFixed(2)} +  ${vectorA.Y().toFixed(2)} * ${vectorB.Y().toFixed(2)} \\) <br>`;
 const dotProductLineCalc2 = `\\( \\vec{a} \\cdot \\vec{b} =  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert \\cos\\theta =  ${vectorAMagnitude.toFixed(2)} * ${vectorBMagnitude.toFixed(2)} * ${angleCos.toFixed(2)} \\) <br>`


 const cosineFormulae = '\\cos \\theta = \\dfrac{ \\vec{a} \\cdot \\vec{b}  }{  \\vert\\vert \\vec{a} \\vert\\vert \\: \\vert\\vert \\vec{b} \\vert\\vert }'
 const cosineFormulaeWithVariables = `\\dfrac{ ${dotProduct} }{ ${vectorAMagnitude.toFixed(2)} * ${vectorBMagnitude.toFixed(2)} } `;
 const cosTheta = `\\( ${cosineFormulae} = ${cosineFormulaeWithVariables} = ${cosThetaCalc.toFixed(2)} \\)`;
 const cosThetaNorms = `\\( \\cos \\theta = \\hat{a} \\cdot \\hat{b} = ${unitDotProduct.toFixed(2)} \\)`

 return `${cosTheta} <br> ${cosThetaNorms}`;


},
]);

board.unsuspendUpdate();