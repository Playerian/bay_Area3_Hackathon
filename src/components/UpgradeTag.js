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
    <div className="upgradeTag">
      <p className="upgradeTagP">{this.props.text}</p>
      <img className="upgradeTagImg" src={this.props.image}></img>
      <button className="upgradeButton">{this.state.purchased}? mutated.": {this.props.ppp} PPL Point required</button>
    </div> 
    );
  }
}

