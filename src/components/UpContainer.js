import React, { Component } from "react";


export default class UpContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
 
    }
    
  }
  
  
  render(){
  return(
      <div className="statsDiv">
        <p className="view statscontainer">Resilience:{this.props.resPts}</p>
        <p className="view statscontainer">Spread:{this.props.spreadPts}</p>
        <p className="view statscontainer">Lethality:{this.props.lethalPts}</p>
      </div>
    );
  }
}