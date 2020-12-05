import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import swal from "sweetalert";

// callback function: alert player on how to start the game upon entering
// alert is done with sweetAlert
function welcome() {
  swal({
    title: "Welcome!",
    text: "Click on any state to start playing. You have 180 days to FLATTEN THE CURVE!! Help save the country from the virus!", 
    button: "Let's Go!"
  });
  console.log("TIGGERED");
}

ReactDOM.render(<App />, document.getElementById("root"), welcome());
