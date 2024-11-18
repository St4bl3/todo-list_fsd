import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:4000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    setTasks(response.data);
  };

  const addTask = async () => {
    if (title.trim()) {
      const response = await axios.post(`${API_URL}/tasks`, { title, dueDate });
      setTasks([...tasks, response.data]);
      setTitle("");
      setDueDate("");
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

  const clearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.completed);
    for (const task of completedTasks) {
      await deleteTask(task.id);
    }
  };

  const searchTasks = (tasks) => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <h1>To-Do List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Task Input */}
      <div className="input-container">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Task List */}
      <ul>
        {searchTasks(tasks).map((task) => (
          <li className="task-card" key={task.id}>
            <div className="task-details">
              <span
                className={`task-title ${task.completed ? "completed" : ""}`}
              >
                {task.title}
              </span>
              <span className="task-date">
                {task.dueDate ? `Due: ${task.dueDate}` : ""}
              </span>
            </div>
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

      {/* Clear Completed Tasks */}
      <button className="clear-btn" onClick={clearCompleted}>
        Clear Completed Tasks
      </button>
    </div>
  );
}

export default App;
