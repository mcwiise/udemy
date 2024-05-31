import { useState } from "react";
import "./App.css";
import NewTodo from "./components/NewTodo";
import Todos from "./components/Todos";
import Todo from "./models/todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  function todoEnteredHandler(todoText: string) {
    const newTodo = new Todo(todoText);
    setTodos((prevTodos) => {
      return prevTodos.concat(newTodo);
    });
  }

  function removeTodo() {
    setTodos((prevTodos) => {
      return prevTodos.splice(1);
    });
  }

  return (
    <div>
      <NewTodo onTodoEntered={todoEnteredHandler} />
      <button onClick={removeTodo}>Remove Todo</button>
      <Todos items={todos} />
    </div>
  );
}

export default App;
