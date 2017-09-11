import { Circle } from './circle.js';

export class Food extends Circle {
  constructor(xPos, yPos, radius) {
    super(xPos, yPos, radius);
  }
}

export class FoodManager {
  constructor(count, radius, width, height) {
    this.count = count;
    this.radius = radius;
    this.width = width;
    this.height = height;

    this.food = [];
  }

  getFood() {
    return this.food;
  }

  spawnFood() {
    let xPos = Math.random() * (this.width - this.radius / 2);
    let yPos = Math.random() * (this.height - this.radius / 2);

    this.food.push(new Food(xPos, yPos, this.radius));
  }

  update() {
    // todo: food spawn logic here
    while(this.food.length < this.count) {
      this.spawnFood();
    }
  }
}