import React, { Component } from "react";


export default class NumContainer extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      resPts: 0,
      spreadPts:0,
      
    }
    
  }
  
  
  render(){
    return(
      <div className="eventDiv">
        <p className="view numcontainer">Resilience:{this.props.resPts}</p>
        <p className="view numcontainer">Spread:{this.props.spreadPts}</p>
        <p className="view numcontainer"></p>
      </div>
    
    );
  }
}
