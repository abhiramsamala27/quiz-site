const Question = require('../models/Question');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    console.log('Login attempt for:', email);
    if (!admin) {
      console.log('Admin not found in database');
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await admin.comparePassword(password);
    console.log('Password match status:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const total = await Question.countDocuments();
    const questions = await Question.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ total, questions, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(question);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const count = await Question.countDocuments();
    if (count <= 20) {
      return res.status(400).json({ message: 'Cannot delete. Minimum 20 questions required for the quiz.' });
    }
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResults = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // search by name or email
  const search = req.query.search || '';
  
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  try {
    const Result = require('../models/Result');
    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const allStats = await Result.aggregate([
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: "$score" },
          highestScore: { $max: "$score" }
        }
      }
    ]);

    const stats = allStats[0] || { totalAttempts: 0, avgScore: 0, highestScore: 0 };

    res.json({ total, results, page, pages: Math.ceil(total / limit), stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.importQuestionsBulk = async (req, res) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of questions.' });
    }
    await Question.insertMany(questions);
    res.status(201).json({ message: `${questions.length} questions imported successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResultsAll = async (req, res) => {
  try {
    const Result = require('../models/Result');
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


