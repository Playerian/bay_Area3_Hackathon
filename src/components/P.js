import React, { Component } from "react";
import Leaflet from "leaflet";
import Rotate from "./Rotate.js";
const {
  Map: LeafletMap,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  ImageOverlay,
  withLeaflet,
} = window.ReactLeaflet;

// export default class P extends Component {
//   constructor(props){
//     super(props);
//   }
//   componentDidMount(){

//   }
//   render(){
//     return (
//       <ImageOverlay
//           ref = "img"
//           bounds = {this.props.bounds}
//           url={this.props.url}
//       />
//     );
//   }
// }

// function calBound(bounds,imgsrc,deg){
//   // let pic = new Image(imgsrc)
//   let picWidth = Leaflet.latLngToLayerPoint(120) //hard code let's go, converts 120px into coord, so can so the units is the same
//   let picCenter = [
//     [bounds[0][0]+Leaflet.layerPointToLatLng(60),bounds[0][1]+Leaflet.layerPointToLatLng(60)],//lat, +60 pixel to get halve way point since img is 120px wide  
//                   ] 
//   //unit circle to calculate how much to add to picCenter[0] and picCenter[1]
//   //let topRight = [picCenter[0]+Math.sin(deg * Math.PI / 180))
//nvm not gonna do rotate
//   //]
// }

class ImageOverlayRotated extends LeafletMap{
  createLeafletElement(props) {
    let topleft    = new Leaflet.latLng(this.props.topleft[0], this.props.topleft[1]);
    let topright   = new Leaflet.latLng(this.props.topright[0], this.props.topright[1]);
    let bottomleft = new Leaflet.latLng(this.props.bottomleft[0], this.props.bottomleft[1]);
    let overlay = new Leaflet.imageOverlay.rotated(this.props.url, topleft, topright, bottomleft, {
      opacity: 1.0,
    })
    return overlay;
  }
}

export default ImageOverlayRotated;


// export default class ImageOverlayExample extends Component {
//   render() {
//     return (
//       <ImageOverlayRotated
//         bounds={[[25.192905875160584,55.27024269104004,0],[25.19413882386311,55.27176082134247,0]]}
//         topleft={this.props.topleft}
//         topright={this.props.topright}
//         bottomleft={this.props.bottomleft}
//         angle={this.props.angle}
//         url={this.props.url}
//         map={this.props.map}
//       >
//       </ImageOverlayRotated>
//     )
//   }
// }