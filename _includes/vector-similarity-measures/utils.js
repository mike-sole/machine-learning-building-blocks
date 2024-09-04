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

function createVector(board, coord, symbol, style, ptSize) {
  const vec = board.create("point", coord, {
    face: "o",
    size: ptSize,
    name: `\\[ \\vec{${symbol}} \\]`,
  });

  const arrow = board.create("arrow", [[0, 0], vec], {
    fixed: true,
  });

  if (style) {
    board.create("smartlabel", [arrow], {
      measure: "length",
      cssClass: `smart-label-pure ${style}`,
    });
  }

  return vec;
}

function createFixedVector(board, coord, symbol, style) {
  return createVector(board, coord, symbol, style, 0);
}

function createInteractiveVector(board, coord, symbol, style) {
  return createVector(board, coord, symbol, style, 2);
}
