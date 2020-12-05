import React, { Component } from "react";
import Map from "./components/Map.js";
import MenuPanel from "./components/MenuPanel.js";
import Popup from "./components/Popup.js"

import borderGeoJSON from "./2010USoutline.json";
import stateGeoJSON from "./USStates.json";
import populationJSON from "./population.json";
import neighborJSON from "./neighbor.json";
import airportJSON from "./airports.json";
import upgradeJSON from "./upgrades.json";
import eventJSON from "./event.json";

import "./App.css";

class App extends Component {
  constructor(props){
    super(props);
    
    // set up state data
    let stateData = {};
    let totalPopulation = 0;
    stateGeoJSON.features.forEach((v, i) => {
      if (v.properties.NAME !== "District of Columbia"){
        let newState = new State(v.properties.NAME, populationJSON[v.properties.NAME], v);
        stateData[v.properties.NAME] = newState;
        totalPopulation += populationJSON[v.properties.NAME];
      }
    });
    
    // set up airport data
    for (let key in airportJSON){
      let airport = airportJSON[key];
      let stateName = airport.state;
      let state = stateData[stateName];
      state.hasAirport = true;
      state.airport = airport;
    }
    
    // set up the us data
    stateData.US = new State("US", totalPopulation);
    
    // set up upgradeJSON + initialize state
    this.state = {
      
      // syate + airline data
      stateData: stateData,
      airlines: [
        // comment out after debugging finishes, template
        // new Plane("LAX", "JFK", "key",(c) => this.flightFinished(c)),
      ],
      upgrades: upgradeJSON,
      
      // in game variables
      selecting: "US",
      day: 0,
      pplPoint: 0,
      deathPointAccu: 0,
      fatality: 0,
      researchCompleted: 0,
      researchRate: 0,
      headlineMessage:"",
      
      // upgrade specific variables "keys"
      landBlockade: false,
      airRestriction: false,
      reduceLethal1: false,
      reduceLethal2: false,
     
      // game system state
      gameStarted: false,
      gameEnded:false,
      
      // 0 pause 1 regular 2 fast 3 extreme fast
      gameSpeed: 0,
      // just the speed of the timer
      gameTimerSpeed: 1000 / 30,
      // accumulation += timerSpeed everytime timer is ticked
      gameTimerAccumulation: 0,
      // accumulation >= oneday then run oneDayPassed()
      gameOneDay: 1000,
      
      // data for graphing
      gameInfectedData: [],
      gameDeathData: [],
      gameInfectDeathData: [],
    }
    
    // upgrade JSON quick access
    this.state.govUpgrade = this.state.upgrades.govUpgrade;
    this.state.cureUpgrade = this.state.upgrades.cureUpgrade;
    // initialize timer
    this.timer = setInterval(() => {
      this.onTick();
    }, this.state.gameTimerSpeed);
  }
  
  // most important method NA
  oneDayPassed(){
    // increase the day
    let day = this.state.day + 1;
    // increasing global fatality
    if (day > 90){
      this.state.fatality += 0.002;
    }
    // infecting people
    let stateData = this.state.stateData;
    for (let key in stateData){
      // exclude us
      if (key === "US"){
        
      } else if (key === undefined){
        // exclude undefined
        debugger;
      } else {
        let state = stateData[key];
        this.sendPlane(state, stateData);
        // avoid random spontaenous generation
        if (state.infected === 0){
          continue;
        }
       this.infectState(state);
       this.infectNeighbor(state, stateData, key);
      }
    }
    this.researchAndPoint(stateData, day);
    //final setState
    this.setState({
      day: day,
      stateData: stateData,
      airlines: this.state.airlines,
      fatality: this.state.fatality,
    }, () => {
      //final set US Data
      this.setUSData(day);
    })
    this.checkTimeEnd();
  }
  
  infectNeighbor(state, stateData, key){
     // spreading to neighbor probability
    let chance = state.infected / state.population;
    // every million infected increase the chance by 1%
    let extraChance = Math.floor(state.infected / 1000000) / 100;
    chance += extraChance;
    // land blockade?
    if (this.state.landBlockade){
      // drastically reduce the chance of cross state infection
      chance -= 0.99;
    }
    let neighbors = neighborJSON[key];
    for (let v of neighbors){
      if (stateData[v].infected === 0){
        // dice roll
        let random = Math.random();
        if (chance > random){
          stateData[v].infected ++;
        }
      }
    }
  }
  
