import React, { Component } from "react";

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false
    };
  }

  render() {
    // news headlines
    const headlines = [
      "Group of Individals Diagnosed With Pneumonia of Unknown Causes",
      "Unknown SARS-like Pneumonia Spreads Across Seattle",
      "Washington State Declares State Of Emergency",
      "Following Washington, Multiple States Declares State of Emergency",
      "California Implements statewide 'Shelter In Place'",
      "New York: An Explosion of Cases",
      "New Jersey Sees A Surge In Cases After New York",
      "Breaking: Cases May Have Reached All States",
      "Governors Across the Country Calling For Citizens to Stay Home"
    ];
    let lines = [];
    for (let i = 0; i < headlines.length; i++) {
      lines.push(
        <marquee className="marqueeTag" key={i}>
          {" "}
          {headlines[i]}{" "}
        </marquee>
      );
    }

    if (this.props.gameEnd) {
      
      return (
        <div className="endScreen">
          <h1 className="endScreenH1">you finished the game</h1>
        </div>
      );
    } else {
      return <div>{lines}</div>;
    }
  }
}
