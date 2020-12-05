import React, { Component } from "react";

export default class UpgradeTag extends Component {
  // constructor(props) {
  //   super(props);
  // }

  // checks if you have enough ppl point to upgrade
  checkppp() {
    if (this.props.pplPoint >= this.props.ppp) {
      this.props.spendPoint(this.props.upgrade);
    }
  }
  
  render() {

    // checks if you already puchased upgrade
    if (!this.props.purchased) {
      return (
        
        <div className="upgradeTag" onMouseEnter={this.props.mouseEnter}>
          <img className="upgradeTagImg" src={this.props.image} alt=""></img>
          <p className="upgradeTagP">{this.props.text}</p>
          <button className="upgradeButton" onClick={() => this.checkppp()}>
            {"PPL point required: " + this.props.ppp}
          </button>
        </div>
      );
    } else {
      return (
        <div className="upgradeTag" >
          <img className="upgradeTagImg" src={this.props.image} alt=""></img>
          <p className="upgradeTagP">{this.props.text}</p>
          <button className="upgradeButtonPurchased">Purchased</button>
        </div>
      );
    }
  }
}
