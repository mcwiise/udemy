import { useRef } from "react";
import classes from "./NewTodo.module.css";

const NewTodo: React.FC<{
  onTodoEntered: (text: string) => void;
}> = (props) => {
  const todoTextInput = useRef<HTMLInputElement>(null);

  const submitHandeler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = todoTextInput.current!.value;
    if (enteredText.length === 0) {
      return;
    }
    props.onTodoEntered(enteredText);
  };

  return (
    <form className={classes.form} onSubmit={submitHandeler}>
      <label htmlFor="text">Todo Text</label>
      <input type="text" id="text" ref={todoTextInput} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
