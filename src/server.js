import { Player } from './lib/player.js';
const io = require('socket.io')();

const HEIGHT = 600;
const WIDTH = 600;
const PLAYER_WIDTH = 10;
const VEL = 20;
const GROWTH = 10;
const FRICTION = .982;
const DELTA = .1;

var players = {};
var timedelta = 0;

function handleCollisions(player) {
  let collisionFound = false;
  let recursePlayer = undefined;

  for(let key in players) {
    if(key !== player.id && player.collidesWith(players[key])) {
      let otherPlayer = players[key];
      collisionFound = true;
      
      // two ways to win:
      // 1. You are larger
      // 2. You are tied and win the coin toss
      if(player.width > otherPlayer.width || (player.width === otherPlayer.width && player.surviveTie()) ) {
        removePlayer(otherPlayer.id, "You've been chomped");
        player.grow(GROWTH);
        player.capPosition(0, 0, WIDTH, HEIGHT);
        recursePlayer = player;
      }
      else {
        removePlayer(player.id, "You've been chomped");
        otherPlayer.grow(GROWTH);
        otherPlayer.capPosition(0, 0, WIDTH, HEIGHT);
        recursePlayer = otherPlayer;
      }

      // break from for loop if collision found, bc you need to check all over again
      break;
    }
  }

  // recursive call to handle collisions for the surviving player
  if(collisionFound) {
    handleCollisions(recursePlayer);
  }
}

function removePlayer(id, message) {
  delete players[id];
  io.to(id).emit('gameover', message);
}

function update() {
  // step for each player
  for(let id in players) {
    players[id].step(DELTA, FRICTION);
    players[id].capPosition(0, 0, WIDTH, HEIGHT);
  }

  // handle collision for each player
  for(let id in players) {
    handleCollisions(players[id]);
  }

  // send updates
  io.emit('update', JSON.stringify(players));
}

io.on('connection', (socket) => {
  console.log("client connected");

  // create new player
  var player = new Player(0, 0, PLAYER_WIDTH, socket.id);
  players[socket.id] = player;
  
  // move callback
  socket.on('move', (id, dir) => {
    let p = players[id];
    
    // ignore invalid move commands
    if(!p)
      return;

    if(dir === "up") {
      p.yVel = -VEL;
    }
    else if(dir === "down") {
      p.yVel = VEL;
    }
    else if(dir === "right") {
      p.xVel = VEL;
    }
    else if(dir === "left") {
      p.xVel = -VEL;
    }
  });

  // disconnect callback
  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

setInterval(function() {
  update();
}, DELTA * 100)

const port = 8000;
io.listen(port);
console.log('listening on port ', port);