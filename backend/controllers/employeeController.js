/**
 * @file employeeController.js
 * @description Controller functions for Employee CRUD operations
 * Handles: Add, Get All, Get One, Update, Delete, Search by Department
 */

const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

/**
 * @desc    Add a new employee
 * @route   POST /api/employees
 * @access  Protected
 */
const addEmployee = async (req, res, next) => {
  try {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An employee with this email already exists' });
    }

    const employee = await Employee.create({ name, email, department, skills, performanceScore, experience });

    res.status(201).json({
      success: true,
      message: 'Employee stored successfully',
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all employees (with optional sorting)
 * @route   GET /api/employees
 * @access  Protected
 */
const getAllEmployees = async (req, res, next) => {
  try {
    const { sortBy = 'performanceScore', order = 'desc', page = 1, limit = 50 } = req.query;
    const sortOrder = order === 'asc' ? 1 : -1;

    const employees = await Employee.find()
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Employee.countDocuments();

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get employee by ID
 * @route   GET /api/employees/:id
 * @access  Protected
 */
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search/filter employees by department, skill, or performance
 * @route   GET /api/employees/search
 * @access  Protected
 */
const searchEmployees = async (req, res, next) => {
  try {
    const { department, skill, minScore, maxScore, name } = req.query;
    const query = {};

    if (department) query.department = department;
    if (skill) query.skills = { $in: [new RegExp(skill, 'i')] };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = parseFloat(minScore);
      if (maxScore) query.performanceScore.$lte = parseFloat(maxScore);
    }
    if (name) query.name = { $regex: name, $options: 'i' };

    const employees = await Employee.find(query).sort({ performanceScore: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update employee details
 * @route   PUT /api/employees/:id
 * @access  Protected
 */
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Updated data shown', data: employee });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Protected
 */
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
};
