import { Player } from './player.js';

export class World {
  constructor(width, height) {
    this.HEIGHT = 600;
    this.WIDTH = 600;
    this.PLAYER_WIDTH = 10;
    this.VEL = 20;
    this.GROWTH = 10;
    this.FRICTION = .982;
    this.players = {};
  }

  createPlayer(id) {
    this.players[id] = new Player(0, 0, this.PLAYER_WIDTH, id);
  }

  removePlayer(id) {
    delete this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  movePlayer(id, dir) {
    let p = this.players[id];
    
    // ignore invalid move commands
    if(!p)
      return;

    if(dir === "up") {
      p.yVel = -this.VEL;
    }
    else if(dir === "down") {
      p.yVel = this.VEL;
    }
    else if(dir === "right") {
      p.xVel = this.VEL;
    }
    else if(dir === "left") {
      p.xVel = -this.VEL;
    }
  }

  step(timeDelta) {
    // step for each player
    for(let id in this.players) {
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
      if(key !== player.id && player.collidesWith(this.players[key])) {
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