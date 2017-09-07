import { Player } from './lib/player.js';
const io = require('socket.io')();
const HEIGHT = 100;
const WIDTH = 100;

var players = {};

io.on('connection', (socket) => {
  console.log("client connected");

  // create new player
  var player = new Player(0, 0, 10, socket.id);
  // update hashmap
  players[socket.id] = player;
  
  // move callback
  socket.on('move', (id, dir) => {
    let p = players[id];
    
    // ignore invalid move commands
    if(!p)
      return;

    if(dir === "up") {
      p.yPos -= 1;
    }
    else if(dir === "down") {
      p.yPos += 1;
    }
    else if(dir === "right") {
      p.xPos += 1;
    }
    else if(dir === "left") {
      p.xPos -= 1;
    }

    p.capPosition(0, 0, WIDTH, HEIGHT);
    players[id] = p;
  });
});

setInterval(function() {
  io.emit('tick', JSON.stringify(players));
}, 5);

const port = 8000;
io.listen(port);
console.log('listening on port ', port);