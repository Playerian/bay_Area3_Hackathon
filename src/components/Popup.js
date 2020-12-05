import React, { Component } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

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
      // formatting
      let data = [];
      for (let i = 1; i < this.props.infectedData.length; i++) {
        let infected = this.props.infectedData[i];
        let death = this.props.deathData[i];
        let total = this.props.infectDeathData[i];
        let day = i;
        let dailyIncreaseTotal = 0;
        let percentPopulationInfected = Math.round((total / 327533774 * 100) * 10000) / 10000;
        let percentPopulationDead = Math.round((death/327533774*100)*10000)/10000
        if (day > 1) {
          dailyIncreaseTotal = total - this.props.infectDeathData[i - 1];
        }
        data.push({
          day: day,
          infected: infected,
          death: death,
          total: total,
          "increase in total": dailyIncreaseTotal,
          "percent population infected": percentPopulationInfected,
         "percent population dead": percentPopulationDead, 
        });
      }
      return (
        // end screen
        <div className="endScreen">
          {/* pop up screen + reset button */}
          <h1 className="endScreenh1">You finished the game!</h1>
          <button onClick={this.props.softReset}>Reset</button>
          {/* line graph */}
          <div className="chartContainer">
            <LineChart
              width={window.innerWidth * 0.9}
              height={window.innerHeight * 0.6}
              data={data}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="day" stroke="#000000" />
              <Line type="monotone" dataKey="infected" stroke="#8884d8" />
              <Line type="monotone" dataKey="death" stroke="#82ca9d" />
              <Line type="monotone" dataKey="total" stroke="#E16E5C" />
              <Line
                type="monotone"
                dataKey="increase in total"
                stroke="#73ace1"
              />
              <Line type="monotone" dataKey="percent population infected" stroke="#E16E5C" />
              <Line type="monotone" dataKey="percent population dead" stroke="#423e45" />

            </LineChart>
          </div>
          {/* Debrief + Information */}
          <div className="infoBox">
            <h1> Debrief</h1>
            <h2>
              This simulation was a way for you to "play god" in a virus
              epidemic. Thinking back to the things you did in the simulation,
              how did you flatten the curve? What actions were the most helpful
              in flattening the curve?
            </h2>
            <h1> How to flatten the curve! </h1>
            <ul>
              <li> Wash! Your! Hands! For! At! Least! 20! Seconds! </li>
              <li> Refrain from unnecessary traveling! #StayHome </li>
              <li> Practice social distancing when going outside </li>
              <li>
                {" "}
                Follow the{" "}
                <a
                  href="https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html"
                  target="_blank"
                >
                  CDC guidelines
                </a>{" "}
              </li>
              <li>
                {" "}
                <a href="https://www.google.com/covid19/" target="_blank">
                  learn more about COVID-19
                </a>
                , the current coronavirus, and get{" "}
                <a href="https://coronavirus.jhu.edu/us-map" target="_blank">
                  local information
                </a>
              </li>
            </ul>
            <h3> Made with many late nights, by Destiny, Hongjun, Karen, & Liwei </h3>
          </div>
        </div>
      );
    } else {
      return (
        // headline marquee
        <div>
          <marquee className="marqueeTag" scrollamount="20">
            {this.props.message}
          </marquee>
        </div>
      );
    }
  }
}
