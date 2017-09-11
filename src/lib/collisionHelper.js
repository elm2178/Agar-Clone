export class CollisionHelper {
  static rectToRectCollision(rect1, rect2) {
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

  static circleToCircleCollision(cir1, cir2) {
    // calc distance between two centers
    let dist = distance(cir1.xPos, cir1.yPos, cir2.xPos, cir2.yPos);

    // if distance is less than the sum of the radius, collision!
    if(dist < cir1.radius + cir2.radius) {
      return true;
    }

    return false;
  }
}