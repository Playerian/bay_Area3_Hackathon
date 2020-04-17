import React, { Component } from 'react'
import { Map, TileLayer, ImageOverlay} from 'react-leaflet'
import Leaflet from 'leaflet'
import 'leaflet-imageoverlay-rotated'


//const { ImageOverlay } = window.ReactLeaflet;

export default class ImageOverlayRotate extends Map {
  createLeafletElement(props) {
    let LeafletMapElement = super.createLeafletElement(props);

    let topleft = new Leaflet.latLng(this.props.topLeft[0], this.props.topLeft[1]);
    let topright = new Leaflet.latLng(this.props.topright[0], this.props.topright[1]);
    let bottomleft = new Leaflet.latLng(
      this.props.bottomleft[0],
      this.props.bottomleft[1]
    );

    let overlay = new Leaflet.imageOverlay.rotated(
      "https://cdn.hyperdev.com/drag-in-files.svg?v=1477153069954",
      topleft,
      topright,
      bottomleft,
      {
        opacity: 0.7,
        interactive: true
      }
    ).addTo(LeafletMapElement);
    return LeafletMapElement;
  }
}

/*
 createLeafletElement(props){
    let LeafletMapElement = super.createLeafletElement(props);
    
    let topleft    = new L.latLng(this.props.topLeft[0],this.props.topLeft[1]);
    let topright   = new L.latLng(this.props.topright[0],this.props.topright[1]);
    let bottomleft = new L.latLng(this.props.bottomleft[0],this.props.bottomleft[1]);
   
    var overlay = L.imageOverlay.rotated(this.props.image, topleft, topright, bottomleft, {
	    //attribution: ""
    }).addTo(this.props.map);
    return overlay;
  }
*/
