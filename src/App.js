import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from "./components/Map.js"
import borderGeoJSON from "./2010USoutline.json"

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="mapContainer">
          
          <Map center={{x:40.2, y:-95.7129}} borderGeoJSON={borderGeoJSON}/>
          
        </div>
      </div>
    );
  }
}

export default App;
