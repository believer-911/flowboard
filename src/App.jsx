
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // React state
  
const [tasks, setTasks] = useState(() => {
  try {
    const savedTasks = localStorage.getItem("flowboard-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  } catch {
    return [];
  }
});

  const [taskName, setTaskName] = useState("");

  // Dashboard statistics
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // Add a new task
  function addTask() {
    const name = taskName.trim();

    if (!name) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: name,
      status: "todo",
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);

    setTaskName("");
    
useEffect(() => {
  localStorage.setItem("flowboard-tasks", JSON.stringify(tasks));
}, [tasks]);

  }

  // Mark a task completed or pending
  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status:
              task.status === "completed"
                ? "todo"
                : "completed",
          };
        }

        return task;
      })
    );
  }

  // Delete a task
  function deleteTask(id) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== id
      )
    );
  }

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>⚡ FlowBoard</h2>

        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#tasks">My Tasks</a>
          <a href="#projects">Projects</a>
          <a href="#settings">Settings</a>
        </nav>
      </aside>

      {/* Main dashboard */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Dashboard</h1>
            <p>
              Welcome back! Here's your workspace.
            </p>
          </div>

          {/* Add task */}
          <div className="task-input">
            <input
              type="text"
              placeholder="Enter a task..."
              aria-label="Task name"
              value={taskName}
              onChange={(e) =>
                setTaskName(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
            />

            <button
              className="new-task-btn"
              onClick={addTask}
            >
              + Add Task
            </button>
          </div>
        </header>

        {/* Live statistics */}
        <section className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p>{pendingTasks}</p>
          </div>

          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p>{completedTasks}</p>
          </div>
        </section>

        {/* Task list */}
        <section className="tasks-section">
          <h2>Recent Tasks</h2>

          {tasks.length === 0 ? (
            <p>
              No tasks yet. Create your first task!
            </p>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="task-item"
                >
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={
                        task.status === "completed"
                      }
                      onChange={() =>
                        toggleTask(task.id)
                      }
                    />

                    <span
                      className={
                        task.status === "completed"
                          ? "completed-task"
                          : ""
                      }
                    >
                      {task.title}
                    </span>
                  </label>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    aria-label={
                      `Delete ${task.title}`
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
