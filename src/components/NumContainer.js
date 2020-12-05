import React, { Component } from "react";


export default class NumContainer extends Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      // states and us info
      <div className="numcontainer">{this.props.text}<span className="containerNumber"> {this.props.number}</span></div> 
    );
  }
}

