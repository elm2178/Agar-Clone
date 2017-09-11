export class Rect {
  constructor(xPos, yPos, width, height) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
  }

  collidesWithRect(other) {
    let currTime = Date.now();
    if(this.startTime > currTime || other.startTime > currTime) {
      return false;
    }

    if(other.xPos >= (this.xPos + this.width))  {
      return false;
    }
    else if(other.xPos + other.width <= this.xPos) {
      return false;
    }
    else if(other.yPos >= this.yPos + this.height) {
      return false;
    }
    else if(other.yPos + other.height <= this.yPos) {
      return false;
    }

    return true;
  }
}