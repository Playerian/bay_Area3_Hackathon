import React, { Component } from "react";


export default class UpgradeTag extends Component{
  constructor(props){
    super(props)
    
    this.state = {
      purchased:false,

    }
   
    
  }
  
 checkppp(){
   if(this.props.pplPoint >= this.props.ppp && this.state.purchased){
     this.setState({
       "purchased":true,
     });
     this.props.spendPoint(this.props.upgrade);
   }
 }
  render(){
  return(
    <div className="upgradeTag">
      
      <img className="upgradeTagImg" src={this.props.image}></img>
      <p className="upgradeTagP">{this.props.text}</p>
      <button className="upgradeButton" onClick={()=>this.checkppp()}>{this.state.purchased? "Purchased.": "PPL point required: "+this.props.ppp }</button>
    </div>
    
    );
  }
}

