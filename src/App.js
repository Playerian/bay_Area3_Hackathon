import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map.js";
import MenuPanel from "./components/MenuPanel.js"
import NumContainer from "./components/NumContainer.js"

import borderGeoJSON from "./2010USoutline.json";
import stateGeoJSON from "./USStates.json";
import populationJSON from "./population.json";

class App extends Component {
  constructor(props){
    super(props);
    //set up state data
    let stateData = {};
    let totalPopulation = 0;
    stateGeoJSON.features.forEach((v, i) => {
      if (v.properties.NAME !== "District of Columbia"){
        let newState = new State(v.properties.NAME, populationJSON[v.properties.NAME], v);
        stateData[v.properties.NAME] = newState;
        totalPopulation += populationJSON[v.properties.NAME];
      }
    });
    //set up the us data
    stateData.US = new State("US", totalPopulation);
    //initialize state
    this.state = {
      stateData: stateData,
      selecting: "US",
      day: 0,
      gameStarted: false,
      //0 pause 1 regular
      gameSpeed: 0,
    }
    //initialize timer
    this.timer = setInterval(() => {
      this.onSecond();
    }, 1000);
  }
  //most important method NA
  oneDayPassed(){
    //increase the day
    let day = this.state.day + 1;
    //infecting people
    let stateData = this.state.stateData;
    for (let key in stateData){
      //exclude us
      if (key === "US"){
        
      }else{
        let state = stateData[key];
        let newInfected = state.infected + state.infectedDecimal;
        //multiply by infection rate
        newInfected *= (1 + state.infectionRate);
        //get a 20% random flow in the increase
        let randomNumber = (Math.random() * 2 - 1) / 5;
        newInfected += randomNumber;
        //get decimal of new infected
        let decimal = newInfected - Math.round(newInfected);
        //if new infected amount exceeds 10% of population
        if (newInfected > state.population * 0.1){
          newInfected = state.population * 0.1;
        }
        //if new infected amount exceeds population
        if (newInfected + state.infected > state.population){
          newInfected = state.population - state.infected;
        }
        //add newInfected to state infected population
        state.infected += Math.round(newInfected);
        state.infectedDecimal = decimal;
      }
    }
    //calling setUSData
    //final setState
    this.setState({
      day: day,
      stateData: stateData,
      
    }, () => {
      //final set US Data
      this.setUSData();
    })
  }
  setSpeed(speed){
    this.setState({
      gameSpeed: speed
    });
  }
  //time handler
  onSecond(){
    //check if game has started
    if (this.state.gameStarted){
      if (this.state.gameSpeed === 0){
        
      }else if (this.state.gameSpeed === 1){
        this.oneDayPassed();
      }
    }
  }
  //US Data formatting
  setUSData(){
    let stateData = this.state.stateData;
    let totalPopulation = 0;
    let totalInfected = 0;
    let totalRecovered = 0;
    let totalDeath = 0;
    for (let key in stateData){
      //ignore if it's us
      if (key !== "US"){
        let state = stateData[key];
        totalPopulation += state.population;
        totalInfected += state.infected;
        totalRecovered += state.recovered;
        totalDeath += state.death;
      }
    }
    stateData.US.population = totalPopulation;
    stateData.US.infected = totalInfected;
    stateData.US.recovered = totalRecovered;
    stateData.US.death = totalDeath;
    this.setState({
      stateData: stateData
    });
  }
  //geoJSON handler
  onFeatureClicked(stateName){
    //fetch state info
    let state = this.state.stateData[stateName];
    let stateData = this.state.stateData;
    console.log(
      `State: ${stateName} with a population of ${state.population}`
    );
    //set as selecting
    this.setState({
      selecting: stateName
    });
    //check if game has started
    if (!this.state.gameStarted){
      //add infected
      stateData[stateName].infected += 1;
      //start the game
      this.setState({
        stateData: stateData,
        gameStarted: true,
        gameSpeed: 1
      });   
    }
  }
  //leaflet map handler
  onMapClicked(lat, lng){
    //this handler happens after the geoJSON onFeature handler
    console.log(
      "You clicked the map at latitude: " + lat + " and longitude: " + lng
    );
    this.setUSData();
    this.setState({
      selecting: "US"
    });
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
            //static data
            center={{ x: 40.2, y: -95.7129 }}
            borderGeoJSON={borderGeoJSON}
            stateGeoJSON={stateGeoJSON}
            populationJSON={populationJSON}
            //dynamic data for render
            stateData={this.state.stateData}
            //handlers
            onFeatureClicked={(stateName) => this.onFeatureClicked(stateName)}
            onMapClicked={(lat, lng) => this.onMapClicked(lat, lng)}
          />
        </div>
        
        <MenuPanel 
          day={this.state.day} 
          selecting = {this.state.selecting} 
          provinceData = {this.state.stateData}
          setSpeed = {(s) => this.setSpeed(s)}
        />{/*buttons and counters goes in here?*/}
        
        {/*<div className="pplPointContiner"></div>
        <div className="researchProgress"></div>*/}
        
      </div>
    );
  }
}

export default App;

class State{
  constructor(name, population, geoJSON){
    //game data
    this.name = name;
    this.population = population;
    this.infectionRate = 0.2;
    this.infected = 0;
    this.infectedDecimal = 0.0;
    this.death = 0;
    this.recovered = 0;
    //rendering data
    this.style={
      color: "cadetblue",
      fillColor: "#3388ff",
      opacity: 0.5,
    }
    //static data
    this.geoJSON = geoJSON;
  }
}