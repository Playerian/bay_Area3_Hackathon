import React, { Component } from "react";
import L from "leaflet";
import LeafletImageOverLay from "../plugin/LeafletImageOverlay.js"

const {
  ImageOverlay,
} = window.ReactLeaflet;

export default class ImageOverlayRotate extends ImageOverlay{
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
}

