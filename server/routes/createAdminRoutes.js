const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = new User({ name, email, password, role: 'admin' });
    await admin.save();
    res.status(201).json({ success: true, message: 'Admin created successfully' });
  } catch (err) {
    console.error('Admin create error:', err.message);
    res.status(500).json({ success: false, message: 'Error creating admin' });
  }
});

module.exports = router;
