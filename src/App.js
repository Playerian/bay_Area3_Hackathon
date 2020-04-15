import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map.js";
import MenuPanel from "./components/MenuPanel.js"
import borderGeoJSON from "./2010USoutline.json";
import stateGeoJSON from "./USStates.json";
import populationJSON from "./population.json";

class App extends Component {
  constructor(props){
    super(props);
    //set up state data
    console.log(stateGeoJSON)
  }
  render() {
    /*
    let test = stateGeoJSON.features[2].properties.NAME;
    console.log(test);
    // how to access the name of each state; may have to use to change the styling of individual states
    stateGeoJSON.features.forEach((response) => console.log(response.properties.NAME))
    */
    return (
      <div className="App">
        <div className="mapContainer">
          <Map
            center={{ x: 40.2, y: -95.7129 }}
            borderGeoJSON={borderGeoJSON}
            stateGeoJSON={stateGeoJSON}
            populationJSON={populationJSON}
          />
        </div>
        <MenuPanel/>{/*buttons and counters goes in here?*/}
      </div>
    );
  }
}

export default App;

class State{
  constructor(name, population){
    this.name = name;
    this.population = population;
    this.style={
      color: "#3388ff",
      fillColor: "#3388ff",
      opacity: 0.5,
    }
  }
}