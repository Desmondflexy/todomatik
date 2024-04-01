/* eslint-disable react/prop-types */
import { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
          value={name}
          onChange={handleChange}
          required
        />
        <button
          disabled={name.trim() ? false : true}
          type="submit"
          className="btn btn__primary btn__lg"
        >
          Add
        </button>
      </form>
    </>
  );

  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(name);
    setName("");
  }

  function handleChange(e) {
    setName(e.target.value);
  }
}

export default Form;
