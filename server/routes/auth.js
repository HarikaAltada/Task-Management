const express = require("express");
const router = express.Router();
const User = require("../model/User");

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
