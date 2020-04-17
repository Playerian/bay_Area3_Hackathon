import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false,
      data: []
    };
  }

  render() {
    // news headlines
    const headlines = [
      {
        "text": "Group of Individals Diagnosed With Pneumonia of Unknown Causes",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": "Unknown SARS-like Pneumonia Spreads Across Seattle",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": "Washington State Declares State Of Emergency",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": "Following Washington, Multiple States Declares State of Emergency",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": "California Implements statewide 'Shelter In Place'",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": "New Jersey Sees A Surge In Cases After New York",
        "type": "",
        "spreadEffect": 0, 
      },
      
      {
        "text": Breaking: Cases May Have Reached All States",
        "type": "",
        "spreadEffect": 0, 
      },
      {
        "text": ,
        "type": "",
        "spreadEffect": 0, 
      },
      
      ",
      "Governors Across the Country Calling For Citizens to Stay Home"
    ];
    
    /*   const events = [
      {
        text: "New medication is in progress",
        type: "resilience",
        upgrade: 0,
        downgrade: 200
      },
      {
        text: "Government orders a shelter in place",
        type: "spread",
        upgrade: 0,
        downgrade: 300
      },
      {
        text: "New mutation: those infected now have severe cough",
        type: "lethality",
        upgrade: 100,
        downgrade: 0
      },
       {
        text: "Government requires all people to wear masks",
        type: "spread",
        upgrade: 0,
        downgrade: 200
      },
    ]*/
    
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
      //formatting
      let data = [];
      for (let i = 0; i < this.props.infectedData.length; i ++){
        let infected = this.props.infectedData[i];
        let death = this.props.deathData[i];
        let day = i;
        data.push({
          day: day,
          infected: infected,
          death: death
        });
      }
      return (
        <div className="endScreen">
          <h1 className="endScreenh1">you finished the game</h1>
          <LineChart width={730} height={250} data={this.state.data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="infected" stroke="#8884d8" />
            <Line type="monotone" dataKey="death" stroke="#82ca9d" />
          </LineChart>
        </div>
      );
    } else {
      return(
         <div>
        <marquee className="marqueeTag" scrollamount="25">
          {this.props.message}
        </marquee>
      </div>
        );
    }
  }
}
//this.props.message