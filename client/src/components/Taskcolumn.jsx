import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing FontAwesome icons

const TaskColumn = ({ title, tasks, color, onEdit, onDelete, onDropTask }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("taskId");
        onDropTask(taskId);
      };
    
      const handleDragOver = (e) => {
        e.preventDefault();
      };
  return (
    <div onDrop={handleDrop}
    onDragOver={handleDragOver}>
      <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
      <div className="space-y-4 mt-4">
        {tasks.map((task) => (
          <div key={task._id} className="p-4 bg-white rounded-lg shadow relative cursor-pointer" draggable
          onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}>
            <h1 className="font-semibold text-gray-800">{task.title}</h1>
            <p className="text-gray-600 text-sm">{task.description}</p>
            <p className="text-gray-400 text-xs mt-2">{task.date}</p>
            
            {/* Edit and Delete Icons */}
            <div className="absolute top-2 right-2 space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="text-[#334977] hover:text-blue-700"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
