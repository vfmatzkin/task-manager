"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const initialUsers = ["User A", "User B", "User C"];

function CreateTask({ onCreate, users }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState(users[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, date, user });
    setTitle("");
    setDate("");
    setUser(users[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <select value={user} onChange={(e) => setUser(e.target.value)} required>
        {users.map((user, index) => (
          <option key={index} value={user}>
            {user}
          </option>
        ))}
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
}

function TaskList({ tasks, onDelete }) {
  return (
    <ul className="list-disc">
      {tasks.map((task, index) => (
        <li key={index} className="flex justify-between items-center">
          <span>
            {task.title} - {task.date} - {task.user}
          </span>
          <button onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleCreateTask = (task) => {
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...task,
        userId: 1, // Replace with actual userId logic
      }),
    })
    .then(response => response.json())
    .then(newTask => setTasks([...tasks, newTask]))
    .catch(error => console.error('Error creating task:', error));
  };

  const handleDeleteTask = (index) => {
    const task = tasks[index];
    fetch(`/api/tasks?id=${task.id}`, {
      method: 'DELETE',
    })
    .then(() => setTasks(tasks.filter((_, i) => i !== index)))
    .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <pre className="text-center">
          {`
 _____         _      __  __                                   
|_   _|_ _ ___| | __ |  \/  | __ _ _ __   __ _  __ _  ___ _ __ 
  | |/ _\` / __| |/ / | |\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|
  | | (_| \\__ \\   <  | |  | | (_| | | | | (_| | (_| |  __/ |   
  |_|\\__,_|___/_|\\_\\ |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|   
                                               |___/           
          `}
        </pre>
        <CreateTask onCreate={handleCreateTask} users={initialUsers} />
        <TaskList tasks={tasks} onDelete={handleDeleteTask} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
