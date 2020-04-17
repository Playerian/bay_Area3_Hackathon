import React, { Component } from "react";

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false
    };

    const headlines = [
      "Group of Individals Diagnosed With Pneumonia Due To Unknown Causes",
      "Unknown SARS-like Pneumonia Spreads Across Seattle",
      "Washington State Declares State Of Emergency",
      "Following Washington, Multiple States Declares State of Emergency",
      "California Implements statewide 'Shelter In Place'",
      "New York: An Explosion of Cases",
      "New Jersey Sees A Surge In Cases After New York",
      
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
