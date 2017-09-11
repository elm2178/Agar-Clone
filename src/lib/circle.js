import { CollisionHelper } from './collisionHelper.js';

export class Circle {
  /**
   * @param {number} 
   */
  constructor(xPos, yPos, radius) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
  }

  collidesWithCircle(other) {
    return CollisionHelper.circleCollision(other);
  }
}