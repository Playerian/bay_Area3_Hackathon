import React, { Component } from "react";


export default class UpgradeTag extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      purchased:false
    }
   
    
  }
  
 checkppp(){
   console.log("aaaaappppppppppp")
   this.setState({"purchased":true})
   
 }
  
  render(){
  return(
    <div className="upgradeTag">
      
      <img className="upgradeTagImg" src={this.props.image}></img>
      <p className="upgradeTagP">{this.props.text}</p>
      <button className="upgradeButton" onClick={()=>this.checkppp()}>{this.state.purchased? "mutated.": this.props.ppp + " PPL Point required" }</button>
      
    </div> 
    );
  }
}

