export class Player {
  constructor(xPos, yPos, radius, socketId) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.id = socketId;
  }

  capPosition(lowerX, lowerY, upperX, upperY)
  {
    this.xPos = Math.max(this.xPos, lowerX);
    this.yPos = Math.max(this.yPos, lowerY);
    this.xPos = Math.min(this.xPos, upperX - this.radius);
    this.yPos = Math.min(this.yPos, upperY - this.radius);
  }
}