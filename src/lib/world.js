import { Player } from './player.js';
import { Food, FoodManager } from './food.js';
import { Constants } from './constants.js';

export class World {
  constructor() {
    this.players = {};
    this.foodManager = new FoodManager(Constants.FOOD_COUNT, this);
  }

  createPlayer(id) {
    // random spawn position
    let xPos = Math.random() * Constants.WORLD_HEIGHT;
    let yPos = Math.random() * Constants.WORLD_WIDTH;

    let startTime = Date.now();
    startTime += 1000 * Constants.PLAYER_INVINC;

    this.players[id] = new Player(xPos, yPos, Constants.PLAYER_SIZE, startTime, id);
  }

  removePlayer(id) {
    delete this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  getFood() {
    return this.foodManager.getFood();
  }

  getPlayer(id) {
    return this.players[id];
  }

  step(timeDelta) {
    // step for each player
    for(let id in this.players) {
      let player = this.players[id];
      player.updateVelocity(Constants.VEL_STEP);
      player.step(timeDelta, Constants.FRICTION);
    }

    // handle food collisions and generate new food
    this.foodManager.update();

    // handle collision for each player
    for(let id in this.players) {
      this.handlePlayerCollisions(this.players[id]);
    }
  }

  handlePlayerCollisions(player) {
    let collisionFound = false;
    let recursePlayer = undefined;

    for(let key in this.players) {
      if(key !== player.id && player.collidesWithPlayer(this.players[key])) {
        let otherPlayer = this.players[key];
        collisionFound = true;
        
        // two ways to win:
        // 1. You are larger
        // 2. You are tied and win the coin toss
        if(player.width > otherPlayer.width || (player.width === otherPlayer.width && player.surviveTie()) ) {
          this.removePlayer(otherPlayer.id, "You've been chomped");
          player.grow(Constants.PLAYER_GROWTH);
          recursePlayer = player;
        }
        else {
          this.removePlayer(player.id, "You've been chomped");
          otherPlayer.grow(Constants.PLAYER_GROWTH);
          recursePlayer = otherPlayer;
        }

        // break from for loop if collision found, bc you need to check all over again
        break;
      }
    }

    // recursive call to handle collisions for the surviving player
    if(collisionFound) {
      this.handlePlayerCollisions(recursePlayer);
    }
  }
}