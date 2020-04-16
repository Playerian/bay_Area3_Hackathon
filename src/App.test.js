/* global it */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  console.log("Welcome");
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
