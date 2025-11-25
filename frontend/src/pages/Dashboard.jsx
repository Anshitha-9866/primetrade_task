import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';        // adjust path as needed!
import { taskService } from '../services/taskService'; // adjust path as needed!

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Task Form State
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });

  // Edit Task State (null = not editing)
  const [editTask, setEditTask] = useState(null);

  // ==== READ TASKS ====
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userTasks = await taskService.getAll();
        setTasks(userTasks);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // ==== CREATE TASK ====
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const created = await taskService.create(newTask);
      setTasks([...tasks, created]);
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (err) {
      alert('Failed to add task');
    }
  };

  // ==== UPDATE TASK ====
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await taskService.update(editTask._id, editTask);
      setTasks(tasks.map(t => t._id === updated._id ? updated : t));
      setEditTask(null);
    } catch (err) {
      alert('Failed to update task');
    }
  };

  // ==== DELETE TASK ====
  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user?.name || user?.email}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ==== CREATE FORM ==== */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          required
          className="border px-2 py-1 rounded"
          placeholder="Title"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className="border px-2 py-1 rounded"
          placeholder="Description"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
        />
        <select
          className="border px-2 py-1 rounded"
          value={newTask.status}
          onChange={e => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Add</button>
      </form>

      {/* ==== READ/LIST TASKS ==== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p>{task.description}</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : (task.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800')
              }`}>
                {task.status}
              </span>
              <button
                className="ml-2 text-sm text-blue-700 hover:underline"
                onClick={() => setEditTask(task)}
              >
                Edit
              </button>
              <button
                className="ml-2 text-sm text-red-700 hover:underline"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* ==== EDIT MODAL ==== */}
      {editTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
          <form
            className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]"
            onSubmit={handleUpdate}
          >
            <h3 className="font-bold text-lg mb-2">Edit Task</h3>
            <input
              required
              className="border px-2 py-1 mb-2 w-full rounded"
              value={editTask.title}
              onChange={e => setEditTask({ ...editTask, title: e.target.value })}
            />
            <input
              className="border px-2 py-1 mb-2 w-full rounded"
              value={editTask.description}
              onChange={e => setEditTask({ ...editTask, description: e.target.value })}
            />
            <select
              className="border px-2 py-1 mb-2 w-full rounded"
              value={editTask.status}
              onChange={e => setEditTask({ ...editTask, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button type="submit" className="bg-blue-500 text-white px-4 rounded">Save</button>
              <button type="button" onClick={() => setEditTask(null)} className="bg-gray-300 px-4 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
