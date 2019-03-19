import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import ClickCounter from '../src/components/ClickCounter.js';

describe('Basic Functionality', () => {
  it('Renders ClickCounter component correctly', () => {
    const tree = renderer
      .create(<ClickCounter />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Clicking increases `state.count` in ClickCounter and sets `state.active`', () => {
    const element = ReactTestUtils.renderIntoDocument(
      <ClickCounter />,
    );
    const counter = ReactDOM.findDOMNode(element);
    // mouse-down
    ReactTestUtils.Simulate.mouseDown(counter);
    expect(element.state.count).toBe(1);
    expect(element.state.active).toBe(true);
    // mouse-up
    ReactTestUtils.Simulate.mouseUp(counter);
    expect(element.state.count).toBe(1);
    expect(element.state.active).toBe(false);
    // touch-start
    ReactTestUtils.Simulate.touchStart(counter);
    expect(element.state.count).toBe(2);
    expect(element.state.active).toBe(true);
    // touch-end
    ReactTestUtils.Simulate.touchEnd(counter);
    expect(element.state.count).toBe(2);
    expect(element.state.active).toBe(false);
    // press `enter` key
    ReactTestUtils.Simulate.keyDown(counter, {key: "Enter", keyCode: 13, which: 13});
    expect(element.state.count).toBe(3);
    expect(element.state.active).toBe(true);
    // lift key
    ReactTestUtils.Simulate.keyUp(counter);
    expect(element.state.count).toBe(3);
    expect(element.state.active).toBe(false);
  });
});
