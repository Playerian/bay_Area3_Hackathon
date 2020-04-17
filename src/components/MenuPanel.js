import React, { Component } from "react";
import NumContainer from "./NumContainer.js";
import UpContainer from "./UpContainer.js";
import UpgradeTag from "./UpgradeTag.js";


import "./MenuPanel.css";

export default class MenuPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showing: true,
      day: "NaN",
      tab: "overview",
      pplPoint: this.props.pplPoint,
      resPts: 0,
      spreadPts:0,
      lethalPts: 0,
      winShow: false
    };
  }

  //click handlers
  onPauseClick(){
    this.props.setSpeed(0);
  }
  onPlayClick(){
    this.props.setSpeed(1);
  }
  
  //changing menu
  menuUp() {
    if (this.state.showing === true) {
      this.setState({ showing: false });
    } else {
      this.setState({ showing: true });
    }
    //console.log(this.state.showing)
  }
  overviewTab() {
    this.setState({
      tab: "overview"
    });
  }
  upgradeTab() {
    console.log("clicked");
    this.setState({
      tab: "upgrade",
    });
    
  }
  onUpgradeClick(){
    //callback setState points,
    //callback setState ppl
    this.setState({
      resPts: 0,
      spreadPts:0,
      lethalPts: 0
    })
  }
  
  spendPoint(point){
    this.props.spendPoint(point);
  }

  render() {
    let selecting = this.props.selecting;
    let provinceData = this.props.provinceData;
    let population = provinceData[selecting].population || 0;
    let infected = provinceData[selecting].infected || 0;
    let death = provinceData[selecting].death || 0;
    let recovered = provinceData[selecting].recovered || 0;
    let upgradeInfo = this.props.upgradeInfo;
    
    //making an array of upgrade DIVs
//     const upgrades = [
//       {
//         purchased:false,
//         cost:0,
//         text:"some text here",
//         imgSrc:"https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281",
//         resilience:1,
//         spread:0,
//         lethal:0,
        
//       },
      
//       {
//         purchased:false,
//         cost:5,
//         text:"some text here",
//         imgSrc:"https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281",
//         resilience:999,
//         spread:999,
//         lethal:999,
        
//       },
      
//       {
//         purchased:false,
//         cost:999,
//         text:"test test text",
//         imgSrc:"https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281",
//         resilience:999,
//         spread:999,
//         lethal:999,
        
//       },
      
//     ]
    
    const events = [
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
    ]
  
    let randomEvent = Math.floor(Math.random() * (events.length + 1));
  //  console.log(events[randomEvent].text);
    
    let upgradeDivArray = {}.map((v,i)=>{
      
          return <UpgradeTag spendPoint={(point) => this.spendPoint(point)} text={v.text} ppp={v.cost} image={v.imgSrc} key={i} pplPoint={this.props.pplPoint} resPts={v.resPts} spreadPts={v.spread} lethalPts={v.lethal}/>
        });


    if (this.state.showing === true && this.state.tab === "overview") {
      
          
      //overview tab
     // {this.state.winShow ? : null }
      return (
        <div className="menuPanel">
          <div className="divHolder">
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> Currently Viewing: {this.props.selecting}</h3>
              <NumContainer text="Infected:" number={infected}/>
              <NumContainer text="Death:" number={death}/>
              <NumContainer text="Recovered:" number={recovered}/>
              <NumContainer text="Population:" number={population} />
            </div>

            <div className="dayDiv">
              <div className="dayDivText">Today is day {this.props.day}</div>
              <div className="dayDivButtonWrapper">
                <button className="pauseButton" onClick={(e) => this.onPauseClick(e)}>||</button>
                <button className="playButton" onClick={(e) => this.onPlayClick(e)}>&#9658;</button>
              </div>
            </div>{/**/}

            <div className="eventDiv">
              <img src="https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"></img>
              <marquee className="marqueeTag">, LOCAL DIV TAG (终于)成精啦！<img src="https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"></img></marquee>
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
                Upgrades (ppl Points:{this.props.pplPoint})
              </button>
              <button className="panelButton"></button>
            </div>
          </div>
          <div className="menuHide" onClick={() => this.menuUp()}>
            click to hide
          </div>
          
          
        </div>
      
      );
    } else if(this.state.showing === true && this.state.tab === "upgrade"){
      //upgrade tab
      return(
        <div className="menuPanel">
          <div className="divHolder">
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> Upgrades: </h3>
              <div className="upgradeContainer">
                {upgradeDivArray}
              </div>
            </div>
            <UpContainer resPts={this.state.resPts} spreadPts={this.state.spreadPts} lethalPts={this.state.lethalPts}/>
            <div className="buttonDiv">
              <button className="panelButton" onClick={() => this.overviewTab()}>
                 Overview
              </button>
              <button className="panelButton" onClick={() => this.upgradeTab()}>
                Upgrades (ppl Points:{this.props.pplPoint})
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
      // hides menu
      return (
        <div className="menuShow" onClick={() => this.menuUp()}>
          click to show
        </div>
      );
    }
  }
}
