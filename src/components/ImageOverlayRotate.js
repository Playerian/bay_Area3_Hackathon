import React, { Component } from "react";
import L from "leaflet";

const {
  Map: LeafletMap,
  ImageOverlay,
} = window.ReactLeaflet;

export default class ImageOverlayRotate extends ImageOverlay{
  createLeafletElement(props){
    let topleft    = new L.latLng();
    let topright   = new L.latLng();
    let bottomleft = new L.latLng();
   
    var overlay = L.imageOverlay.rotated("./palacio.jpg", topleft, topright, bottomleft, {
	    opacity: 0.4,
	    interactive: true,
	    attribution: "&copy; <a href='http://www.ign.es'>Instituto Geográfico Nacional de España</a>"
    }).addTo(Map);
    
  }
  
  render(){
  return(
    <div>
      <ImageOverlayRotate>
        
      </ImageOverlayRotate>
    </div>
  );
  }
}

