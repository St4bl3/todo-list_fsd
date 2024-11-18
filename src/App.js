import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:4000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    setTasks(response.data);
  };

  const addTask = async () => {
    if (title.trim()) {
      const response = await axios.post(`${API_URL}/tasks`, { title });
      setTasks([...tasks, response.data]);
      setTitle("");
    }
  };

  const toggleTask = async (id, completed) => {
    const response = await axios.put(`${API_URL}/tasks/${id}`, { completed });
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: response.data.completed } : task
      )
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span className={`task-title ${task.completed ? "completed" : ""}`}>
              {task.title}
            </span>
            <div className="task-buttons">
              <button
                className="complete-btn"
                onClick={() => toggleTask(task.id, !task.completed)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <button
                className="delete-btn"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
