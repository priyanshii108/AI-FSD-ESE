/**
 * @file aiController.js
 * @description AI Recommendation Controller using OpenRouter API
 * Features: Promotion Recommendations, Employee Ranking, Training Suggestions, AI Feedback
 */

const Employee = require('../models/Employee');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
/**
 * Helper: Call OpenRouter API with a prompt
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @returns {string} AI response text
 */
const callOpenRouter = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Employee Analytics System',
    },
    body: JSON.stringify({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || 'OpenRouter API call failed');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

/**
 * @desc    Get AI recommendation for one or multiple employees
 * @route   POST /api/ai/recommend
 * @access  Protected
 */
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeIds } = req.body;

    if (!employeeIds || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of employee IDs' });
    }

    const employees = await Employee.find({ _id: { $in: employeeIds } });

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees found with provided IDs' });
    }

    const systemPrompt = `You are an expert HR AI assistant specializing in employee performance analysis.
    Your role is to provide:
    1. Promotion recommendations (who deserves promotion and why)
    2. Training suggestions (skills to improve)
    3. Performance feedback
    4. Career development advice
    Be concise, constructive, and data-driven. Format your response clearly.`;

    const employeeData = employees
      .map(
        (e) =>
          `- ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(', ')}`
      )
      .join('\n');

    const userPrompt = `Analyze the following employee(s) and provide:
    1. Promotion recommendation
    2. Training suggestions for skill enhancement
    3. Performance feedback
    4. Overall ranking if multiple employees

    Employee Data:
    ${employeeData}`;

    const aiResponse = await callOpenRouter(systemPrompt, userPrompt);

    // Save recommendation back to each employee
    for (const emp of employees) {
      await Employee.findByIdAndUpdate(emp._id, { aiRecommendation: aiResponse });
    }

    res.status(200).json({
      success: true,
      message: 'AI recommendation generated successfully',
      data: {
        recommendation: aiResponse,
        analyzedEmployees: employees.map((e) => ({ id: e._id, name: e.name, department: e.department })),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rank all employees using AI
 * @route   POST /api/ai/rank
 * @access  Protected
 */
const rankEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.status(404).json({ success: false, message: 'No employees to rank' });
    }

    const systemPrompt = `You are an HR analytics expert. Rank employees based on performance score, experience, and skills.
    Provide a numbered ranked list with brief justification for each rank.`;

    const employeeData = employees
      .map(
        (e) =>
          `- ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Experience: ${e.experience} yrs | Skills: ${e.skills.join(', ')}`
      )
      .join('\n');

    const userPrompt = `Rank the following employees from best to worst performer, providing ranked recommendations:\n${employeeData}`;

    const aiResponse = await callOpenRouter(systemPrompt, userPrompt);

    // Update rank field for each employee
    for (let i = 0; i < employees.length; i++) {
      await Employee.findByIdAndUpdate(employees[i]._id, { rank: i + 1 });
    }

    res.status(200).json({
      success: true,
      message: 'Ranked recommendations generated',
      data: {
        ranking: aiResponse,
        totalRanked: employees.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, rankEmployees };
