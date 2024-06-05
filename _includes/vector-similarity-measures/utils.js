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
  