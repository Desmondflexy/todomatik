/* eslint-disable react/prop-types */
import FilterButton from "../components/FilterButton";
import Form from "../components/Form";
import Todo from "../components/Todo";
import { useState, useRef, useEffect } from "react";
import { usePrevious, FILTER_MAP, FILTER_NAMES } from "../utils";
import myApi from "../api.config";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";


export default function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const previousTaskLength = usePrevious(tasks.length);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(undefined);

  useEffect(() => {
    myApi
      .get(`/tasks`)
      .then((res) => {
        setApiStatus(res.status);
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!err.response) setApiStatus(500);
        else setApiStatus(err.response.status);
        setLoading(false);
      });
  }, []);

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        key={task._id}
        id={task._id}
        name={task.name}
        completed={task.completed}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={filter === name}
      setFilter={setFilter}
    />
  ));

  const tasksNoun = taskList?.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList?.length} ${tasksNoun}`;

  const listHeadingRef = useRef(null);

  useEffect(() => {
    if (tasks.length + 1 === previousTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, previousTaskLength]);

  if (loading) return <h3>Loading...</h3>;

  if (apiStatus !== undefined && apiStatus !== 200) {
    // Handle API error
    if (apiStatus === 401) {
      setTimeout(() => navigate("/auth/login"), 1500);
      return <h1>Unauthorized</h1>;
    }
    if (apiStatus === 403) return <h1>Forbidden</h1>;
    if (apiStatus === 404) return <h1>Not Found</h1>;
    else return <h1>Server Error</h1>;
  }

  return (
    <>
      <NavBar />
      <div className="todoapp stack-large">
        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">{filterList}</div>
        <h2 id="list-heading" ref={listHeadingRef} tabIndex={-1}>
          {headingText} remaining
        </h2>
        <ul
          role="list"
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
        >
          {taskList}
        </ul>
      </div>
    </>

  );

  async function addTask(name) {
    name = name.trim();
    const newTask = { name };
    try {
      const response = await myApi.post('/tasks', newTask);
      setTasks([response.data.task, ...tasks]);
    } catch (error) {
      console.error(error.response.data)
    }
  }

  async function toggleTaskCompleted(id) {
    const updatedTaskList = [];
    for (const task of tasks) {
      if (id === task._id) {
        try {
          const toggled = !task.completed
          await myApi.put(`/tasks/${id}`, { completed: toggled, name: task.name });
          task.completed = toggled;
        } catch (error) {
          console.error(error.response.data);
        }
      }
      updatedTaskList.push(task)
    }
    setTasks(updatedTaskList);
  }

  async function deleteTask(id) {
    const remainingTasks = [];
    for (const task of tasks) {
      if (id === task._id) {
        try {
          await myApi.delete(`/tasks/${id}`);
        } catch (error) {
          console.error(error.response.data);
        }
        continue;
      }
      remainingTasks.push(task);
    }
    setTasks(remainingTasks);
  }

  async function editTask(id, newName) {
    const updatedTaskList = [];
    for (const task of tasks) {
      if (id === task._id) {
        try {
          await myApi.put(`/tasks/${id}`, { completed: task.completed, name: newName });
          task.name = newName;
        } catch (error) {
          console.error(error.response.data);
        }
      }
      updatedTaskList.push(task)
    }
    setTasks(updatedTaskList);
  }
}