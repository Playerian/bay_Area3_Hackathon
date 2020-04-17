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
    text: "Help save the country from the virus! Click on any state to start playing. You have 180 days to FLATTEN THE CURVE!!", 
    button: "Let's Go!"
  });
}

ReactDOM.render(<App />, document.getElementById("root"), welcome());
