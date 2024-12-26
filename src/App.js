import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./layouts/Header";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Quizz from "./pages/Quizz";
import About from "./pages/About";
import Error from "./pages/Error";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/quizz" element={<Quizz />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
