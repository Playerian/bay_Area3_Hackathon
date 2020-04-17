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
    <div className="upgradeTag">
      
      <img className="upgradeTagImg" src={this.props.image}></img>
      <p className="upgradeTagP">{this.props.text}</p>
      <button className="upgradeButton" onClick={()=>this.checkppp()}>{this.state.purchased? "mutated.": "PPL point required to mutate: "+this.props.ppp }</button>
    </div>
    
    );
  }
}

