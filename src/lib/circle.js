import { CollisionHelper } from './collisionHelper.js';

export class Circle {
  /**
   * @param {number} xPos
   * @param {number} yPos
   * @param {number} radius
   */
  constructor(xPos, yPos, radius) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
  }

  /**
   * @param {Circle} other
   */
  collidesWithCircle(other) {
    return CollisionHelper.circleCollision(other);
  }
}