import { CollisionHelper } from './collisionHelper.js';
import { Circle } from './circle.js';

export class Rect {
   /**
   * @param {number} xPos
   * @param {number} yPos
   * @param {number} width
   * @param {number} height
   */
  constructor(xPos, yPos, width, height) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
  }

  /**
   * @param {number} lowerX
   * @param {number} lowerY
   * @param {number} upperX
   * @param {number} upperY
   */
  capPosition(lowerX, lowerY, upperX, upperY)
  {
    this.xPos = Math.max(this.xPos, lowerX);
    this.yPos = Math.max(this.yPos, lowerY);
    this.xPos = Math.min(this.xPos, upperX - this.width);
    this.yPos = Math.min(this.yPos, upperY - this.height);
  }

  /**
   * @param {Rect} other
   */
  collidesWithRect(other) {
    return CollisionHelper.rectCollision(this, other);
  }

  /**
   * @param {Circle} circle
   */
  collidesWithCircle(circle) {
    return CollisionHelper.circleRectCollision(circle, this);
  }
}