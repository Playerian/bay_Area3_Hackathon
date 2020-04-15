import React, { Component } from "react";
import NumContainer from "./NumContainer.js";
import "./MenuPanel.css";

export default class MenuPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: true,
      day: "NaN"
    };
  }

  menuUp() {
    if (this.state.showing === true) {
      this.setState({ showing: false });
    } else {
      this.setState({ showing: true });
    }
    //console.log(this.state.showing)
  }
  overviewTab() {
    
  }
  upgradeTab() {
  }

  render() {
    let selecting = this.props.selecting;
    let provinceData = this.props.provinceData;
    let population = provinceData[selecting].population || 0;
    let infected = provinceData[selecting].infected || 0;
    let death = provinceData[selecting].death || 0;
    let recovered = provinceData[selecting].recovered || 0;
    if (this.state.showing === true) {
      return (
        <div className="menuPanel">
          <div className="divHolder">
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> currently viewing: {this.props.selecting}</h3>
              <NumContainer text="Infected:" number={infected}/>
              <NumContainer text="Death:" number={death}/>
              <NumContainer text="Recovered:" number={recovered}/>
              <NumContainer text="Population:" number={population} />
            </div>

            <div className="dayDiv">
              <p>Today is day {this.props.day}</p>
            </div>{/**/}

            <div className="eventDiv">
              <img src="https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"></img>
              <marquee className="marqueeTag">Some Big event happen today: LOCAL DIV TAG (终于)成精啦！<img src="https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"></img></marquee>
            </div>
  {/*-------------------------------------------------------------------------------------------------------------*/}
            <div className="buttonDiv">
              <button
                className="panelButton"
                onClick={() => this.overviewTab()}
              >
                Overview
              </button>
              <button className="panelButton" onClick={() => this.upgradeTab()}>
                Upgrades
              </button>
              <button className="panelButton"></button>
            </div>
          </div>
          <div className="menuHide" onClick={() => this.menuUp()}>
            click to hide
          </div>
        </div>
      );
    } else {
      return (
        <div className="menuShow" onClick={() => this.menuUp()}>
          click to show
        </div>
      );
    }
  }
}
