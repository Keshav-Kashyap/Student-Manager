const express = require('express');
const router = express.Router();
const { createProfile, getProfile,updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');


router.post('/create', auth, createProfile);
router.get('/me', auth, getProfile);
router.put('/update', auth, updateProfile);

module.exports = router;