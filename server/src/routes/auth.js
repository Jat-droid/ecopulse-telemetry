const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// --- ROUTE 1: STANDARD LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Seed a default admin if the database is completely empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ email: 'admin@ecopulse.com', password: hashedPassword, role: 'Admin', name: 'System Admin' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found in system matrix." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ROUTE 2: PASSWORD RECOVERY (This is what was missing!) ---
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 1. Find the user by their target email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No authorized operator found with this email." });
    }

    // 2. Hash the new password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Update the database record
    user.password = hashedPassword;
    await user.save();

    // 4. Send success response back to React
    res.json({ message: "Cipher matrix successfully updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;