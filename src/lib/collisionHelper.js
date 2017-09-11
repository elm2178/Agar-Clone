import { Rect } from "./rect.js";

export class CollisionHelper {
  static rectCollision(rect1, rect2) {
    if(rect2.xPos >= (rect1.xPos + rect1.width))  {
      return false;
    }
    else if(rect2.xPos + rect2.width <= rect1.xPos) {
      return false;
    }
    else if(rect2.yPos >= rect1.yPos + rect1.height) {
      return false;
    }
    else if(rect2.yPos + rect2.height <= rect1.yPos) {
      return false;
    }
    
    return true;
  }

  static distance(x1, y1, x2, y2) {
    return Math.hypot(x1 - x2, y1 - y2);
  }

  static circleCollision(cir1, cir2) {
    // calc distance between two centers
    let dist = this.distance(cir1.xPos, cir1.yPos, cir2.xPos, cir2.yPos);

    // if distance is less than the sum of the radius, collision!
    if(dist < cir1.radius + cir2.radius) {
      return true;
    }

    return false;
  }

  static circleRectCollision(circle, rect) {
    // create a rect from the circle
    let circleRect = new Rect(circle.xPos - circle.radius, circle.yPos - circle.radius, circle.radius * 2, circle.radius * 2);
    
    // check for simpler rect collision first
    if (this.rectCollision(circleRect, rect)) {
      // see if there are any simple side collisions
      let rectCenterX = rect.xPos + rect.width / 2;
      let rectCenterY = rect.yPos + rect.height / 2;
      let xDist = Math.abs(rectCenterX - circle.xPos);
      let yDist = Math.abs(rectCenterY - circle.yPos);
      
      // side collisions
      if(xDist < rect.width/2 + circle.radius) {
        return true;
      }
      if(yDist < rect.height/2 + circle.radius) {
        return true;
      }

      // check for a corner collision
      let distToCornerX = xDist - rect.width / 2;
      let distToCornerY = yDist - rect.height / 2;
      if(distToCornerX*distToCornerX + distToCornerY*distToCornerY < circle.radius*circle.radius) {
        return true;
      }
    }
    
    return false;
  }
}