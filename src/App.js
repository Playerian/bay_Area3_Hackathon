import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from "./components/Map.js"

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="mapContainer">
          
          <Map center={{x:40.2, y:-95.7129}}/>
          
        </div>
      </div>
    );
  }
}

export default App;
