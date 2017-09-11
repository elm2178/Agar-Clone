import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

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

    // color map
    this.colors = {};

    // set state
    this.state = {
      socket: socket,
      isGameOver: false,
      colors: {},
      width: 0,
      height: 0,
    };

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);
  }

  getEnemyRGB()
  {
    let redR = 255;

    let orangeR = 160;
    let orangeG = 161;
    let orangeB = 100;

    let r = Math.floor((redR - orangeR) * Math.random() + orangeR);
    let g = Math.floor(orangeG * Math.random());
    let b = Math.floor(orangeB * Math.random());
    
    return {r: r, g: g, b: b};
  }

  onInit(data) {
    this.setState({
      width: data.width,
      height: data.height,
    });

    this.onResize();
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
    console.log(window.innerHeight, window.innerWidth, window.outerHeight, window.outerWidth);
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
