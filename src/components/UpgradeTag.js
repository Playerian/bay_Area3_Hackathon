import React, { Component } from "react";


export default class UpgradeTag extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      purchased:false
    }
    
  }
  
  
  render(){
  return(
    <div className="upgradeTag">{this.props.text}
      <img className="upgradeTagImg" src={this.props.image}></img>
      <button className="upgradeButton">{this.statepurchased? this.props.cost:"mutated."}</button>
    </div> 
    );
  }
}

