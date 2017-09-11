import { CollisionHelper } from './collisionHelper.js';

export class Rect {
  constructor(xPos, yPos, width, height) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
  }

  collidesWithRect(other) {
    return CollisionHelper.rectToRectCollision(this, other);
  }
}