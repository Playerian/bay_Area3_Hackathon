import React, { Component } from "react";
import NumContainer from "./NumContainer.js";
import "./MenuPanel.css";

export default class MenuPanel extends Component{
  constructor(props){
    super(props)
    
    this.state = {
     showing:true,
    }
    
  }
  
  menuUp(){
    
    if (this.state.showing === true){
      this.setState({"showing":false})
    }else{
      this.setState({"showing":true});
    }
    //console.log(this.state.showing)
  }
  overviewTab(){
    
  }
  upgradeTab(){
    
  }
  
  render(){
    
    if(this.state.showing === true){
      return(
        <div className="menuPanel">
          <div className="divHolder">
            
             <div className="subHolderDiv">
              <NumContainer text="Infected:"/>
              <NumContainer text="Death:"/>
              <NumContainer text="Recovered:" number="pass in a number here"/>
               <NumContainer text="Population:" number="pass in a number here"/>
            </div>
            
            <div className="buttonDiv">
              <button className="panelButton" onClick={()=>this.overviewTab()}>Overview</button>
              <button className="panelButton" onClick={()=>this.upgradeTab()}>Upgrades</button>
              <button className="panelButton"></button>
            </div>
            
          </div>
          <div className="menuHide" onClick={()=>this.menuUp()}>click to hide</div>
        </div> )
      ;
    }else{
      return(
      
          <div className="menuShow" onClick={()=>this.menuUp()}>click to show</div>
        
      )
    }
  
    
  }
}

