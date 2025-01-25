import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/Forget-Password";
import CodeVerification from "./components/CodeVerfication"

import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
const App = () => {
  return (
    <Router>
      <div>
      <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/code-verfication" element={<CodeVerification />} />
         
        
          {/* Protected routes wrapped with Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/feed" element={<Feed />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
