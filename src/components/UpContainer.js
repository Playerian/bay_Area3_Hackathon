import React, { Component } from "react";


export default class UpContainer extends Component{
  constructor(props){
    super(props)
    this.state = {
 
    }
    
  }
  
  
  render(){
    if(this.props.showChange === true){
      return(
          <div className="statsDiv">
          <p className="view statscontainer">Cure Progress: {this.props.resPts} <span>+({this.props.cureChange})</span></p>
          {/*<p className="view statscontainer">Spread: {this.props.spreadPts} <span>-({this.props.spreadChange})</span></p>*/}
          <p className="view statscontainer">Lethality: {this.props.lethalPts} <span>-({this.props.leathChange})</span></p>
          </div>
        );
    }else{
      return(
          <div className="statsDiv">
            <p className="view statscontainer">Cure Progress: {this.props.resPts}</p>
           {/* <p className="view statscontainer">Spread: {this.props.spreadPts}</p>*/}
            <p className="view statscontainer">Lethality: {this.props.lethalPts}</p>
          </div>
        );
    }
  }
}