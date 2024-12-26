import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-100 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">MoiMoi - Translate</h2>
          <p className="text-sm mt-2">
            Breaking language barriers and connecting the world.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-twitter fa-lg"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-instagram fa-lg"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-linkedin fa-lg"></i>
          </a>
        </div>

        <div className="text-center md:text-right mt-4 md:mt-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MoiMoi - Translate. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
