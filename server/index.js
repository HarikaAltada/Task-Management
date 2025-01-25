

const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const authRoutes = require("./routes/auth");
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const postRoutes = require("./routes/postRoutes");
const sendgrid = require("@sendgrid/mail");
dotenv.config();


const app = express();
app.use(cors());  // Add this line
app.use(bodyParser.json());
// Set your SendGrid API key
// sendgrid.setApiKey("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");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  });

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);
app.use("/api/posts", postRoutes);

// Store OTPs in memory (for demo purposes, use a database in production)
const otpStore = {};


// Route to send OTP
app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP logic here

    // Send OTP via SendGrid email
    await sendgrid.send({
      to: email,
      from: process.env.SENDGRID_SENDER_EMAIL,
      subject: "Your OTP Code",
      text: "Your OTP code is: 123456",
    });

    res.status(200).send({ message: "OTP sent successfully!" });
  } catch (error) {
   
    res.status(500).send({ message: "Failed to send OTP" });
  }
});

// Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ message: "OTP not found" });
  }

  const { otp: storedOtp, otpExpiry } = storedOtpData;

  if (Date.now() > otpExpiry) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (otp !== storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP verified successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
