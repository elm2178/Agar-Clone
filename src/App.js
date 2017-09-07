import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.onTick = this.onTick.bind(this);

    // set up client socket
    const socket = openSocket("http://localhost:8000");
    socket.on('tick', this.onTick);

    // set state
    this.state = {
      socket: socket,
      onTickCalls: 0
    };
  }

  onTick() {
    this.setState( (prevState, props) => {
      return { onTickCalls: prevState.onTickCalls + 1 };
    });
  }

  render() {
    console.log(this.state.socket);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Agar Clone</h2>
        </div>
        <p className="App-intro">
          On tick called {this.state.onTickCalls} time(s)
        </p>
        <canvas className="canvas"></canvas>
      </div>
    );
  }
}

export default App;
