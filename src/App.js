import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map.js";
import MenuPanel from "./components/MenuPanel.js"
import NumContainer from "./components/NumContainer.js"
import Popup from "./components/Popup.js"

import borderGeoJSON from "./2010USoutline.json";
import stateGeoJSON from "./USStates.json";
import populationJSON from "./population.json";
import neighborJSON from "./neighbor.json";
import airportJSON from "./airports.json";
import upgradeJSON from "./upgrades.json";

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
    //set up airport data
    for (let key in airportJSON){
      let airport = airportJSON[key];
      let stateName = airport.state;
      let state = stateData[stateName];
      state.hasAirport = true;
      state.airport = airport;
    }
    //set up the us data
    stateData.US = new State("US", totalPopulation);
    //set up upgradeJSON
    //initialize state
    this.state = {
      //datas
      stateData: stateData,
      airlines: [
        //comment out after debugging finishes, template
        //new Plane("LAX", "JFK", "key",(c) => this.flightFinished(c)),
      ],
      upgrades: upgradeJSON,
      //in game variables
      selecting: "US",
      day: 0,
      pplPoint: 0,
      fatality: 0,
      researchCompleted: 0,
      researchRate: 0.0002,
      //game system state
      gameStarted: false,
      gameEnded:false,
      //0 pause 1 regular
      gameSpeed: 0,
      //just the speed of the timer
      gameTimerSpeed: 1000 / 30,
      //accumulation += timerSpeed everytime timer is ticked
      gameTimerAccumulation: 0,
      //accumulation >= oneday then run oneDayPassed()
      gameOneDay: 1000,
    }
    //upgrade JSON quick access
    this.state.govUpgrade = this.state.upgrades.govUpgrade;
    this.state.cureUpgrade = this.state.upgrades.cureUpgrade;
    //initialize timer
    this.timer = setInterval(() => {
      this.onTick();
    }, this.state.gameTimerSpeed);
  }
  //most important method NA
  oneDayPassed(){
    //increase the day
    let day = this.state.day + 1;
    //increasing global fatality
    if (day > 90){
      this.state.fatality += 0.0025;
    }
    //infecting people
    let stateData = this.state.stateData;
    for (let key in stateData){
      //exclude us
      if (key === "US"){
        
      }else if (key === undefined){
        //exclude undefined
        debugger;
      }else{
        let state = stateData[key];
        //airlines!
        //check if airport exist
        if (state.hasAirport){
          //check if the state has plane going out
          if (state.planeExit.length > 0){
            //don't send out plane
          }else{
            //send out plane (with a probability)
            let airport = state.airport;
            //randomly selects another airport
            let keyList = Object.keys(airportJSON);
            //destination
            let airport2Name = keyList[Math.floor(Math.random() * keyList.length)];
            //check if flying to urself
            if (airport.name !== airport2Name){
              //send a plane out 50% chance
              if (Math.floor(Math.random() * 2) === 0){
                let key = String(Math.random()).substring(2);
                let plane = new Plane(airport.name, airport2Name, key, (c) => this.flightFinished(c));
                //check if plane carries the virus
                //same algorithm as neighbor transmission
                let chance = state.infected / state.population;
                //every million infected increase the chance by 1%
                let extraChance = Math.floor(state.infected / 1000000) / 100;
                chance += extraChance;
                let random = Math.random();
                if (chance > random){
                  plane.hasVirus = true;
                }
                //push plane to start state
                state.planeExit.push(plane);
                //push plane to end state
                stateData[airportJSON[airport2Name].state].planeEnter.push(plane);
                //push plane to react state
                this.state.airlines.push(plane);
              }
            }
          }
        }
        //avoid random spontaenous generation
        if (state.infected === 0){
          continue;
        }
        //increasing self state infect count ------------------------------
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
        //increase ppl point
        if (state.infected > state.pplPointMilestone){
          //increase ppl point by 1
          this.state.pplPoint += 1
          //increase miletone by *10
          state.pplPointMilestone *= 10;
        }
        //increase lethality in state
        if (state.infected / state.population > 0.2){
          state.lethality += 0.0025;
        }
        //people die
        let combinedFatality = state.lethality + this.state.fatality;
        if (combinedFatality > 0){
          let peopleDie = Math.floor(state.infected * combinedFatality);
          state.death += peopleDie;
          state.infected -= peopleDie;
        }
        //separation--------------------------------------------------------
        //spreading to neighbor probability
        let chance = state.infected / state.population;
        //every million infected increase the chance by 1%
        let extraChance = Math.floor(state.infected / 1000000) / 100;
        chance += extraChance;
        let neighbors = neighborJSON[key];
        for (let v of neighbors){
          if (stateData[v].infected === 0){
            //dice roll
            let random = Math.random();
            if (chance > random){
              stateData[v].infected ++;
            }
          }
        }
      }
    }
    //calling setUSData
    //final setState
    this.setState({
      day: day,
      stateData: stateData,
      airlines: this.state.airlines,
      fatality: this.state.fatality
    }, () => {
      //final set US Data
      this.setUSData();
    })
    
    //check if 180 days had pass
    if(this.state.day === 180){
      this.setState({"gameEnded":true});
    }
  }
  //
  setSpeed(speed){
    this.setState({
      gameSpeed: speed
    });
  }
  //time handler
  onTick(){
    //check if game has started
    if (this.state.gameStarted){
      if (this.state.gameSpeed === 0){
        
      }else if (this.state.gameSpeed === 1){
        this.state.gameTimerAccumulation += this.state.gameTimerSpeed;
        if (this.state.gameTimerAccumulation >= this.state.gameOneDay){
          this.oneDayPassed();
          this.state.gameTimerAccumulation -= this.state.gameOneDay;
        }
        this.state.airlines.forEach((v,i)=>{
          v.next(i)
        });
        this.setState({
          airlines: this.state.airlines,
          gameTimerAccumulation: this.state.gameTimerAccumulation,
        });
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
  //airline Data formatting
  flightFinished(plane){
    console.log(`Flight finished`);
    //grab states
    let startState = this.state.stateData[plane.startState];
    let endState = this.state.stateData[plane.endState];
    //if plane is infected
    if (plane.hasVirus){
      if (endState.infected < endState.population){
        endState.infected ++;
      }
    }
    //remove the plane from startState
    for (let i = 0; i < startState.planeExit.length; i ++){
      let currentPlane = startState.planeExit[i]
      if (currentPlane === plane){
        startState.planeExit.splice(i, 1);
        break;
      }
    }
    //remove the plane from endState
    for (let i = 0; i < endState.planeEnter.length; i ++){
      let currentPlane = endState.planeEnter[i]
      if (currentPlane === plane){
        endState.planeEnter.splice(i, 1);
        break;
      }
    }
    //remove the plane from airlines
    for (let i = 0; i < this.state.airlines.length; i ++){
      let currentPlane = this.state.airlines[i];
      if (currentPlane === plane){
        this.state.airlines.splice(i, 1);
        break;
      }
    }
    //call setState for rerender
    this.setState({
      airlines: this.state.airlines,
      stateData: this.state.stateData
    });
  }
  //geoJSON handler
  onFeatureClicked(stateName){
    //fetch state info
    let state = this.state.stateData[stateName];
    let stateData = this.state.stateData;
    //check dc first
    if (stateName === "District of Columbia"){
      stateName = "US";
      state = this.state.stateData[stateName];
    }
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
  //spend ppl point
  spendpplpoint(num){
    this.setState({
      pplPoint: this.state.pplPoint - num
    });
  }
  render() {
    return (
      <div className="App">
        <div className="mapContainer">
          <Map
            //static data
            center={{ x: 40.2, y: -95.7129 }}
            borderGeoJSON={borderGeoJSON}
            stateGeoJSON={stateGeoJSON}
            populationJSON={populationJSON}
            airportJSON={airportJSON}
            //dynamic data for render
            stateData={this.state.stateData}
            airlines={this.state.airlines}
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
          pplPoint = {this.state.pplPoint}
          spendPoint = {(num) => this.spendpplpoint(num)
                       }
          upgradeInfo = {upgradeJSON}
        />{/*buttons and counters goes in here?*/}
        
        {/*<div className="pplPointContiner"></div>
        <div className="researchProgress"></div>*/}
        
        <Popup gameEnd={this.state.gameEnded}/>
        
        
      </div>
    );
  }
}

export default App;

//classes
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
    this.pplPointMilestone = 1;
    this.hasAirport = false;
    this.airport = {};
    //airline info
    this.planeExit = [];
    this.planeEnter = [];
    //event data
    this.landLocked = false;
    this.airportLocked = false;
    this.maskedWearing = false;
    this.quarantinePatient = false;
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

class Plane{
  constructor(startPortName, endPortName, planeKey, callback){
    let startPort = airportJSON[startPortName];
    let startlatlon = [startPort.Latitude, startPort.Longitude];
    let endPort = airportJSON[endPortName];
    let endlatlon = [endPort.Latitude, endPort.Longitude];
    //final
    this.callback = callback;
    //dynamic
    this.currentlat = startlatlon[0];
    this.currentlon = startlatlon[1];
    this.currentIndex = 0;
    this.bound = [[this.currentlat,this.currentlon], [this.currentlat+1,this.currentlon+1]];
    this.lethality = 0;
    //static
    this.startlatlon = startlatlon;
    this.endlatlon = endlatlon;
    this.startState = startPort.state;
    this.endState = endPort.state;
    this.hasVirus = false;
    this.planeKey = planeKey
    //calculated
    this.distance = distanceTwoPoints(startlatlon, endlatlon);
    this.angle = angleTwoPoints(startlatlon, endlatlon);
    this.slope = slope(startlatlon, endlatlon);
    this.intervalLength = this.distance / Math.floor(this.distance);
    this.intervalList = [];
    //cutting
    for (let i = 0; i < this.distance; i += this.intervalLength){
      this.intervalList.push([this.startlatlon[0] + i * this.slope[0] / Math.floor(this.distance), this.startlatlon[1] + i * this.slope[1] / Math.floor(this.distance)]);
    }
  }
  next(i){ //i is the plane's index in this.state.airlines
    this.currentIndex ++;
    if(this.currentIndex >= this.intervalList.length){
      return this.callback(this);
    }else{
      this.currentlat = this.intervalList[this.currentIndex][0];
      this.currentlon = this.intervalList[this.currentIndex][1];
      this.bound = [[this.currentlat,this.currentlon], [this.currentlat+1,this.currentlon+1]];
    }
  }
}

//handy method
function distanceTwoPoints(latlon1, latlon2){
  return Math.sqrt( Math.pow(latlon1[0] - latlon2[0], 2) + Math.pow(latlon1[1] - latlon2[1], 2) );
}
//clockwise, start from x-axis
function angleTwoPoints(latlon1, latlon2){
  let r = (Math.atan2((latlon2[1] - latlon1[1]), (latlon2[0] - latlon1[0])) * 180 / Math.PI) * -1;
    if (r === NaN){
        return 0;
    }
    if (r < 0){
        r += 360;
    }
    return r;
}
function slope(latlon1, latlon2){
  return [latlon2[0] - latlon1[0], latlon2[1] - latlon1[1]];
}