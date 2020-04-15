import React, { Component } from "react";

export default class NumContainer extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      // death:0,
      // recovered:0,
      // infected:0,
      // pplPoint:0,
      
    }
    
  }
  
  
  render(){
  return(
    <div className="Numcontainer">{this.prop.text}<span className="containerNumber">{this.prop.number}</span></div> //[pass in a type]
      );
}
}

