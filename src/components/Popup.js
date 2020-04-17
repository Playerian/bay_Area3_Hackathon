import React, { Component } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
//

export default class Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      purchased: false,
      data: []
    };
  }

  render() {

    if (this.props.gameEnd) {
      console.log("game ended");
      //formatting
      let data = [];
      for (let i = 1; i < this.props.infectedData.length; i ++){
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
          <LineChart width={730} height={250} data={data}
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