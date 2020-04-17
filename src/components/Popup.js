import React, { Component } from "react";

export default class Popup extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      purchased:false,

    }
   
    
  }
  
  render(){
  return(
    <div className="endScreen">
      <h1 className="endScreenH1">you finished the game</h1>
    </div>
    
    );
  }
}

