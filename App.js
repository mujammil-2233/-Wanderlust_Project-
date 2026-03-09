import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import LoginForm from "./Login";
import ListingsPage from "./ListingsPage";

const App = () => {
  return (
    <Router>
      <div className="app" style={{ minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/listings" element={<ListingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
