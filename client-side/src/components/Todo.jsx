/* eslint-disable react/prop-types */
import react from "react";
import utils from "../utils";

function Todo(props) {
  const [isEditing, setEditing] = react.useState(false);
  const [newName, setNewName] = react.useState(props.name);
  const editFieldRef = react.useRef(null);
  const editButtonRef = react.useRef(null);
  const wasEditing = utils.usePrevious(isEditing);

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={props.id}>
          New name for {props.name}
        </label>
        <input
          value={newName}
          onChange={handleChange}
          id={props.id}
          className="todo-text"
          type="text"
          ref={editFieldRef}
          required
        />
      </div>
      <div className="btn-group">
        <button
          onClick={() => setEditing(false)}
          type="button"
          className="btn todo-cancel"
        >
          Cancel
          <span className="visually-hidden">renaming {props.name}</span>
        </button>
        <button disabled={newName.trim() ? false : true} type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {props.name}</span>
        </button>
      </div>
    </form>
  );

  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id}>
          {props.name}
        </label>
      </div>
      <div className="btn-group">
        <button
          onClick={() => setEditing(true)}
          type="button"
          className="btn"
          ref={editButtonRef}
        >
          Edit <span className="visually-hidden">{props.name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.deleteTask(props.id)}
        >
          Delete <span className="visually-hidden">{props.name}</span>
        </button>
      </div>
    </div>
  );

  react.useEffect(() => {
    if (isEditing && !wasEditing) {
      editFieldRef.current.focus();
    }
    if (!isEditing && wasEditing) {
      editButtonRef.current.focus();
    }
  }, [isEditing, wasEditing]);

  return (
    <>
      <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>
    </>
  );

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName(newName.trim());
    setEditing(false);
  }
}

export default Todo;
