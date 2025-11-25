import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';

const daysBetween = (a, b) => Math.floor((a - b) / (1000 * 60 * 60 * 24));

const Dashboard = () => {
  const navigate = useNavigate();

  // Dark mode state (persists on reload)
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Tasks logic and UI states
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('created-desc');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editTask, setEditTask] = useState(null);

  // LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('token'); // adjust if you use a different key
    navigate('/login');
  };

  // Load tasks from API
  useEffect(() => {
    setLoading(true);
    taskService.getAll().then(setTasks).finally(() => setLoading(false));
  }, []);

  // Time filtering
  const now = new Date();
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    const createdAt = new Date(task.createdAt);
    if (filter === 'week') return daysBetween(now, createdAt) < 7;
    if (filter === 'month') return daysBetween(now, createdAt) < 30;
    if (filter === 'year') return daysBetween(now, createdAt) < 365;
    return true;
  });

  // Searching/suggestions
  const searchedTasks = filteredTasks.filter(
    task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
  );
  const suggestions = search
    ? filteredTasks
        .filter(task =>
          task.title.toLowerCase().startsWith(search.toLowerCase()) ||
          task.description.toLowerCase().startsWith(search.toLowerCase())
        ).slice(0, 5)
    : [];

  // Sorting
  let finalTasks = [...searchedTasks];
  if (sort === 'created-desc') {
    finalTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'created-asc') {
    finalTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'title-asc') {
    finalTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'title-desc') {
    finalTasks.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sort === 'status') {
    finalTasks.sort((a, b) => a.status.localeCompare(b.status));
  }

  // Group tasks by status
  const groupedTasks = {
    completed: finalTasks.filter(t => t.status === 'completed'),
    'in-progress': finalTasks.filter(t => t.status === 'in-progress'),
    pending: finalTasks.filter(t => t.status === 'pending'),
  };

  // Add
  const handleCreate = async e => {
    e.preventDefault();
    const created = await taskService.create(newTask);
    setTasks([...tasks, created]);
    setNewTask({ title: '', description: '', status: 'pending' });
    setShowAddModal(false);
  };

  // Edit
  const handleEdit = task => {
    setEditTask({ ...task });
    setShowEditModal(true);
  };
  const handleUpdate = async e => {
    e.preventDefault();
    const updated = await taskService.update(editTask._id, editTask);
    setTasks(tasks.map(t => (t._id === updated._id ? updated : t)));
    setShowEditModal(false);
    setEditTask(null);
  };

  // Delete
  const handleDelete = async id => {
    if (window.confirm('Delete this task?')) {
      await taskService.delete(id);
      setTasks(tasks.filter(t => t._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:to-blue-900 px-2 py-8">
      <div className="container mx-auto max-w-4xl px-8">
        {/* TOPBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
            Task Manager
          </h1>
          <div className="flex gap-3 items-center">
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow-lg font-bold transition transform hover:scale-105"
              onClick={() => navigate('/profile')}
            >
              View Profile
            </button>
            <button
              className="bg-white dark:bg-gray-800 px-3 py-2 rounded-xl border border-blue-300 dark:border-purple-700 shadow-lg font-bold"
              onClick={() => setDarkMode(dm => !dm)}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg transition ml-2"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {/* Filter, Sort, Search UI */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 items-center">
          {/* Filter */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="font-semibold text-blue-600 dark:text-blue-300">Filter</span>
            <select
              className="border border-purple-200 px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-300 bg-white dark:bg-gray-800 dark:text-white"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          {/* Sort */}
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="font-semibold text-pink-600 dark:text-pink-300">Sort By</span>
            <select
              className="border border-pink-200 px-3 py-2 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 bg-white dark:bg-gray-800 dark:text-white"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="status">Status</option>
            </select>
          </div>
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              className="border border-blue-200 px-3 py-2 rounded-xl shadow-sm w-full focus:ring-2 focus:ring-blue-300 bg-white dark:bg-gray-800 dark:text-white"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoComplete="off"
            />
            {search && suggestions.length > 0 && (
              <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded w-full p-1 top-full mt-1 shadow-lg">
                {suggestions.map(task => (
                  <li
                    key={task._id}
                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 px-2 py-1 text-sm rounded"
                    onClick={() => setSearch(task.title)}
                  >
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>

        {/* GROUPED TASKS BY STATUS */}
        {loading ? (
          <p className="text-lg text-purple-500 font-semibold">Loading tasks...</p>
        ) : finalTasks.length === 0 ? (
          <div className="text-center text-gray-400 col-span-2">No tasks found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pending */}
            <div>
              <h2 className="mb-3 font-bold text-lg text-yellow-600 dark:text-yellow-300 text-center">Pending</h2>
              {groupedTasks.pending.length === 0 ? (
                <p className="text-gray-400 text-center">None</p>
              ) : groupedTasks.pending.map(task => (
                <TaskCard key={task._id} task={task} handleEdit={handleEdit} handleDelete={handleDelete} />
              ))}
            </div>
            {/* In Progress */}
            <div>
              <h2 className="mb-3 font-bold text-lg text-blue-600 dark:text-blue-300 text-center">In Progress</h2>
              {groupedTasks['in-progress'].length === 0 ? (
                <p className="text-gray-400 text-center">None</p>
              ) : groupedTasks['in-progress'].map(task => (
                <TaskCard key={task._id} task={task} handleEdit={handleEdit} handleDelete={handleDelete} />
              ))}
            </div>
            {/* Completed */}
            <div>
              <h2 className="mb-3 font-bold text-lg text-green-700 dark:text-green-400 text-center">Completed</h2>
              {groupedTasks.completed.length === 0 ? (
                <p className="text-gray-400 text-center">None</p>
              ) : groupedTasks.completed.map(task => (
                <TaskCard key={task._id} task={task} handleEdit={handleEdit} handleDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddModal && (
          <Modal>
            <form
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl min-w-[340px] border-2 border-blue-100 dark:border-blue-700"
              onSubmit={handleCreate}
            >
              <h2 className="font-bold text-xl mb-4">Add Task</h2>
              <input
                className="border px-2 py-2 mb-2 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                placeholder="Title"
                required
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
              <textarea
                className="border px-2 py-2 mb-2 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                placeholder="Description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
              <select
                className="border px-2 py-2 mb-4 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                value={newTask.status}
                onChange={e => setNewTask({ ...newTask, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button type="submit" className="bg-blue-500 text-white px-5 rounded-lg">Add</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 dark:bg-gray-700 dark:text-white text-black px-5 rounded-lg">Cancel</button>
              </div>
            </form>
          </Modal>
        )}

        {/* Edit Task Modal */}
        {showEditModal && editTask && (
          <Modal>
            <form
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl min-w-[340px] border-2 border-purple-200 dark:border-purple-700"
              onSubmit={handleUpdate}
            >
              <h2 className="font-bold text-xl mb-4">Edit Task</h2>
              <input
                className="border px-2 py-2 mb-2 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                placeholder="Title"
                required
                value={editTask.title}
                onChange={e => setEditTask({ ...editTask, title: e.target.value })}
              />
              <textarea
                className="border px-2 py-2 mb-2 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                placeholder="Description"
                value={editTask.description}
                onChange={e => setEditTask({ ...editTask, description: e.target.value })}
              />
              <select
                className="border px-2 py-2 mb-4 w-full rounded-xl dark:bg-gray-800 dark:text-white"
                value={editTask.status}
                onChange={e => setEditTask({ ...editTask, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button type="submit" className="bg-purple-600 text-white px-5 rounded-lg">Update</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-300 dark:bg-gray-700 dark:text-white text-black px-5 rounded-lg">Cancel</button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Modal: Reusable overlay
const Modal = ({ children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
    {children}
  </div>
);

// Task card component (reusable, colorful)
const TaskCard = ({ task, handleEdit, handleDelete }) => (
  <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-4 shadow-xl hover:shadow-2xl transition">
    <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-300">{task.title}</h3>
    <p className="mb-2 text-gray-700 dark:text-gray-300">{task.description}</p>
    <span className={`px-3 py-1 text-sm rounded-full font-bold ${
      task.status === 'completed'
        ? 'bg-green-100 text-green-700'
        : task.status === 'in-progress'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-blue-100 text-blue-700'
    }`}>
      {task.status}
    </span>
    <div className="mt-3 text-xs text-gray-400">
      Created: {new Date(task.createdAt).toLocaleDateString()}
    </div>
    <div className="flex gap-3 mt-3">
      <button
        className="text-white px-4 py-1 rounded-lg font-bold bg-purple-500 hover:bg-purple-700 transition"
        onClick={() => handleEdit(task)}
      >
        Edit
      </button>
      <button
        className="text-white px-4 py-1 rounded-lg font-bold bg-red-500 hover:bg-red-700 transition"
        onClick={() => handleDelete(task._id)}
      >
        Delete
      </button>
    </div>
  </div>
);

export default Dashboard;
