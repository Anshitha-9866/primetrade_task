import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    api.get('/user/profile').then((res) => {
      setUser(res.data);
      setForm({ name: res.data.name, email: res.data.email, password: '' });
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await api.put('/user/profile', form);
    setUser(res.data);
    setForm({ ...form, password: '' });
    setEdit(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-emerald-100 dark:from-gray-900 dark:to-purple-900 px-2 py-8">
      <div className="max-w-xl w-full mx-auto bg-gradient-to-tr from-white via-blue-50 to-purple-100 dark:bg-gradient-to-tr dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-transparent bg-clip-text mb-8 text-center drop-shadow-lg">
          Profile
        </h2>
        <div className="mb-7 flex items-center gap-8 justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-4xl font-extrabold shadow-lg border-4 border-white dark:border-purple-700">
            {user?.name?.[0] || user?.email?.[0] || "U"}
          </div>
          <div>
            <div className="font-black text-2xl text-blue-700 dark:text-blue-300">{user?.name}</div>
            <div className="text-md text-purple-600 dark:text-purple-300">{user?.email}</div>
            <div className="text-xs text-gray-500 mt-2">Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</div>
          </div>
        </div>
        {!edit ? (
          <button
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-white rounded-xl px-5 py-2 font-bold block mx-auto shadow-lg hover:bg-purple-600 transition"
            onClick={() => setEdit(true)}
          >
            Edit Profile
          </button>
        ) : (
          <form onSubmit={handleUpdate} className="mt-6 flex flex-col gap-4">
            <input
              className="border px-3 py-2 rounded-lg"
              type="text"
              placeholder="Name"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded-lg"
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="border px-3 py-2 rounded-lg"
              type="password"
              placeholder="New password (optional)"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <div className="flex gap-3 justify-center">
              <button type="submit" className="bg-blue-500 text-white px-5 rounded-lg font-bold">Save</button>
              <button type="button" onClick={() => setEdit(false)} className="bg-gray-300 text-black px-5 rounded-lg font-bold">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
