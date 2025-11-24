import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user?.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p>{task.description}</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
