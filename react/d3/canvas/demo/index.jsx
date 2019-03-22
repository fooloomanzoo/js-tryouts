import React from "react";
import ReactDOM from "react-dom";

import SimpleChart from "../src/SimpleChart.jsx";
import UpdatableChart from "../src/UpdatableChart.jsx";

function createRandomData(i = 0) {
  return {
    x: +(new Date()) + i,
    y: Math.random()
  }
}

class Demo extends React.Component {

  state = {
    data: (() => {
      let data = [];
      for (var i = 0; i < 500; i++) {
        data.push(createRandomData(i*100));
      }
      return data;
    })(),
    newData: createRandomData()
  }

  intervalForUpdatedData = 500;

  render() {
    return (
      <div>
        <h1>Simple Chart (static)</h1>
        <SimpleChart data={this.state.data} width={500}/>
        <h1>Updated Chart</h1>
        <UpdatableChart data={this.state.newData} width={500}/>
      </div>
    );
  }

  componentDidMount() {
    setInterval( () => {
      this.setState({
        newData: createRandomData()
      })
    }, this.intervalForUpdatedData);
  }
};

// render main-component
ReactDOM.render(<Demo />, document.getElementById("root"));
