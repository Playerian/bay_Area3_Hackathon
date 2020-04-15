import React, { Component } from "react";


export default class UpgradeTag extends Component{
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
    <div className="upgradeTag">{this.props.text}
      <span className="upgradeTagText"> {this.props.number}</span>
      <img className="upgradeTagImg" src=""></img>
      
    </div> 
    );
  }
}

