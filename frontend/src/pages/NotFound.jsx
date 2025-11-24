import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mb-4">Page Not Found</p>
      <p className="text-gray-500 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
