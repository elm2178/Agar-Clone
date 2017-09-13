import { ColorHelper } from './colorHelper.js';

export class Camera {
  constructor(player, worldWidth, worldHeight) {
    this.player = player;
    // todo: change to x pos y pos
    this.xPos = 0; 
    this.yPos = 0;
    this.width = worldHeight / 3;
    this.height = worldWidth / 3;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.colorHelper = new ColorHelper();
    this.gridSpace = 10;

    this.colorHelper.setPlayerColor(this.player.id, ColorHelper.getRGBString(ColorHelper.DARK_BLUE));
  }

  getCamOffset() {
    // get player cetner position
    let offset = {
      x: this.player.xPos + this.player.width / 2 - this.width / 2,
      y: this.player.yPos + this.player.height / 2 - this.height / 2,
    }

    // cap by boundary
    offset.x = Math.max(0, offset.x);
    offset.x = Math.min(this.worldWidth - this.width, offset.x);
    offset.y = Math.max(0, offset.y);
    offset.y = Math.min(this.worldHeight - this.height, offset.y);

    return offset;
  }

  update(gameState) {
    // update player
    this.player = gameState.players[this.player.id];
  }

  render(canvas, gameState) {
    let player = gameState.players[this.player.id];

    if(player) {
      this.player = player;
    }

    // get context
    let ctx = canvas.getContext("2d");
    let offset = this.getCamOffset();

    // get players and food from gameState
    let players = gameState.players;
    let food = gameState.food;
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // draw grid
    for(let i = 0; i <= this.worldWidth; i += this.gridSpace) {
      ctx.moveTo(i - offset.x, -offset.y);
      ctx.strokeStyle = "#dbdbdb";
      ctx.lineTo(i-offset.x, this.worldHeight-offset.y);
      ctx.stroke();
    }
    for(let i = 0; i <= this.worldHeight; i += this.gridSpace) {
      ctx.moveTo(-offset.x, i - offset.y);
      ctx.strokeStyle = "#dbdbdb";
      ctx.lineTo(this.worldWidth - offset.x, i - offset.y);
      ctx.stroke();
    }

    // draw players
    for(let id in players) {
      let p = players[id];
      let color = this.colorHelper.getPlayerColor(p);
      // draw rect
      ctx.beginPath();
      ctx.rect(p.xPos - offset.x, p.yPos - offset.y, p.width, p.height);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // draw food
    food.forEach(function(f) {
      // get food color
      let colorWeight = ColorHelper.getFoodColorWeight(f);
      let color = ColorHelper.getColorFromGradient(ColorHelper.GREEN, ColorHelper.BROWN, colorWeight);
      // draw circle
      ctx.beginPath();
      ctx.arc(f.xPos-offset.x, f.yPos-offset.y, f.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = ColorHelper.getRGBString(color);
      ctx.fill();
    });
  }
}