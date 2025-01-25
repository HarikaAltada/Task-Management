// passwordReset.js (Backend)

const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Setup SendGrid API (or you can use Nodemailer with SMTP)
const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'your-sendgrid-user',
    pass: 'your-sendgrid-password',
  },
});

// Route to send OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Generate OTP (4-digit random number)
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Store OTP in the user's document (in a new field or separate collection)
  user.resetPasswordOtp = otp;
  await user.save();

  // Send OTP to user's email
  const mailOptions = {
    from: 'no-reply@yourapp.com',
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for resetting the password is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending OTP' });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  if (user.resetPasswordOtp === otp) {
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// Route to reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = router;
