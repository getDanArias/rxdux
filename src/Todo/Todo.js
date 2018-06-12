import React, { Component } from "react";
import { Subject, merge } from "rxjs";
import { mapTo, scan, map } from "rxjs/operators";

import "./Todo.css";

export default class Todo extends Component {
  state = {
    todo: { ...this.props.data },
    editingStatus: "edit"
  };

  constructor(props) {
    super(props);

    this.MARK_DONE = "Mark Done";
    this.MARK_UNDONE = "Mark Undone";
    this.MARK_EDIT = "Mark Edit";
    this.MARK_SAVE = "Mark Save";
    this.CHANGE = "Change";

    this.MarkDone = new Subject();
    this.MarkDoneAction$ = this.MarkDone.pipe(mapTo({ type: this.MARK_DONE }));

    this.MarkUndone = new Subject();
    this.MarkUndoneAction$ = this.MarkUndone.pipe(
      mapTo({ type: this.MARK_UNDONE })
    );

    this.MarkEdit = new Subject();
    this.MarkEditAction$ = this.MarkEdit.pipe(mapTo({ type: this.MARK_EDIT }));

    this.MarkSave = new Subject();
    this.MarkSaveAction$ = this.MarkSave.pipe(mapTo({ type: this.MARK_SAVE }));

    this.Change = new Subject();
    this.ChangeAction$ = this.Change.pipe(
      map(value => ({ type: this.CHANGE, payload: value }))
    );

    this.state$ = merge(
      this.MarkDoneAction$,
      this.MarkUndoneAction$,
      this.MarkEditAction$,
      this.MarkSaveAction$,
      this.ChangeAction$
    ).pipe(
      scan((state, action) => {
        switch (action.type) {
          case this.MARK_DONE:
            return { ...state, todo: { ...this.state.todo, status: "done" } };
          case this.MARK_UNDONE:
            return { ...state, todo: { ...this.state.todo, status: "undone" } };
          case this.MARK_EDIT:
            return { ...state, editingStatus: "edit" };
          case this.MARK_SAVE:
            return { ...state, editingStatus: "save" };
          case this.CHANGE:
            return {
              ...state,
              todo: { ...this.state.todo, body: action.payload }
            };
          default:
            return state;
        }
      }, this.state)
    );

    this.onTodoInputChange = this.onTodoInputChange.bind(this);
  }

  componentDidMount() {
    this.state$.subscribe(state => this.setState(state));
  }

  onTodoInputChange(event) {
    this.ChangeAction$.next(event.target.value);
  }

  render() {
    return (
      <div className="todo-item">
        <div
          onClick={() => {
            if (this.state.todo.status === "done") {
              this.MarkUndoneAction$.next();
            } else {
              this.MarkDoneAction$.next();
            }

            setTimeout(() => {
              this.props.update(this.state.todo);
            });
          }}
          className={`status-orb`}
          data-state={this.state.todo.status}
        />
        <div
          onClick={() => {
            if (this.state.editingStatus === "edit") {
              this.MarkSaveAction$.next();
            } else {
              this.MarkEditAction$.next();
              this.props.update(this.state.todo);
            }
          }}
          className={`edit-button`}
          data-state={this.state.editingStatus}
        >
          {this.state.editingStatus === "edit" ? (
            <i className="fas fa-pencil-alt" />
          ) : (
            <i className="fas fa-save" />
          )}
        </div>
        <input
          data-state={this.state.editingStatus}
          onChange={this.onTodoInputChange}
          className={`todo-input`}
          value={this.state.todo.body}
          disabled={this.state.editingStatus === "edit"}
        />
      </div>
    );
  }
}
