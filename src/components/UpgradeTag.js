import React, { Component } from "react";


export default class UpgradeTag extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      purchased:false,
      resPts: 0,
      spreadPts: 0,
      lethalPts: 0
    }
   
    
  }
  
 checkppp(){
   if(this.props.pplPoint >= this.props.ppp){ 
     this.setState({"purchased":true})
   }
   
 }
  
  render(){
  return(
    <div className="upgradeTag">
      
      <img className="upgradeTagImg" src={this.props.image}></img>
      <p className="upgradeTagP">{this.props.text}</p>
      <button className="upgradeButton" onClick={()=>this.checkppp()}>{this.state.purchased? "mutated.": "PPL point required to mutate: "+this.props.ppp }</button>
    </div>
    
    );
  }
}

