import cx from 'classnames';
import React, { Component } from "react";

export default class TodoList extends Component {

  constructor(props) {
    super(props);
    // bind handler to `this`
    this.addItem = this.addItem.bind(this);
    this.doJob = this.doJob.bind(this);
    // initiate `state`
    this.state = {
      list: [],
      inputValue: ''
    };
    this.inputRef = React.createRef();
  }

  addItem() {
    let list = this.state.list;
    list.push({
      title: this.inputRef.current.value,
      done: false
    })
    this.setState({
      list: list
    });
    this.inputRef.current.value = '';
  }

  doJob(i) {
    return () => {
      if (this.state.list[i]) {
        let list = this.state.list;
        list[i].done = true;
        this.setState(
          {
            list: list
          }
        );
      }
    }
  }

  render() {
    return (
      <div>
          <style>{`\
            .is-done {\
              text-decoration: line-through;
            }\
          `}</style>
          <h2>
              Todo List
          </h2>
          <div className="add">
              <input type="text" ref={this.inputRef}/>
              <button onClick={this.addItem}>Add</button>
          </div>
          <div className="progress">
            {
              this.state.list.reduce((acc, curr) => {
                return acc + curr.done ? 0 : 1;
              }, 0)
            } remaining out of {this.state.list.length} tasks
          </div>
          <ul>
            {
              this.state.list.map((item, i) => {
                return <li key={`${i}`} className={cx({'is-done': item.done})} onClick={this.doJob(i)}>{item.title}</li>
              })
            }
          </ul>
      </div>
    );
  }
}
