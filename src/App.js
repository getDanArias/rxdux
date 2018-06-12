import React, { Component } from "react";

import "./App.css";

import {
  getInitialState,
  Todos$,
  AddTodoAction$,
  DeleteTodoAction$,
  UpdateTodoAction$
} from "./Store";

import Todo from "./Todo/Todo";

class App extends Component {
  constructor(props) {
    super(props);

    this.newTodoTemplate = {
      id: null,
      body: "",
      status: "undone"
    };

    this.state = {
      ...getInitialState(),
      newTodo: this.newTodoTemplate
    };

    this.onAddTodoInputChange = this.onAddTodoInputChange.bind(this);
  }

  componentDidMount() {
    Todos$.subscribe(state => {
      this.setState(state);
    });
  }

  onAddTodoInputChange(event) {
    this.setState({
      newTodo: { ...this.state.newTodo, body: event.target.value }
    });
  }

  render() {
    return (
      <div className="App">
        <div className={`ListPanel`}>
          <div className="add-todo">
            <input
              onChange={this.onAddTodoInputChange}
              className="add-todo-input"
              value={this.state.newTodo.body}
              placeholder={`Enter todo item...`}
            />
            <div
              onClick={() => {
                AddTodoAction$.next({ ...this.state.newTodo, id: Date.now() });
                this.setState({ newTodo: { ...this.newTodoTemplate } });
              }}
              className="add-todo-button"
            >
              Add
            </div>
          </div>
          <div className="todo-list">
            {this.state.todos.map((todo, index) => (
              <Todo
                key={index}
                data={todo}
                update={payload => UpdateTodoAction$.next(payload)}
              />
            ))}
          </div>
        </div>
        <div className={`DataPanel`}>
          {this.state.todos.map((todo, index) => (
            <pre key={index}>{JSON.stringify(todo, null, 2)}}</pre>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
