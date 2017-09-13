import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
import { ColorHelper } from './lib/colorHelper.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.onInit = this.onInit.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onResize = this.onResize.bind(this);

    // set up client socket
    const socket = openSocket("http://localhost:8000");
    socket.on('init', this.onInit);
    socket.on('update', this.onUpdate);

    // set state
    this.state = {
      socket: socket,
      isGameOver: false,
      width: 0,
      height: 0,
    };

    // create new color helper
    this.colorHelper = new ColorHelper();

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);
  }

  onInit(data) {
    this.colorHelper.setPlayerColor(this.state.socket.id, ColorHelper.getRGBString(ColorHelper.DARK_BLUE));

    this.setState({
      width: data.width,
      height: data.height,
    });

    this.onResize();
  }

  onUpdate(data) {
    let gameState = JSON.parse(data);
    let players = gameState.players;
    let food = gameState.food;
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext("2d");
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
      let color = this.colorHelper.getPlayerColor(p);
      // draw rect
      ctx.beginPath();
      ctx.rect(p.xPos, p.yPos, p.width, p.height);
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
      ctx.arc(f.xPos, f.yPos, f.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = ColorHelper.getRGBString(color);
      ctx.fill();
    });
  }

  onKeyDown(e) {
    let socket = this.state.socket;
    if( e.key === "ArrowUp" || 
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ) {
      socket.emit('keydown', socket.id, e.key);
    }
  }

  onKeyUp(e) {
    let socket = this.state.socket;
    if( e.key === "ArrowUp" || 
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ) {
      socket.emit('keyup', socket.id, e.key);
    }
  }

  onResize() {
    let length = Math.min(window.innerWidth - 20, window.innerHeight - 210);
    let canvas = document.getElementsByClassName("canvas")[0];
    canvas.style.height = length + "px";
    canvas.style.width = length + "px";
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
        <div className="container">
          <canvas height={this.state.height} width={this.state.width} ref="canvas" className="canvas"></canvas>
        </div>
      </div>
    );
  }
}

export default App;
