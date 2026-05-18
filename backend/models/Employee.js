/**
 * @file Employee.js
 * @description Mongoose schema and model for Employee
 * Includes validation, indexing, and data sanitization
 */

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Development', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations', 'Design', 'QA'],
        message: '{VALUE} is not a valid department',
      },
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Skills array cannot be empty',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Performance score must be at least 0'],
      max: [100, 'Performance score must not exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience value seems too high'],
    },
    aiRecommendation: {
      type: String,
      default: null,
    },
    rank: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster department-based filtering
employeeSchema.index({ department: 1 });
employeeSchema.index({ performanceScore: -1 });
employeeSchema.index({ email: 1 }, { unique: true });

// Virtual: Performance level classification
employeeSchema.virtual('performanceLevel').get(function () {
  if (this.performanceScore >= 80) return 'High';
  if (this.performanceScore >= 50) return 'Medium';
  return 'Low';
});

module.exports = mongoose.model('Employee', employeeSchema);
