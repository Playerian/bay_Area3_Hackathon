import React, { Component } from "react";


export default class MenuPanel extends Component{
  constructor(props){
    super(props)
    
    this.state = {
     
    }
    
  }
  
  scrollMenuUp(){
    console.log("scroll up code goes under here")
    
  }
  
  render(){
  return(
    <div className="menuPanel">
      <div className="divHolder">
      
      
      </div>
      <div className="menuHide" onClick={()=>this.scrollMenuUp}>click to hide</div>
    </div> 
    );
  }
}

