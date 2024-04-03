import react from "react";
import { useNavigate, Link } from "react-router-dom";
import FilterButton from "../components/FilterButton";
import Form from "../components/Form";
import Todo from "../components/Todo";
import utils from "../utils";
import myApi from "../api.config";
import NavBar from "../components/NavBar";


export default function TodoPage() {
  const [tasks, setTasks] = react.useState([]);
  const [filter, setFilter] = react.useState("All");
  const [loading, setLoading] = react.useState(true);
  const [apiStatus, setApiStatus] = react.useState(undefined);

  const previousTaskLength = utils.usePrevious(tasks.length);
  const navigate = useNavigate();


  react.useEffect(() => {
    fetchTasks()
  }, []);

  const taskList = tasks
    .filter(utils.FILTER_MAP[filter])
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

  const filterList = utils.FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={filter === name}
      setFilter={setFilter}
    />
  ));

  const tasksNoun = taskList?.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList?.length} ${tasksNoun}`;

  const listHeadingRef = react.useRef(null);

  react.useEffect(() => {
    if (tasks.length + 1 === previousTaskLength) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, previousTaskLength]);

  if (loading) return <h3>Loading...</h3>;

  if (apiStatus !== undefined && apiStatus !== 200) {
    // Handle API error
    if (apiStatus === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => navigate("/auth/login"), 1500);
      return <h1>Unauthorized</h1>;
    }
    if (apiStatus === 403) return <h1>Forbidden</h1>;
    if (apiStatus === 404) return <h1>Not Found</h1>;
    else return <h1>Server Error</h1>;
  }

  const user = localStorage.getItem('user');

  return (
    <>
      <NavBar >
        <nav>
          <h1>TodoMatic</h1>
          <div className="nav-profile">
            <span className="user">{user}</span>
            <span> | </span>
            <Link to="/auth/login" onClick={handleLogout}>Logout</Link>
          </div>
        </nav>
      </NavBar>
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
      alert(error.response.data)
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
          alert(error.response.data);
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
          alert(error.response.data);
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
          alert(error.response.data);
        }
      }
      updatedTaskList.push(task)
    }
    setTasks(updatedTaskList);
  }

  function fetchTasks() {
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
  }

  async function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    try {
      await myApi.post("/users/logout")
    } catch (error) {
      alert(error.response);
    }
  }
}