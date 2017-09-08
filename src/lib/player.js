export class Player {
  constructor(xPos, yPos, width, socketId) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.id = socketId;
  }

  capPosition(lowerX, lowerY, upperX, upperY)
  {
    this.xPos = Math.max(this.xPos, lowerX);
    this.yPos = Math.max(this.yPos, lowerY);
    this.xPos = Math.min(this.xPos, upperX - this.width);
    this.yPos = Math.min(this.yPos, upperY - this.width);
  }

  collidesWith(other) {
    if(other.xPos >= (this.xPos + this.width))  {
      return false;
    }
    else if(other.xPos + other.width <= this.xPos) {
      return false;
    }
    else if(other.yPos >= this.yPos + this.width) {
      return false;
    }
    else if(other.yPos + other.width <= this.yPos) {
      return false;
    }

    return true;
  }

  surviveTie() {
    return (Math.floor(Math.random() * 2) == 0);
  }

  grow(size) {
    this.width += size;
    this.xPos -= Math.floor(size/2);
    this.yPos -= Math.floor(size/2);
  }
}