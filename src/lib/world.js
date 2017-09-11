import { Player } from './player.js';

export class World {
  constructor(width, height) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.PLAYER_WIDTH = 10;
    this.VEL = 1;
    this.VEL_CAP = 40;
    this.GROWTH = 10;
    this.FRICTION = .973;
    this.IMMUNE = 5;
    this.players = {};
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

  getPlayer(id) {
    return this.players[id];
  }

  movePlayer(id) {
    let p = this.players[id];
    
    // ignore invalid move commands
    if(!p)
      return;

    if(p.movement.up) {
      p.yVel += -this.VEL;
    }
    if(p.movement.down) {
      p.yVel += this.VEL;
    }
    if(p.movement.right) {
      p.xVel += this.VEL;
    }
    if(p.movement.left) {
      p.xVel += -this.VEL;
    }
    p.capVelocity(-this.VEL_CAP, -this.VEL_CAP, this.VEL_CAP, this.VEL_CAP);
  }

  step(timeDelta) {
    // step for each player
    for(let id in this.players) {
      this.movePlayer(id);
      this.players[id].step(timeDelta, this.FRICTION);
      this.players[id].capPosition(0, 0, this.WIDTH, this.HEIGHT);
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
      if(key !== player.id && player.collidesWithRect(this.players[key])) {
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