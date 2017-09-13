import { Circle } from './circle.js';
import { World } from './world.js';
import { Constants } from './constants.js';

export class Food extends Circle {
  /**
   * @param {number} xPos
   * @param {number} yPos
   * @param {number} radius
   * @param {number} endTime
   */
  constructor(xPos, yPos, radius, endTime) {
    super(xPos, yPos, radius);
    this.endTime = endTime;
    this.startTime = Date.now();
  }

  isExpired() {
    return Date.now() > this.endTime
  }
}

export class FoodManager {
  /**
   * @param {number} count
   * @param {number} radius
   * @param {World} world
   */
  constructor(count, world) {
    this.count = count;
    this.world = world;

    this.food = [];
  }

  getFood() {
    return this.food;
  }

  spawnFood() {
    let xPos = Math.random() * (Constants.WORLD_WIDTH - 2*Constants.FOOD_RAD) + Constants.FOOD_RAD;
    let yPos = Math.random() * (Constants.WORLD_HEIGHT - 2*Constants.FOOD_RAD) + Constants.FOOD_RAD;

    // add some randomness to food duration
    let duration = (Constants.FOOD_DUR * Math.random() + 5) * 1000;
    let endTime = Date.now() + duration;

    this.food.push(new Food(xPos, yPos, Constants.FOOD_RAD, endTime));
  }

  update() {
    // remove expired food
    this.expireFood();
    // handle food collisions
    this.handleFoodCollisions();
    // spawn new food
    while(this.food.length < this.count) {
      this.spawnFood();
    }
  }

  expireFood() {
    this.food = this.food.filter(function(f) {
      return !f.isExpired();
    });
  }

  handleFoodCollisions() {
    for(let id in this.world.players) {
      let player = this.world.getPlayer(id);
      let self = this;
      this.food = this.food.filter(function(f) {
        let collision = player.collidesWithFood(f);
        if(collision) {
          // handle collision
          player.grow(Constants.PLAYER_GROWTH);
          return false;
        }

        return true;
      });
    }
  }
}