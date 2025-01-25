import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar
import { Outlet } from "react-router-dom"; // Outlet to render nested routes

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content (changes based on the route) */}
      <div className="flex-1 p-6">
        <Outlet /> {/* This will render the component corresponding to the route */}
      </div>
    </div>
  );
};

export default Layout;
