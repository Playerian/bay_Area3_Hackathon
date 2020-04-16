import React, { Component } from "react";
import L from "leaflet";
const {
  Map: LeafletMap,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  ImageOverlay
} = window.ReactLeaflet;

export default class Map extends Component {
  constructor(props) {
    super(props);
    //this.map does not exist yet
    this.state = {
      //coord: [latitude, longtitude]
      coord: [this.props.center.x, this.props.center.y],
      zoom: 5,
      stateLayers: {},
      stateFeatures: {}
    };
  }
  componentDidMount() {
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
    // let marker = Map.marker([37.7749,-122.4194]).addTo(map)
  }
  //leaflet handler
  handleZoomEnd(e) {
    console.log("Zoom ended");
    //set zoom as state
    let map = this.map.leafletElement;
    let zoom = map.getZoom();
    console.log(zoom);
    //minimum zoom is 4
    if (zoom < 4) {
      zoom = 4;
    }
    this.setState({ zoom: zoom });
  }
  handleMoveEnd(e) {
    console.log("Move ended");
    var coord = e.target.getCenter();
    var lat = coord.lat;
    var lng = coord.lng;
    console.log(
      "Center of the map at latitude: " + lat + " and longitude: " + lng
    );
    //longtitude can't be less than -120
    if (lng < -120) {
      lng = -120;
    }
    //longtitude can't be greater than -65
    if (lng > -65) {
      lng = -65;
    }
    //latitude can't be greater than 50
    if (lat > 50) {
      lat = 50;
    }
    //latitude can't be less than 25
    if (lat < 25) {
      lat = 25;
    }
    this.setState({ coord: [lat, lng] });
  }
  handleClick(e) {
    //this handler happens after the geoJSON handler
    var coord = e.latlng;
    var lat = coord.lat;
    var lng = coord.lng;
    //check propagation
    if (this.handlerFired) {
      this.handlerFired = false;
    } else {
      this.props.onMapClicked(lat, lng);
    }
  }
  //geoJSON on each state
  onEachFeature(feature, layer) {
    //bind click on each layer
    layer.on({
      click: e => this.onFeatureClicked(e, feature, layer)
    });
    //set state datas
    let stateFeatures = this.state.stateFeatures;
    let stateLayers = this.state.stateLayers;
    stateFeatures[feature.properties.NAME] = feature;
    stateLayers[feature.properties.NAME] = layer;
    this.setState({
      stateFeatures: stateFeatures,
      stateLayers: stateLayers
    });
  }
  //geoJSON click handler
  onFeatureClicked(event, feature, layer) {
    this.props.onFeatureClicked(feature.properties.NAME);
    //stop propagation task
    this.handlerFired = true;
  }
  //update individual layer during render
  updateLayer(feature, layer) {
    // grab stateData
    let stateData = this.props.stateData;
    //set color base on stateData
    // array of fill colors in increasing order of severity
    let colors = [
      "#3388ff",
      "#74adad",
      "#8abc8e",
      "#c5de46",
      "#fbff00",
      "#fde800",
      "#fed200",
      "#ffb900",
      "#ff9300",
      "#ff6200",
      "#ff4600",
      "#ff0000",
      "#de0000",
      "#aa0000",
      "#730000"
    ];
    //set style base on stateData
    if (stateData[feature.properties.NAME]) {
      let state = stateData[feature.properties.NAME];
      let infected = state.infected;
      let population = state.population;
      let color;
      //setting default style listed in stateData
      layer.setStyle(state.style);
      if (infected === 0) {
        color = colors[0];
      }
      if (infected >= 1) {
        color = colors[1];
      }
      if (infected >= 20) {
        color = colors[2];
      }
      if (infected >= 50) {
        color = colors[3];
      }
      if (infected >= 100) {
        color = colors[4];
      }
      if (infected >= population * 0.01) {
        color = colors[5];
      }
      if (infected >= population * 0.05) {
        color = colors[6];
      }
      if (infected >= population * 0.1) {
        color = colors[7];
      }
      if (infected >= population * 0.2) {
        color = colors[8];
      }
      if (infected >= population * 0.3) {
        color = colors[9];
      }
      if (infected >= population * 0.4) {
        color = colors[10];
      }
      if (infected >= population * 0.5) {
        color = colors[11];
      }
      if (infected >= population * 0.6) {
        color = colors[12];
      }
      if (infected >= population * 0.7) {
        color = colors[13];
      }
      if (infected >= population * 0.8) {
        color = colors[14];
      }
      layer.setStyle({
        fillColor: color
      });
    }
  }
  
  sentAirplane(plane){
    let imgUrl = "https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"
    // let imgBounds = [
    //                 [this.props.airportJSON[startport].Latitude,this.props.airportJSON[startport].Longitude],
    //                 [this.props.airportJSON[endport].Latitude,this.props.airportJSON[endport].Longitude]
    //                ]
    let JsxPlane = 
      <ImageOverlay
          bounds = {[plane.currentlat,plane.currentlon],[plane.currentlat+1,plane.currentlon+1]}
          url={imgUrl}
          />
    
    return JsxPlane
     
  }
  
  //render funciton
  render() {
    //render layers
    if (Object.keys(this.state.stateLayers).length > 0) {
      for (let key in this.state.stateLayers) {
        this.updateLayer(
          this.state.stateFeatures[key],
          this.state.stateLayers[key]
        );
      }
    }
    
  let planeArray = []
  this.props.airlines.forEach((v,i)=>{
      this.sentAirplane(v)
      console.log(v)
      planeArray.push(v)
    })

    
    //airport overlay collection
    //custom icon
    var myIcon = L.icon({
      iconUrl:
        "https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fairport.png?v=1587008448453",
      //shadowUrl: "https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fairport.png?v=1587008448453",
      
      iconAnchor: [25, 50], // [22, 94]
      iconSize: [50, 55]
    });
    let airportIcons = [];
    for (let key in this.props.airportJSON) {
      let airport = this.props.airportJSON[key];
      let lat = airport.Latitude;
      let lon = airport.Longitude;
      airportIcons.push(
        <Marker
          //airport icon
          key={key}
          position={[lat, lon]}
          icon={myIcon}
        />
      );
    }
    //return function
    return (
      // center of the US in coordinates: 40.2, -95.7129 (this is not the coordinates of the geographical center)
      <LeafletMap
        center={this.state.coord}
        zoom={this.state.zoom}
        ref={ref => {
          this.map = ref;
        }}
        onZoomEnd={e => this.handleZoomEnd(e)}
        onMoveEnd={e => this.handleMoveEnd(e)}
        onClick={e => this.handleClick(e)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Data from US Census Bureau'
        />
        <GeoJSON
          //border geoJSON
          data={this.props.borderGeoJSON}
          style={{ color: "cadetblue", opacity: 0.5 }}
        />
        <GeoJSON
          //individual state geoJSON
          data={this.props.stateGeoJSON}
          style={{ color: "cadetblue", fillColor: "pink", opacity: 0.5 }}
          onEachFeature={(f, l) => this.onEachFeature(f, l)}
        />
        {airportIcons}
        
        
        
        {/*<ImageOverlay
          bounds ={ [
                    [this.props.airportJSON["LAX"].Latitude,this.props.airportJSON["LAX"].Longitude],
                    [this.props.airportJSON["JFK"].Latitude,this.props.airportJSON["JFK"].Longitude]
                   ]}
          url="https://cdn.glitch.com/992e732d-da56-4621-b6e4-be7c8aa0c026%2Fpic.jpg?v=1586928635281"
          />*/}

        
      </LeafletMap>
    );
  }
}