  sendPlane(state, stateData){
    // airlines!
    // check if airport exist
    if (state.hasAirport){
      // check if the state has plane going out
      if (state.planeExit.length > 0){
        // don't send out plane
      } else {
        // send out plane (with a probability)
        let airport = state.airport;
        // randomly selects another airport
        let keyList = Object.keys(airportJSON);
        // destination
        let airport2Name = keyList[Math.floor(Math.random() * keyList.length)];
        // check if flying to urself
        if (airport.name !== airport2Name){
          // send a plane out with atmost 50% chance
          let sendOutPlaneChance = Math.random() * (1 - (state.death / state.population)) / 2;
          // air Blockade?
          if (this.state.airRestriction){
          // drastically reduce the chance of even flying a plane
          sendOutPlaneChance -= 0.99;
          }
          let toss = Math.random();
          if (toss < sendOutPlaneChance){
            let key = String(Math.random()).substring(2);
            let plane = new Plane(airport.name, airport2Name, key, (c) => this.flightFinished(c));
            // check if plane carries the virus
            // same algorithm as neighbor transmission
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
  }
  
  checkTimeEnd(){
    // check if 180 days had pass or 
    // commented for debugging purpose
    if(this.state.day >= 180 || this.state.researchCompleted >= 1){
      this.setState({"gameEnded":true});
      clearInterval(this.timer)
    }
    // check for event
    this.dailyEventCheck()
  }
  
  infectState(state){
    // increasing self state infect count ------------------------------
    let newInfected = state.infected + state.infectedDecimal;
    // multiply by infection rate
    newInfected *= state.infectionRate;
    // get a 20% random flow in the increase
    let randomNumber = (Math.random() * 2 - 1) / 5;
    newInfected += randomNumber;
    // get decimal of new infected
    let decimal = newInfected - Math.round(newInfected);
    // if new infected amount exceeds 10% of population
    if (newInfected > state.population * 0.1){
      newInfected = state.population * 0.1;
    }
    // if new infected amount exceeds population
    if (newInfected + state.infected + state.death > state.population){
      newInfected = state.population - state.infected - state.death;
    }
    // add newInfected to state infected population
    state.infected += Math.round(newInfected);
    state.infectedDecimal = decimal;
    // increase ppl point
    if (state.infected > state.pplPointMilestone){
      // increase ppl point by 1
      this.state.pplPoint += 1
      // increase miletone by *10
      state.pplPointMilestone *= 10;
    }
    // increase lethality in state
    if (state.infected / state.population > 0.2){
      state.lethality = state.lethality || 0
      state.lethality += 0.002;
    }
    // people die
    let combinedFatality = state.lethality + this.state.fatality;
    if (this.state.reduceLethal1){
      combinedFatality /= 5;
    }
    if (this.state.reduceLethal2){
      combinedFatality /= 5;
    }
    if (combinedFatality > 0){
      let peopleDie = Math.floor(state.infected * combinedFatality);
      // capped
      if (peopleDie > state.infected){
        peopleDie = state.infected;
      }
      state.death += peopleDie;
      state.infected -= peopleDie;
    }
  }
  researchAndPoint(stateData, day){
    // increment in research for cure
    let research = this.state.researchCompleted;
    let rate = this.state.researchRate;
    // adding research, base on population
    let progress = rate * (1 - stateData.US.death / stateData.US.population);
    if (progress < 0){
      progress = 0;
    }
    research += progress;
    // don't over research
    if (research > 1){
      research = 1;
    }
    this.setState({
      researchCompleted: research
    });
    // daily reward of pplPoint
    if (day <= 90){
      this.setState({
        pplPoint: this.state.pplPoint + 1
      })
    }else{
      this.setState({
        pplPoint: this.state.pplPoint + 2
      })
    }
  }

  // sets speed of days
  setSpeed(speed){
    if (speed === 0){
      this.setState({
        gameSpeed: speed
      });
    }else if (speed >= 1){
      let ms = 1000 / 30 / speed;
      let oneDay = 1000;
      clearInterval(this.timer);
      this.timer = setInterval(() => {
          this.onTick();
      }, ms)
      this.setState({
        gameSpeed: speed,
        gameTimerSpeed: ms,
        gameOneDay: oneDay / speed,
      });
    }
    console.log("setting speed to: " + speed);
  }
  
  //time handler
  onTick(){
    //check if game has started
    if (this.state.gameStarted){
      if (this.state.gameSpeed === 0){
        
      }else if (this.state.gameSpeed >= 1){
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
  
  // spend ppl point
  onUpgrade(upgrade){
    let stateData = this.state.stateData;
    upgrade.purchased = true;
    if (upgrade.type === "govUpgrade"){
      // gov upgrade reduce transmission
      for (let stateName in stateData){
        if (stateName !== "US"){
          let state = stateData[stateName];
          state.infectionRate -= upgrade.rateDrop;
        }
      }
    }else{
      // cure upgrade increase cure progress rate
      this.state.researchRate += upgrade.rateIncrease;
    }
    
    // key event
    if (upgrade.key){
      if (upgrade.key === "airport"){
        this.setState({airRestriction: true});
        this.eventActivate("airportClosure") //change head line
      }else if (upgrade.key === "land"){
        this.setState({landBlockade: true});
      }else if (upgrade.key === "F1"){
        this.setState({reduceLethal1: true});
      }else if (upgrade.key === "F2"){
        this.setState({reduceLethal2: true});
      }
    }
    this.setState({
      pplPoint: this.state.pplPoint - upgrade.cost,
      upgrades: this.state.upgrades,
      researchRate: this.state.researchRate,
      stateData: stateData
    });
    
    // change headlines
    this.eventActivate(upgrade.event)
    console.log(upgrade);
  }
  
  // US Data formatting
  setUSData(day){
    let stateData = this.state.stateData;
    let totalPopulation = 0;
    let totalInfected = 0;
    let totalRecovered = 0;
    let totalDeath = 0;
    for (let key in stateData){
      // ignore if it's us
      if (key !== "US"){
        let state=stateData[key];
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
    // give ppl point on death
    let deathPointAward = Math.floor(Math.cbrt(2.9 * totalDeath) / 4);
    if (deathPointAward > this.state.deathPointAccu){
      let award = deathPointAward - this.state.deathPointAccu;
      this.state.pplPoint += award;
      this.state.deathPointAccu = deathPointAward;
    }
    let gameInfectedData = this.state.gameInfectedData;
    let gameDeathData = this.state.gameDeathData;
    let gameInfectDeathData = this.state.gameInfectDeathData;
    gameInfectedData[day] = totalInfected;
    gameDeathData[day] = totalDeath;
    gameInfectDeathData[day] = totalInfected + totalDeath;
    this.setState({
      stateData: stateData,
      pplPoint: this.state.pplPoint,
      deathPointAccu: this.state.deathPointAccu,
      // data gathering
      gameInfectedData: gameInfectedData,
      gameDeathData: gameDeathData,
      gameInfectDeathData: gameInfectDeathData,
    });
  }
  // airline Data formatting
  flightFinished(plane){
    // grab states
    let startState = this.state.stateData[plane.startState];
    let endState = this.state.stateData[plane.endState];
    // if plane is infected
    if (plane.hasVirus){
      if (endState.infected < endState.population && endState.infected + endState.death < endState.population){
        endState.infected ++;
      }
    }
    // remove the plane from startState
    for (let i = 0; i < startState.planeExit.length; i ++){
      let currentPlane = startState.planeExit[i]
      if (currentPlane === plane){
        startState.planeExit.splice(i, 1);
        break;
      }
    }
    // remove the plane from endState
    for (let i = 0; i < endState.planeEnter.length; i ++){
      let currentPlane = endState.planeEnter[i]
      if (currentPlane === plane){
        endState.planeEnter.splice(i, 1);
        break;
      }
    }
    // remove the plane from airlines
    for (let i = 0; i < this.state.airlines.length; i ++){
      let currentPlane = this.state.airlines[i];
      if (currentPlane === plane){
        this.state.airlines.splice(i, 1);
        break;
      }
    }
    // call setState for rerender
    this.setState({
      airlines: this.state.airlines,
      stateData: this.state.stateData
    });
  }
  
  // geoJSON handler
  onFeatureClicked(stateName){
    // fetch state info
    let state = this.state.stateData[stateName];
    let stateData = this.state.stateData;
    // check dc first
    if (stateName === "District of Columbia"){
      stateName = "US";
      state = this.state.stateData[stateName];
    }
    console.log(
      `State: ${stateName} with a population of ${state.population}`
    );
    // set as selecting
    this.setState({
      selecting: stateName
    });
    // check if game has started
    if (!this.state.gameStarted){
      // add infected
      stateData[stateName].infected += 1;
      // start the game
      this.setState({
        stateData: stateData,
        gameStarted: true,
        gameSpeed: 1
      });   
    }
  }
  
  // leaflet map handler
  onMapClicked(lat, lng){
    // this handler happens after the geoJSON onFeature handler
    console.log(
      "You clicked the map at latitude: " + lat + " and longitude: " + lng
    );
    this.setState({
      selecting: "US"
    });
  }
  
  // event, check for condition to activate a centain event
  eventActivate(eventName){
    let json = eventJSON
    let eventIndex
    let message = ""
    for(let i = 0;i<json.event.length;i++){
      // console.log(json.event[i])
      if(eventName===json.event[i].name){ // looks for the event by name 
        // console.log(i)
        eventIndex = i
       break;
      } 
    }
    // console.log(typeof json[eventIndex])
    // console.log(typeof eventIndex)
    // console.log(eventIndex)
    if (typeof eventIndex !== "undefined"){
      
      if (typeof json.event[eventIndex].name !== "undefined"){
        message = json.event[eventIndex].headline[Math.floor(Math.random()*json.event[eventIndex].headline.length)]//randomly pick headline from array
      }
      this.setState({"headlineMessage":message})

    }
  }
  dailyEventCheck(){ // plug into onedaypast()? 
    let json = eventJSON
    let event
    for(let i = 0;i<json.event.length;i++){
      // console.log(json.event[i])
      if(this.state.day===json.event[i].tiggerDate){ // looks for the event by day 
        console.log(this.state.day + "<---day")
        event = json.event[i].name // one day have at most one event that tigger automatically, so break should be fine
        console.log(event + "<--------event")
       break;
      } // else no event
    }
    if (typeof event !== "undefined"){ // if there is an event set for that day
      this.eventActivate(event) // tigger it
    }
  }
  
softReset(){ // set all the state in appjs back to the default states
    for (let key in upgradeJSON){// resets upgrade
      console.log(key)
      upgradeJSON[key].forEach((v,i)=>{
        v.purchased = false
        console.log(v)
      })
    }
  
  
  //-----resets state appjs
   let stateData = {};
   let totalPopulation = 0;
   stateGeoJSON.features.forEach((v, i) => {
      if (v.properties.NAME !== "District of Columbia"){
        let newState = new State(v.properties.NAME, populationJSON[v.properties.NAME], v);
        stateData[v.properties.NAME] = newState;
        totalPopulation += populationJSON[v.properties.NAME];
      }
    });
    
    // set up airport data
    for (let key in airportJSON){
      let airport = airportJSON[key];
      let stateName = airport.state;
      let state = stateData[stateName];
      state.hasAirport = true;
      state.airport = airport;
    }
    
    // set up the us data
    stateData.US = new State("US", totalPopulation);
  
  this.setState({
      stateData: stateData,
      airlines: [],
      upgrades: upgradeJSON,
      // in game variables
      selecting: "US",
      day: 0,
      pplPoint: 0,
      deathPointAccu: 0,
      fatality: 0,
      researchCompleted: 0,
      researchRate: 0,
      headlineMessage:"",
      // upgrade specific variables "keys"
      landBlockade: false,
      airRestriction: false,
      reduceLethal1: false,
      reduceLethal2: false,
      // game system state
      gameStarted: false,
      gameEnded:false,
      // 0 pause 1 regular 2 fast 3 extreme fast
      gameSpeed: 1,
      // just the speed of the timer
      gameTimerSpeed: 1000 / 30,
      // accumulation += timerSpeed everytime timer is ticked
      gameTimerAccumulation: 0,
      // accumulation >= oneday then run oneDayPassed()
      gameOneDay: 1000,
      // datas for graphing
      gameInfectedData: [],
      gameDeathData: [], 
  })
}
  
  render() {
    
    // render all components
    return (
      <div className="App">
        <div className="mapContainer">
          <Map
            // static data
            center={{ x: 40.2, y: -95.7129 }}
            borderGeoJSON={borderGeoJSON}
            stateGeoJSON={stateGeoJSON}
            populationJSON={populationJSON}
            airportJSON={airportJSON}
            
            // dynamic data for render
            stateData={this.state.stateData}
            airlines={this.state.airlines}
            
            // handlers
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
          onUpgrade = {(upgrade) => this.onUpgrade(upgrade)}
          upgradeInfo = {this.state.upgrades}
          researchCompleted = {this.state.researchCompleted}
          message = {this.state.headlineMessage}
          lethalPts = {this.state.fatality}
          lethalStatus = {[this.state.reduceLethal1, this.state.reduceLethal2]}
        />  
        <Popup 
          gameEnd={this.state.gameEnded}
          infectedData={this.state.gameInfectedData}
          deathData={this.state.gameDeathData}
          infectDeathData={this.state.gameInfectDeathData}
          softReset = {this.softReset.bind(this)} 
          //^^^^^ binds the function.
          />
      </div>
    );
  }
}

export default App;

//classes
class State{
  constructor(name, population, geoJSON){
   
    // game data
    this.name = name;
    this.population = population;
    this.infectionRate = 1.2;
    this.infected = 0;
    this.infectedDecimal = 0.0;
    this.death = 0;
    this.recovered = 0;
    this.pplPointMilestone = 1;
    this.lethality = 0;
    this.hasAirport = false;
    this.airport = {};
    
    // airline info
    this.planeExit = [];
    this.planeEnter = [];
    
    // event data
    this.landLocked = false;
    this.airportLocked = false;
    this.maskedWearing = false;
    this.quarantinePatient = false;
    
    // rendering data
    this.style={
      color: "cadetblue",
      fillColor: "#3388ff",
      opacity: 0.5,
    }
    
    // static data
    this.geoJSON = geoJSON;
  }
}

class Plane{
  constructor(startPortName, endPortName, planeKey, callback){
    let startPort = airportJSON[startPortName];
    let startlatlon = [startPort.Latitude, startPort.Longitude];
    let endPort = airportJSON[endPortName];
    let endlatlon = [endPort.Latitude, endPort.Longitude];
    
    // final
    this.callback = callback;
    
    // dynamic
    this.currentlat = startlatlon[0];
    this.currentlon = startlatlon[1];
    this.currentIndex = 0;
    this.bound = [[this.currentlat,this.currentlon], [this.currentlat+1,this.currentlon+1]];
    
    // static
    this.startlatlon = startlatlon;
    this.endlatlon = endlatlon;
    this.startState = startPort.state;
    this.endState = endPort.state;
    this.hasVirus = false;
    this.planeKey = planeKey
    
    // calculated
    this.distance = distanceTwoPoints(startlatlon, endlatlon);
    this.angle = angleTwoPoints(startlatlon, endlatlon);
    this.slope = slope(startlatlon, endlatlon);
    this.intervalLength = this.distance / Math.floor(this.distance);
    this.intervalList = [];
   
    // cutting
    for (let i = 0; i < this.distance; i += this.intervalLength){
      this.intervalList.push([this.startlatlon[0] + i * this.slope[0] / Math.floor(this.distance), this.startlatlon[1] + i * this.slope[1] / Math.floor(this.distance)]);
    }
  }
  
  next(i){ 
    //i is the plane's index in this.state.airlines
    this.currentIndex ++;
    if (this.currentIndex >= this.intervalList.length){
      return this.callback(this);
    } else {
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

//counterclockwise, start from x-axis
function angleTwoPoints(latlon1, latlon2){
  let r = (Math.atan2((latlon2[1] - latlon1[1]), (latlon2[0] - latlon1[0])) * 180 / Math.PI) * -1;
    if (isNaN(r)){
        return 0;
    }
    return r;
}

function slope(latlon1, latlon2){
  return [latlon2[0] - latlon1[0], latlon2[1] - latlon1[1]];
}