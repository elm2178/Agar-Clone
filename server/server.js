const io = require('socket.io')();

io.on('connection', (client) => {
  console.log("client connected");
  

});

setInterval(function() {
  io.emit('tick', "tick tock");
}, 10);

const port = 8000;
io.listen(port);
console.log('listening on port ', port);