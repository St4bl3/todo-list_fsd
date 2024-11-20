import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:4000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(1); // Priority: 1 (Low) by default
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (title.trim()) {
      try {
        const response = await axios.post(`${API_URL}/tasks`, {
          title,
          dueDate,
          priority,
        });
        setTasks([...tasks, response.data]);
        setTitle("");
        setDueDate("");
        setPriority(1);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, { completed });
      setTasks(
        tasks.map((task) =>
          task.id === id
            ? { ...task, completed: response.data.completed }
            : task
        )
      );
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Update task priority
  const updatePriority = async (id, newPriority) => {
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, {
        priority: newPriority,
      });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, priority: response.data.priority } : task
        )
      );
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Clear all completed tasks
  const clearCompleted = async () => {
    const completedTasks = tasks.filter((task) => task.completed);
    for (const task of completedTasks) {
      await deleteTask(task.id);
    }
  };

  // Filter tasks by search term
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
        <select
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={1}>Low</option>
          <option value={2}>Medium</option>
          <option value={3}>High</option>
        </select>
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
              <span className="task-priority">
                Priority: {["Low", "Medium", "High"][task.priority - 1]}
              </span>
            </div>
            <div className="task-buttons">
              <button
                className="complete-btn"
                onClick={() => toggleTask(task.id, !task.completed)}
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
              <select
                value={task.priority}
                onChange={(e) =>
                  updatePriority(task.id, Number(e.target.value))
                }
                className="priority-select"
              >
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
              </select>
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
