export class Player {
  constructor(xPos, yPos, width, startTime, id) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.width = width;
    this.id = id;
    this.startTime = startTime; 

    // current movement status
    this.movement = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }

  capPosition(lowerX, lowerY, upperX, upperY)
  {
    this.xPos = Math.max(this.xPos, lowerX);
    this.yPos = Math.max(this.yPos, lowerY);
    this.xPos = Math.min(this.xPos, upperX - this.width);
    this.yPos = Math.min(this.yPos, upperY - this.width);
  }

  capVelocity(lowerX, lowerY, upperX, upperY)
  {
    this.xVel = Math.max(this.xVel, lowerX);
    this.yVel = Math.max(this.yVel, lowerY);
    this.xVel = Math.min(this.xVel, upperX);
    this.yVel = Math.min(this.yVel, upperY);
  }

  setSpeed(xVel, yVel) {
    this.xVel = xVel;
    this.yVel = yVel;
  }

  step(timeDelta, friction) {
    // update vel
    this.xVel *= friction;
    this.yVel *= friction;

    // update pos
    this.xPos += this.xVel * timeDelta;
    this.yPos += this.yVel * timeDelta;
  }

  collidesWith(other) {
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