import React, { Component } from 'react';

class PlayerComp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      xPos: props.xPos,
      yPos: props.yPos,
      radius: props.radius,
    }
  }

  render() {
    
  }
}

export default PlayerComp;