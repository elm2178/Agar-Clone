import { World } from './lib/world.js';
import { Constants } from './lib/constants.js';
const io = require('socket.io')();

var world = new World(Constants.WORLD_WIDTH, Constants.WORLD_HEIGHT);

io.on('connection', (socket) => {
  console.log("client connected");
  socket.emit("init", {width: Constants.WORLD_WIDTH, height: Constants.WORLD_HEIGHT});

  // create new player
  world.createPlayer(socket.id);

  // key down callback
  socket.on('keydown', (id, key) => {
    let player = world.getPlayer(id);
    // ignore invalid commands
    if(!player)
      return;

    if(key === "ArrowDown") {
      player.movement.down = true;
    } else if (key === "ArrowUp") {
      player.movement.up = true;
    } else if (key === "ArrowLeft") {
      player.movement.left = true;
    } else if (key === "ArrowRight") {
      player.movement.right = true;
    }
  });

  // key up callback
  socket.on('keyup', (id, key) => {
    let player = world.getPlayer(id);
    // ignore invalid commands
    if(!player)
      return;
    
    if(key === "ArrowDown") {
      player.movement.down = false;
    } else if (key === "ArrowUp") {
      player.movement.up = false;
    } else if (key === "ArrowLeft") {
      player.movement.left = false;
    } else if (key === "ArrowRight") {
      player.movement.right = false;
    }
  });

  // disconnect callback
  socket.on('disconnect', () => {
    world.removePlayer(socket.id);
  });
});

setInterval(function() {
  // update world
  world.step(Constants.DELTA);

  // get world objects that need to be rendered
  let food = world.getFood();
  let players = world.getPlayers();

  // create a game state
  let gs = {
    food: food, 
    players: players,
  }

  // send updates
  io.emit('update', JSON.stringify(gs));
}, Constants.DELTA * 1000)

const port = 8000;
io.listen(port);
console.log('listening on port ', port);