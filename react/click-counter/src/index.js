import React from "react";
import ReactDOM from "react-dom";

import ClickCounter from "./components/ClickCounter.js";

const Index = () => {
  return <ClickCounter />;
};

ReactDOM.render(<Index />, document.getElementById("root"));
