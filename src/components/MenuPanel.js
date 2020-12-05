import React, { Component } from "react";
import NumContainer from "./NumContainer.js";
import UpContainer from "./UpContainer.js";
import UpgradeTag from "./UpgradeTag.js";
import Popup from "./Popup.js";

import "./MenuPanel.css";

export default class MenuPanel extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showing: true,
      day: "NaN",
      tab: "overview",
      pplPoint: this.props.pplPoint,
      winShow: false,
      showChange: false,
      //cureChange:0,
      spreadChange:0,
      leathChange:0,
      
      // speed up!
      speed: 2,
    };
  }

  // click handlers
  onPauseClick(){
    this.props.setSpeed(0);
    this.setState({speed: 0});
  }
  onPlayClick(){
    this.props.setSpeed(1);
    this.setState({speed: 1});
  }
  onBoostClick(){
    let speed = this.state.speed;
    if (speed < 2){
      speed = 2;
    }else{
      speed ++;
    }
    this.props.setSpeed(speed);
    this.setState({speed: speed});
  }
   onUpgradeClick(upgrade){
    this.props.onUpgrade(upgrade);
  }
  
  // changing tab menu
  menuUp() {
    if (this.state.showing === true) {
      this.setState({ showing: false });
    } else {
      this.setState({ showing: true });
    }
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
 
  render() {
    let selecting = this.props.selecting;
    let provinceData = this.props.provinceData;
    let population = provinceData[selecting].population || 0;
    let infected = provinceData[selecting].infected || 0;
    let death = provinceData[selecting].death || 0;
    let recovered = provinceData[selecting].recovered || 0;
    let upgradeInfo = this.props.upgradeInfo;
    let upgradeDivArrayGov=[];
    let upgradeDivArrayCure=[]
    let upgradeList = this.props.upgradeInfo
    let govUpgrade = upgradeList.govUpgrade;
    let cureUpgrade = upgradeList.cureUpgrade;
    
    // prints ugrades on page
    cureUpgrade.forEach((v,i)=>{
     upgradeDivArrayCure.push(
       <UpgradeTag spendPoint={(upgrade) => this.onUpgradeClick(upgrade)} 
         purchased={v.purchased} 
         text={v.text} 
         ppp={v.cost} 
         image={v.imgSrc} 
         key={i} 
         pplPoint={this.props.pplPoint} 
         resPts={v.resPts} 
         spreadPts={v.spread} 
         lethalPts={v.lethal} 
         upgrade={v}
        />
     )
    })
    
    govUpgrade.forEach((v,i)=>{
     upgradeDivArrayGov.push(
       <UpgradeTag 
         spendPoint={(upgrade) => this.onUpgradeClick(upgrade)} 
         purchased={v.purchased} 
         text={v.text} 
         ppp={v.cost} 
         image={v.imgSrc}
         key={i} pplPoint={this.props.pplPoint} 
         pplPoint={this.props.pplPoint} 
         resPts={v.resPts} 
         spreadPts={v.spread} 
         lethalPts={v.lethal} 
         upgrade={v}
        />
     )
    })

    if (this.state.showing === true && this.state.tab === "overview") {
      
      // overview tab menu
      return (
        <div className="menuPanel">
          <div className="divHolder">
            
            {/* state and us div */}
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> Currently Viewing: {this.props.selecting}</h3>
              <NumContainer text="Infected:" number={infected}/>
              <NumContainer text="Death:" number={death}/>
              <NumContainer text="Population:" number={population} />
            </div>
            
            {/* date and speed div */}
            <div className="dayDiv">
              <div className="dayDivText">Today is day {this.props.day}</div>
              <div className="dayDivButtonWrapper">
                <button className="pauseButton" onClick={(e) => this.onPauseClick(e)}>||</button>
                <button className="playButton" onClick={(e) => this.onPlayClick(e)}>&#9658;</button>
                <button className="boostButton" onClick={(e) => this.onBoostClick(e)}>&#9658;&#9658;&#9658;</button>
              </div>
            </div>
            
            {/* event headline div */}
            <div className="eventDiv">
              <div> In the Headlines</div>
              <Popup message = {this.props.message}/>
            </div>
            
            {/* tab menu div */}
            <div className="buttonDiv">
              <button className="panelButton" onClick={() => this.overviewTab()}>
                Overview
              </button>
              <button className="panelButton" onClick={() => this.upgradeTab()}>
                Upgrades (ppl Points:{this.props.pplPoint})
              </button>
              
              {/* cure and lethality div */}
              <div className="panelButton">
                 <UpContainer
                  resPts={Math.round(this.props.researchCompleted * 10000) / 100 + "%"}
                  lethalPts={(() => {
                    let percent = Math.round(this.props.lethalPts * 10000) / 100;
                    if (this.props.lethalStatus[0]){
                      percent /= 5;
                    }
                    if (this.props.lethalStatus[1]){
                      percent /= 5;
                    }
                    if (percent < 0){
                      percent = 0;
                    }
                    return Math.round(percent * 100) / 100 + "%";
                   })()}
                  />
              </div>
            </div>
          </div>
          
          {/* hide menu button */}
          <div className="menuHide" onClick={() => this.menuUp()}>
            Click to Hide
          </div>
        </div>
      
      );
    } else if(this.state.showing === true && this.state.tab === "upgrade"){
      
      // upgrade tab
      return(
        <div className="menuPanel">
          <div className="divHolder">
            
            {/* upgrades div */}
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> Upgrades:</h3>
              <div className="upgradeContainer">
                {upgradeDivArrayGov}
              </div>
            </div>
            
            {/* research div */}
            <div className="subHolderDiv">
              <h3 className="view numcontainer"> Research: </h3>
              <div className="upgradeContainer">
                {upgradeDivArrayCure}
              </div>
            </div>
            
            {/* tab menu div */}
            <div className="buttonDiv">
              <button className="panelButton" onClick={() => this.overviewTab()}>
                 Overview
              </button>
              <button className="panelButton" onClick={() => this.upgradeTab()}>
                Upgrades (ppl Points:{this.props.pplPoint})
              </button>
              
              {/* cure and lethality div */}
              <div className="panelButton">
                <UpContainer
                  resPts={Math.round(this.props.researchCompleted * 10000) / 100 + "%"}
                  lethalPts={(() => {
                    let percent = Math.round(this.props.lethalPts * 10000) / 100;
                    if (this.props.lethalStatus[0]){
                      percent /= 5;
                    }
                    if (this.props.lethalStatus[1]){
                      percent /= 5;
                    }
                    if (percent < 0){
                      percent = 0;
                    }
                    return Math.round(percent * 100) / 100 + "%";
                  })()}
                  />
              </div>
            </div>
          </div>
          
          {/* hide menu button */}
          <div className="menuHide" onClick={() => this.menuUp()}>
            click to hide
          </div>
        </div>
      );
    } else {
      
      // hides menu + show menu button
      return (
        <div className="menuShow" onClick={() => this.menuUp()}>
          click to show
        </div>
      );
    }
  }
}
