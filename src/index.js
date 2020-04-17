import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import swal from "sweetalert";

function welcome() {
  swal({
    title: "Welcome!",
    text: "Click on any state to start playing",
    button: "Let's Go!"
  });
}

ReactDOM.render(<App />, document.getElementById("root"), welcome());
