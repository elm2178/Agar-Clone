import { Rect } from './rect.js';

export class Player extends Rect {
  constructor(xPos, yPos, length, startTime, id) {
    super(xPos, yPos, length, length);
    this.xPos = xPos;
    this.yPos = yPos;
    this.xVel = 0;
    this.yVel = 0;
    this.width = length;
    this.height = length;
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
    this.yPos = Math.min(this.yPos, upperY - this.height);
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

  collidesWithRect(other) {
    let currTime = Date.now();
    if(this.startTime > currTime || other.startTime > currTime) {
      return false;
    }

    return super.collidesWithRect(other);
  }

  surviveTie() {
    return (Math.floor(Math.random() * 2) == 0);
  }

  grow(size) {
    this.width += size;
    this.height += size;
    this.xPos -= Math.floor(size/2);
    this.yPos -= Math.floor(size/2);
  }
}