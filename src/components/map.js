import React, { Component } from "react";
import "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
const { Map: LeafletMap, TileLayer, Marker, Popup } = window.ReactLeaflet;

export default class Map extends Component {
  render() {
    var mymap = LeafletMap.map('mapid').setView([51.505, -0.09], 13);
    //return <LeafletMap center={[51.505, -0.09]} zoom={13} />;
    return mymap;
  }
}
