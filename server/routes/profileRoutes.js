const express = require('express');
const router = express.Router();
const { createProfile, getProfile,updateProfile, getAllUsersProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, createProfile);
router.get('/me', auth, getProfile);
router.put('/update', auth, updateProfile);
router.get('/', auth, getAllUsersProfile);
router.get('/:userId/students', auth, getUserStudents);
module.exports = router;