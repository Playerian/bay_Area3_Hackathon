import React, { Component } from "react";


export default class UpContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
 
    }
    
  }
  
  
  render(){
  return(
    <button className="upcontainer">{this.props.text}</button> 
    );
  }
}