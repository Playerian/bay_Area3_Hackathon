import React, { Component } from "react";

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false
    };

    const headlines = [
      "New York: An Explosion of Cases",
      "California Implements statewide 'Shelter In Place'",
      "New Jersey Sees A Surge In Cases After New York",
      "New "
    ];
  }

  render() {
    if (this.props.gameEnd) {
      return (
        <div className="endScreen">
          <h1 className="endScreenH1">you finished the game</h1>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}
