const express = require('express');
const router = express.Router();
const { getAllUsersProfileAnalytics } = require('../controllers/AdminAnalyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

//  Only Admins can access this
router.get('/', authMiddleware, isAdmin, getAllUsersProfileAnalytics);



module.exports = router;
