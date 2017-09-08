import { World } from './lib/world.js';
const io = require('socket.io')();

const DELTA = .1;
const HEIGHT = 600;
const WIDTH = 600;

var world = new World(HEIGHT, WIDTH);


io.on('connection', (socket) => {
  console.log("client connected");

  // create new player
  world.createPlayer(socket.id);

  // key down callback
  socket.on('keydown', (id, key) => {
    console.log(key);
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
    console.log(player);
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
        console.log(player);
  });

  // disconnect callback
  socket.on('disconnect', () => {
    world.removePlayer(socket.id);
  });
});

setInterval(function() {
  // update world
  world.step(DELTA);
  let players = world.getPlayers();
  // send updates
  io.emit('update', JSON.stringify(players));
}, DELTA * 100)

const port = 8000;
io.listen(port);
console.log('listening on port ', port);