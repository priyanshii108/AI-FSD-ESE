/**
 * @file employeeRoutes.js
 * @description Employee API routes with validation and auth protection
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules for adding/updating an employee
const employeeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['Development', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations', 'Design', 'QA'])
    .withMessage('Invalid department'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('performanceScore')
    .notEmpty()
    .withMessage('Performance score is required')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Performance score must be between 0 and 100'),
  body('experience').notEmpty().withMessage('Experience is required').isInt({ min: 0 }).withMessage('Experience must be a non-negative integer'),
];

// ─── ROUTES ──────────────────────────────────────────────────────────────────

// Search must come before /:id to avoid conflict
router.get('/search', protect, searchEmployees);

router.route('/')
  .get(protect, getAllEmployees)
  .post(protect, employeeValidation, addEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
