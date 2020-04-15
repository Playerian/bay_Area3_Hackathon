import React, { Component } from "react";


export default class UpContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
 
    }
    
  }
  
  
  render(){
  return(
    <div className="upcontainer">{this.props.text}<span className="containerUpgrade"> {this.props.upgrades}</span></div> 
    );
  }
}