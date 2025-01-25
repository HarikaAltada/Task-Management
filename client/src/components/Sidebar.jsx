import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faComments, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation

const Sidebar = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleLogout = () => {
    // Perform any logout logic here, like clearing tokens or user data
    navigate("/"); // Redirect to the home route
  };

  return (
    <div className="w-64 h-screen bg-[#202D48] text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-blue-700">
        Task Management
      </div>
      <ul className="mt-6 space-y-2 flex-grow">
        <li>
          <Link
            to="/dashboard" // Navigate to Dashboard route
            className="flex items-center px-4 py-2 text-white hover:bg-blue-800 hover:text-white"
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="text-lg mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/feed" // Navigate to Feed route
            className="flex items-center px-4 py-2 text-white hover:bg-blue-800 hover:text-white"
          >
            <FontAwesomeIcon icon={faComments} className="text-lg mr-2" />
            Feed
          </Link>
        </li>
      </ul>
      <div className="p-4">
        <button
          onClick={handleLogout} // Handle logout on click
          className="flex items-center w-full px-4 py-2 text-left text-white hover:bg-blue-800 hover:text-white"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-lg mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
