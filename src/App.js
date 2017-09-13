import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';
import { Camera } from './lib/camera.js';

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
      camera: undefined,
    };

    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("resize", this.onResize);
  }

  onInit(data) {
    let camera = new Camera(data.player, data.worldWidth, data.worldHeight);

    this.setState({
      camera: camera,
    });

    this.onResize();
  }

  onUpdate(data) {
    let gameState = JSON.parse(data);
    let canvas = this.refs.canvas;

    // check if you are still alive
    if(!gameState.players[this.state.socket.id]) {
      this.setState({
        isGameOver: true,
      });
    }

    this.state.camera.render(canvas, gameState);
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

    let height = 0;
    let width = 0;
    if(this.state.camera) {
      height = this.state.camera.height;
      width = this.state.camera.width;
    }
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Agar Clone</h2>
          <p>{gameOverMessage}</p>
        </div>
        <div className="container">
          <canvas height={height} width={width} ref="canvas" className="canvas"></canvas>
        </div>
      </div>
    );
  }
}

export default App;
