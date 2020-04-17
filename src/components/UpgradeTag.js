import React, { Component } from "react";

export default class UpgradeTag extends Component {
  constructor(props) {
    super(props);
  }

  checkppp() {
    if (this.props.pplPoint >= this.props.ppp) {
      this.props.spendPoint(this.props.upgrade);
    }
  }
  render() {
    if (!this.props.purchased) {
      return (
        <div className="upgradeTag">
          <img className="upgradeTagImg" src={this.props.image}></img>
          <p className="upgradeTagP">{this.props.text}</p>
          <button className="upgradeButton" onClick={() => this.checkppp()}>
            {"PPL point required: " + this.props.ppp}
          </button>
        </div>
      );
    } else {
      return (
        <div className="upgradeTag" >
          <img className="upgradeTagImg" src={this.props.image}></img>
          <p className="upgradeTagP">{this.props.text}</p>
          <button className="upgradeButton">Purchased</button>
        </div>
      );
    }
  }
}
