// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getCurrentUser, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser); // Get logged-in user

router.get('/', authMiddleware, getAllUsers);
module.exports = router;
