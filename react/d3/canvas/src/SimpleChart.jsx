import React, { Component } from "react";
import { line, curveLinear } from "d3-shape";
import { scaleTime, scaleLinear } from "d3-scale";
import { extent } from "d3-array";

function drawChart(context, data) {
  context.beginPath();
  this.line(data);
  context.stroke();
}

export default class SimpleChart extends Component {

  context = null;

  line = line()
    .x(d => { return this.x(d.x); })
    .y(d => { return this.y(d.y); })
    .curve(curveLinear);

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
    const context = this.canvas.getContext("2d");
    this.line.context(context);
    context.strokeStyle = '#999';
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.x.domain(extent(this.props.data, function(d) { return d.x; }));
    this.y.domain(extent(this.props.data, function(d) { return d.y; }));
    this.drawChart(this.line.context(), this.props.data);
  }
}
