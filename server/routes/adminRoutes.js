const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/stats', protect, requireAdmin, getStats);

module.exports = router;
