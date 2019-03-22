import React, { Component } from "react";
import curveLinear from "d3-shape/src/curve/linear.js";
import scaleTime from "d3-scale/src/time.js";
import scaleLinear from "d3-scale/src/linear.js";
import extent from "d3-array/src/extent.js";

export default class UpdatableChart extends Component {

  render() {
    return (
      <canvas
        height={this.props.height}
        width={this.props.width}
        ref={(el) => { this.canvas = el }}>
      </canvas>
    );
  }

  componentDidMount() {
    this.x = scaleTime()
      .range([0, this.canvas.width]);
    this.y = scaleLinear()
      .range([this.canvas.height, 0]);
    this.x.domain([+new Date(), +new Date() + 1E5]);
    this.y.domain([-1,2]);
    const context = this.canvas.getContext("2d");
    context.strokeStyle = '#999';
  }

  componentDidUpdate(prevProps) {
    this.updateChart(prevProps.newData, this.props.newData);
  }

  updateChart(d1, d2) {
    const context = this.canvas.getContext("2d");
    context.beginPath();
    // this.line(data);
    context.stroke();
  }
}
