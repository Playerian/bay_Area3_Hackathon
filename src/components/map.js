import React, { Component } from "react";
//import "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
const { Map: LeafletMap, TileLayer, Marker, Popup } = window.ReactLeaflet;

export default class Map extends Component {
  render() {
    return (
      // center of the US in coordinates: 40.2, -95.7129 (this is not the coordinates of the geographical center)
      <LeafletMap center={[40.2, -95.7129]} zoom={5}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    );
  }
}
