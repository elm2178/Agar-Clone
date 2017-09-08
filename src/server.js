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
  
  // move callback
  socket.on('move', (id, dir) => {
    world.movePlayer(id, dir);
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