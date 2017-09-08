import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    // set up client socket
    const socket = openSocket("http://localhost:8000");
    socket.on('update', this.onUpdate);

    // set state
    this.state = {
      socket: socket,
      isGameOver: false,
    };

    window.addEventListener("keydown", this.onKeyDown);
  }

  onUpdate(data) {
    var players = JSON.parse(data);
    var canvas = this.refs.canvas;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // check if you are still alive
    if(!players[this.state.socket.id]) {
      this.setState({
        isGameOver: true,
      });
    }

    // draw players
    for(let id in players) {
      let p = players[id];
      ctx.beginPath();
      ctx.rect(p.xPos, p.yPos, p.width, p.width);
      ctx.fillStyle = id === this.state.socket.id ? "blue" : "red";
      ctx.fill();
    }
  }

  onKeyDown(e) {
    let socket = this.state.socket;
    if(e.key === "ArrowUp") {
      socket.emit('move', socket.id, "up");
    }
    else if (e.key === "ArrowDown") {
      socket.emit('move', socket.id, "down");
    }
    else if (e.key === "ArrowLeft") {
      socket.emit('move', socket.id, "left");
    }
    else if (e.key === "ArrowRight") {
      socket.emit('move', socket.id, "right");
    }
  }

  render() {
    let gameOverMessage = ""
    if(this.state.isGameOver) {
      gameOverMessage = "You lost! Thanks for playing.";
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Agar Clone</h2>
          <p>{gameOverMessage}</p>
        </div>
        <canvas height="600" width="600" ref="canvas" className="canvas"></canvas>
      </div>
    );
  }
}

export default App;
