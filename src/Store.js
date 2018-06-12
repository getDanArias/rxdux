import { Subject, merge } from "rxjs";
import { scan, map, startWith } from "rxjs/operators";

const ADD_TODO = "Add Todo";
const DELETE_TODO = "Delete Todo";
const UPDATE_TODO = "Update Todo";

const AddTodo = new Subject();
export const AddTodoAction$ = AddTodo.pipe(
  map(value => ({
    type: ADD_TODO,
    payload: value
  }))
);

const DeleteTodo = new Subject();
export const DeleteTodoAction$ = DeleteTodo.pipe(
  map(value => ({
    type: DELETE_TODO,
    payload: value
  }))
);

const UpdateTodo = new Subject();
export const UpdateTodoAction$ = UpdateTodo.pipe(
  map(value => ({
    type: UPDATE_TODO,
    payload: value
  }))
);

const initialState = {
  todos: [
    {
      id: Date.now(),
      body: "Cancel LinkedIn Free Trial",
      status: "undone"
    }
  ]
};

export const getInitialState = () => initialState;

export const Todos$ = merge(
  AddTodoAction$,
  DeleteTodoAction$,
  UpdateTodoAction$
).pipe(
  startWith(initialState),
  scan((state, action) => {
    switch (action.type) {
      case ADD_TODO:
        return {
          ...state,
          todos: [...state.todos, action.payload]
        };
      case DELETE_TODO:
        return {
          ...state,
          todos: state.todos.filter(todo => todo.id !== action.payload)
        };
      case UPDATE_TODO:
        return {
          ...state,
          todos: state.todos.map(todo => {
            if (todo.id === action.payload.id) {
              return { ...todo, ...action.payload };
            } else {
              return todo;
            }
          })
        };
      default:
        return state;
    }
  })
);
