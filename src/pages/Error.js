import React from "react";

const Error = () => {
  return (
    <div className="bg-gray-800 text-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg mb-6 text-center max-w-md">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
      >
        Go Back Home
      </a>
    </div>
  );
};

export default Error;
