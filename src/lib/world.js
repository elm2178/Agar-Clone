import { Player } from './player.js';
import { Food } from './food.js';

export class World {
  constructor(width, height) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.PLAYER_WIDTH = 10;
    this.VEL_STEP = 1;
    this.VEL_CAP = 40;
    this.GROWTH = 10;
    this.FRICTION = .973;
    this.IMMUNE = 5;
    this.players = {};
    this.food = [];
  }

  createPlayer(id) {
    // random spawn position
    let xPos = Math.random() * this.HEIGHT;
    let yPos = Math.random() * this.WIDTH;

    let startTime = Date.now();
    startTime += 1000 * this.IMMUNE;

    this.players[id] = new Player(xPos, yPos, this.PLAYER_WIDTH, startTime, id);
  }

  removePlayer(id) {
    delete this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  getFood() {
    return this.food;
  }

  getPlayer(id) {
    return this.players[id];
  }

  step(timeDelta) {

    // step for each player
    for(let id in this.players) {
      let player = this.players[id];
      player.updateVelocity(this.VEL_STEP);
      player.capVelocity(-this.VEL_CAP, -this.VEL_CAP, this.VEL_CAP, this.VEL_CAP);
      player.step(timeDelta, this.FRICTION);
      player.capPosition(0, 0, this.WIDTH, this.HEIGHT);
    }

    // handle food collisions
    for(let id in this.players) {
      let player = this.players[id];
      let world = this;
      this.food = this.food.filter(function(f) {
        let collision = player.collidesWithFood(f);
        if(collision) {
          // handle collision
          player.grow(world.GROWTH);
          player.capPosition(0, 0, world.WIDTH, world.HEIGHT);

          return false;
        }

        return true;
      });
    }

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
          player.grow(this.GROWTH);
          player.capPosition(0, 0, this.WIDTH, this.HEIGHT);
          recursePlayer = player;
        }
        else {
          this.removePlayer(player.id, "You've been chomped");
          otherPlayer.grow(this.GROWTH);
          otherPlayer.capPosition(0, 0, this.WIDTH, this.HEIGHT);
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