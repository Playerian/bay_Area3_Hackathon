import React, { Component } from "react";

export default class NumContainer extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      death:0,
      recovered:0,
      infected:0,
      pplPoint:0,
      
    }
    
  }
  
  
  render(){
  return(
    <div className="container">{this.prop.text}<span className="containerNumber">{this.state[this.prop.type]}</span></div> //[pass in a type]
      );
}
}

