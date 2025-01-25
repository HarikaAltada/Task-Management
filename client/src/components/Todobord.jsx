import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskColumn from "./Taskcolumn"; // Import the TaskColumn component

const TodoBoard = () => {
  const [tasks, setTasks] = useState({
    toStart: [],
    inProgress: [],
    completed: [],
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    status: "toStart", // Default status to "toStart"
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/tasks", newTask);
      setTasks((prev) => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], response.data],
      }));
      setShowModal(false);
      setNewTask({ title: "", description: "", date: "", status: "toStart" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const handleEditTask = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask);
      fetchTasks(); // Reload tasks after update
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks(); // Reload tasks after delete
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDropTask = (taskId, targetStatus) => {
    const task = Object.values(tasks).flat().find((task) => task._id === taskId);
    if (task && task.status !== targetStatus) {
      updateTaskStatus(taskId, targetStatus);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-700">TaskBoard</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-[#334977] text-white rounded-lg"
          >
            <span className="text-lg mr-2">+</span> New Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <TaskColumn
          title="Pending"
          tasks={tasks.toStart}
          color="text-yellow-600"
          onEdit={(task) => {
            setTaskToEdit(task);
            setShowEditModal(true);
          }}
          onDelete={(taskId) => {
            setTaskToDelete(taskId);
            setShowDeleteModal(true);
          }}
          onDropTask={(taskId) => handleDropTask(taskId, "toStart")}
        />
        <TaskColumn
          title="In Progress"
          tasks={tasks.inProgress}
          color="text-blue-600"
          onEdit={(task) => {
            setTaskToEdit(task);
            setShowEditModal(true);
          }}
          onDelete={(taskId) => {
            setTaskToDelete(taskId);
            setShowDeleteModal(true);
          }}
          onDropTask={(taskId) => handleDropTask(taskId, "inProgress")}
        />
        <TaskColumn
          title="Completed"
          tasks={tasks.completed}
          color="text-green-600"
          onEdit={(task) => {
            setTaskToEdit(task);
            setShowEditModal(true);
          }}
          onDelete={(taskId) => {
            setTaskToDelete(taskId);
            setShowDeleteModal(true);
          }}
          onDropTask={(taskId) => handleDropTask(taskId, "completed")}
        />
      </div>


      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg  w-[480px] h-[450px]">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleTaskChange}
                placeholder="Task Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleTaskChange}
                placeholder="Task Description"
                className="w-full px-4 py-2  h-[150px] border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              ></textarea>
              <input
                type="date"
                name="date"
                value={newTask.date}
                onChange={handleTaskChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  className="px-4 py-2 bg-[#334977] text-white rounded-lg "
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Task Modal */}
      {showEditModal && taskToEdit && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[480px] h-[380px]">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Edit Task</h2>
            <input
              type="text"
              value={taskToEdit.title}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <textarea
              value={taskToEdit.description}
              onChange={(e) => setTaskToEdit({ ...taskToEdit, description: e.target.value })}
              className="w-full px-4 py-2 h-[150px] border border-gray-300 rounded-lg mt-4"
            ></textarea>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditTask(taskToEdit)}
                className="px-4 py-2 bg-[#334977] text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Task Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Are you sure you want to delete this task?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(taskToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoBoard;
