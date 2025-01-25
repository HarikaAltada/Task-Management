const express = require("express");
const Task = require("../model/Taskmodal");

const router = express.Router();

router.get("/tasks", async (req, res) => {
  try {
    const toStart = await Task.find({ status: "toStart" });
    const inProgress = await Task.find({ status: "inProgress" });
    const completed = await Task.find({ status: "completed" });

    res.json({ toStart, inProgress, completed });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Failed to add task" });
  }
});
// Delete a task by ID
router.delete("/tasks/:id", async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await Task.findByIdAndDelete(taskId);
  
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });
  
  // Edit a task by ID
  router.put("/tasks/:id", async (req, res) => {
    try {
      const taskId = req.params.id;
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
  
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });
  
module.exports = router;

