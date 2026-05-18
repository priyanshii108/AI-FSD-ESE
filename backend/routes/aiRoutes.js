/**
 * @file aiRoutes.js
 * @description AI recommendation API routes
 */

const express = require('express');
const router = express.Router();
const { getRecommendation, rankEmployees } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/recommend - Get AI recommendation for employee(s)
router.post('/recommend', protect, getRecommendation);

// POST /api/ai/rank - Rank all employees using AI
router.post('/rank', protect, rankEmployees);

module.exports = router;
