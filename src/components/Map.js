import React, { Component } from "react";
//import "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
const { Map: LeafletMap, TileLayer, Marker, Popup } = window.ReactLeaflet;

export default class Map extends Component {
  constructor(props){
    super(props);
    //this.map does not exist yet
  }
  componentDidMount(){
    //this.map exist
    let map = this.map.leafletElement;
    console.log(map);
    //disable zoom
    // map.touchZoom.disable();
    // map.doubleClickZoom.disable();
    // map.scrollWheelZoom.disable();
    // map.keyboard.disable();
    // map.zoomControl.disable();
    //disable pan
    // map.dragging.disable();
    
    //let marker = this.marker([37.7749,-122.4194]).addTo(map)
  }
  handleZoomEnd(e){
    console.log(this.map);
    console.log("X");
  }
  
  render() {
    return (
      // center of the US in coordinates: 40.2, -95.7129 (this is not the coordinates of the geographical center)
      <LeafletMap center={[this.props.center.x, this.props.center.y]} zoom={5} ref={(ref) => { this.map = ref; }} onZoomEnd={(e) => this.handleZoomEnd(e)}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    );
  }
}
