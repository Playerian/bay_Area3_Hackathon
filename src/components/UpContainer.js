import React, { Component } from "react";

export default class UpContainer extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    // show cure and lethality info
    if (this.props.showChange === true) {
      return (
        <div className="statsDiv">
          <div className="view statscontainer">
            Cure Progress: {this.props.resPts}{" "}
            <span>+({this.props.cureChange})</span>
          </div>
          <div className="view statscontainer">
            Lethality: {this.props.lethalPts}{" "}
            <span>-({this.props.leathChange})</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="statsDiv">
          <div className="view statscontainer">
            Cure Progress: {this.props.resPts}
          </div>
          <div className="view statscontainer">
            Lethality: {this.props.lethalPts}
          </div>
        </div>
      );
    }
  }
}
