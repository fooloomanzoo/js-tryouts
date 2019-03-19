import React from 'react';

/**
 * css import
 */
import style from '../style/click-counter.css';

const STYLECLASS = {
  ACTIVE: 'active',
  BASIC: 'basic'
};

/**
 * component declaration
 */
export default class ClickCounter extends React.Component {

  constructor(props) {
    super(props);
    // bind handler to `this`
    this.incrementCounter = this.incrementCounter.bind(this);
    this.onDownHandler = this.onDownHandler.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.removeActiveState = this.removeActiveState.bind(this);
    // initiate `state`
    this.state = {
      count: 0,
      active: false,
      class: style[STYLECLASS.BASIC]
    };
  }

  /**
   * handle key down events
   * @argument e Causing event
   */
  keyDownHandler(e) {
    if (e && e.keyCode === 13) {
      this.incrementCounter();
    }
  }

  /**
   * handle mouse-down- and touch-start-events
   * @argument e Causing event
   */
  onDownHandler(e) {
    if (e && e.keyCode === 13) {
      this.incrementCounter();
    }
  }

  /**
   * increment counter
   * @argument e Causing event
   */
  incrementCounter(e) {
    this.setState({
      count: this.state.count + 1,
      active: true,
      class: style[STYLECLASS.BASIC] + ' ' + style[STYLECLASS.ACTIVE]
    });
  }

  /**
   * removes active state from the element
   */
  removeActiveState() {
    this.setState({
      active: false,
      class: style[STYLECLASS.BASIC]
    });
  }

  /**
   * render component
   */
  render() {
    return (
      <h1 className= { this.state.class }
        onMouseDown = { this.incrementCounter }
        onTouchStart = { this.incrementCounter }
        onKeyDown = { this.keyDownHandler }
        onMouseUp = { this.removeActiveState }
        onTouchEnd = { this.removeActiveState }
        onKeyUp = { this.removeActiveState }
        aria-label = 'counter'
        aria-live = 'polite'
        aria-relevant = 'text'
        tabIndex = { 0 }>
        Clicks: { this.state.count }
      </h1>
    );
  }
}
