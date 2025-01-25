const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  status: String, // "toStart", "inProgress", "completed"
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
