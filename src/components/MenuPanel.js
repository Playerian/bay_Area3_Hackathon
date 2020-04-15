import React, { Component } from "react";
import NumContainer from "./NumContainer.js"

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
  
  render(){
    
    if(this.state.showing === true){
      return(
        <div className="menuPanel">
          <div className="divHolder">
            
            <div>
              <NumContainer text="Infected:"/>
              <button></button>
            </div>
            
            <div>
              <NumContainer text="Death:"/>
              <button></button>
            </div>
            
            <div>
              <NumContainer text="Recovered:" number="pass in a number here"/>
              <button></button>
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

