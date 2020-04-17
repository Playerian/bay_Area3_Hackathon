import React, { Component } from "react";


export default class NumContainer extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      
    }
    
  }
  
  
  render(){
  return(
    <div className="numcontainer">{this.props.text}<span className="containerNumber"> {this.props.number}</span></div> 
    );
  }
}

