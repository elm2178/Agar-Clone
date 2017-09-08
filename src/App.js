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
    // color map
    this.colors = {};

    // set state
    this.state = {
      socket: socket,
      isGameOver: false,
      colors: {},
    };

    window.addEventListener("keydown", this.onKeyDown);
  }

  getEnemyRGB()
  {
    let redR = 255;
    let redG = 0;
    let redB = 0;

    let orangeR = 160;
    let orangeG = 161;
    let orangeB = 100;

    let r = Math.floor((redR - orangeR) * Math.random() + orangeR);
    let g = Math.floor(orangeG * Math.random());
    let b = Math.floor(orangeB * Math.random());
    
    return {r: r, g: g, b: b};
  }

  onUpdate(data) {
    const colors = this.state.colors;
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
      let alpha = p.startTime > Date.now() ? (Math.sin(Date.now()/30) + 1)/2 : 1;
      if( !(id in this.state.colors) ) {
        colors[id] = this.getEnemyRGB();
      } 

      // draw rect
      ctx.beginPath();
      ctx.rect(p.xPos, p.yPos, p.width, p.width);
      // get appropriate color
      if(id === this.state.socket.id) {
        ctx.fillStyle = "rgba(27, 72, 124, " + alpha +  ")";
      } else {
        let color = colors[id];
        ctx.fillStyle = "rgba(" +  color.r + ", " + color.g + ", " + color.b + ", " + alpha + ")";
      }
      ctx.fill();
    }

    this.setState({
      colors: colors,
    });
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
