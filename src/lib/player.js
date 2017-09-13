import { Rect } from './rect.js';
import { Food } from './food.js';
import { Constants } from './constants.js';

export class Player extends Rect {
  /**
   * @param {number} xPos
   * @param {number} yPos
   * @param {number} length
   * @param {number} startTime
   * @param {string} id
   */
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

  capPosition() {
    super.capPosition(0, 0, Constants.WORLD_WIDTH, Constants.WORLD_HEIGHT);
  }
 
  /**
   * @param {number} lowerX
   * @param {number} lowerY
   * @param {number} upperX
   * @param {number} upperY
   */
  capVelocity(lowerX, lowerY, upperX, upperY)
  {
    this.xVel = Math.max(this.xVel, lowerX);
    this.yVel = Math.max(this.yVel, lowerY);
    this.xVel = Math.min(this.xVel, upperX);
    this.yVel = Math.min(this.yVel, upperY);
  }

  /**
   * @param {number} xVel
   * @param {number} yVel
   */
  setSpeed(xVel, yVel) {
    this.xVel = xVel;
    this.yVel = yVel;
  }

  /**
   * @param {number} step
   */
  updateVelocity(step) {
    if(this.movement.up) {
      this.yVel += -step;
    }
    if(this.movement.down) {
      this.yVel += step;
    }
    if(this.movement.right) {
      this.xVel += step;
    }
    if(this.movement.left) {
      this.xVel += -step;
    }

    this.capVelocity(-Constants.VEL_CAP, -Constants.VEL_CAP, Constants.VEL_CAP, Constants.VEL_CAP);
  }

  /**
   * @param {number} timeDelta
   * @param {number} friction
   */
  step(timeDelta, friction) {
    // update vel
    this.xVel *= friction;
    this.yVel *= friction;

    // update pos
    this.xPos += this.xVel * timeDelta;
    this.yPos += this.yVel * timeDelta;

    this.capPosition();
  }

  /**
   * @param {Player} other
   */
  collidesWithPlayer(other) {
    let currTime = Date.now();
    if(this.startTime > currTime || other.startTime > currTime) {
      return false;
    }

    return super.collidesWithRect(other);
  }

  /**
   * @param {Food} food
   */
  collidesWithFood(food) {
    return super.collidesWithCircle(food);
  }

  surviveTie() {
    return (Math.floor(Math.random() * 2) == 0);
  }

  /**
   * @param {number} size
   */
  grow(size) {
    this.width += size;
    this.height += size;
    this.xPos -= Math.floor(size/2);
    this.yPos -= Math.floor(size/2);

    this.capPosition();
  }
}