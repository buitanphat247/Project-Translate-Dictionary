import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gray-800 text-gray-100 py-4 shadow-lg">
      <nav className="container mx-auto flex flex-col items-center px-4 space-y-4">
        {/* Logo */}
        <div className="text-2xl font-bold">MoiMoi - Translate</div>
        {/* Menu */}
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 hover:text-gray-400 ${
                isActive ? "text-gray-400" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/quizz"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 hover:text-gray-400 ${
                isActive ? "text-gray-400" : ""
              }`
            }
          >
            Quizz
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-lg font-medium transition-colors duration-200 hover:text-gray-400 ${
                isActive ? "text-gray-400" : ""
              }`
            }
          >
            About
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
