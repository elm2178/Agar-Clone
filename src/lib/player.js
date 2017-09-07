export class Player {
  constructor(xPos, yPos, radius, socketId) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.radius = radius;
    this.id = socketId;
  }
}